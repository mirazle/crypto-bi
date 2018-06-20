import Logics from './Logics';
import confControl from '../conf/control';
import exchanges from '../exchanges/';
import Logs from '../Logs/';

export default class SetStatus extends Logics{

  constructor( params ){
    super();
    this.exConf = params.exConf;
    this.productConf = params.productConf;
    this.generalConf = params.generalConf;

    this.logsLtpParams;
  }

  async test(){
    exchanges.quoinex.order({
      order_type: "limit",
      product_id: 1,
      side: 'buy',
      quantity: "0.01",
      price: "500.0"
    })
  }

  async getBalanceParams(){
    return new Promise( ( resolve, reject ) => {

      let promises = [], params = [];

      for( let exName in this.exConf ){
        if(  exchanges[ exName ] &&  exchanges[ exName ].getBalance ){
          params.push({ exName, response: {} });
          promises.push( exchanges[ exName ].getBalance() );
        }
      }

      Promise.all( promises ).then( ( responses ) => {
        const balanceParams = params.map( ( param, index ) => {
          param.response = responses[ index ];
          return param;
        });
        resolve( balanceParams );
      });
    });
  }

  async getExParams(){
    return new Promise( ( resolve, reject ) => {

      let promises = [], params = [];

      for( let exName in this.exConf ){
        for( let productCode in this.productConf ){
          const exProductCode = this.getExProductCode( exName, productCode );
          params.push({ exName, productCode, exProductCode, ltp: null });
          promises.push( exchanges[ exName ].getLtp( exProductCode ));
        }
      }

      Promise.all( promises ).then( ( ltps ) => {
        const ltpParams = params.map( ( param, index ) => {
          return new this.Schemas.ExParams( {...param, ltp: ltps[ index ]} );
        });
        resolve( ltpParams );
      });
    });
  }

  getExParamsFilteredNull( ltpParams ){
    return ltpParams.filter( param => param.ltp !== null );
  }

  async getArbitrageDatas( balanceParams, ltpParams ){
    return new Promise( ( resolve, reject ) => {
      let arbitrageDatas = [];

      Logs.searchArbitorage.debug( "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
      ltpParams.forEach( ( base ) => {
        ltpParams.forEach( ( valid ) => {
          if( base.exName === valid.exName ) return false;
          if( base.productCode !== valid.productCode ) return false;
          if( base.ltp === 0 || valid.ltp === 0 ) return false;
          if( base.ltp > valid.ltp ) return false;
          if( !this.exConf[ base.exName ].withDrawApi ) return false;           // 送金APIがない取引所の場合

          const { env, devFiatBalance } = this.generalConf;
          const baseControl = this.exConf[ base.exName ].productConf[ base.productCode ];
          const validControl = this.exConf[ valid.exName ].productConf[ valid.productCode ];
          const currencyCode = this.getCurrencyCode( base.exName, base.productCode );
          const fiatCode = this.getFiatCode( base.exName, base.productCode );
          base.fiatBalance = Number( balanceParams.filter( bp => bp.exName === base.exName )[ 0 ].response );
          valid.fiatBalance = Number( balanceParams.filter( bp => bp.exName === valid.exName )[ 0 ].response );

          if( env === 'DEV' && devFiatBalance !== 0  ){
            base.fiatBalance = devFiatBalance;
          }else if( env === 'PROD' && devFiatBalance !== 0  ){                  // 購入余力が0の場合
            base.fiatBalance = devFiatBalance;
          }
          if( !baseControl.enable ) return false;                               // 購入元取引所の通貨ペアが有効でない場合
          if( !validControl.enable ) return false;                              // 売却先取引所の通貨ペアが有効でない場合

          /**************************/
          /*  インスタンス生成         */
          /**************************/

          const arbitrageData = new this.Schemas.ArbitrageData({base, valid, productCode: base.productCode});
          const profit = new this.Schemas.ProfitParams();
          const threshold = new this.Schemas.ThresholdParams();
          const cost = new this.Schemas.CostParams({base, valid});

          /**************************/
          /*  裁定に必要な閾値を算出    */
          /**************************/

          // 裁定に必要な粗利率を算出する
          const productArbitrageProfitRate = ( this.productConf[ base.productCode ].arbitrageProfitRate - 1 ).toFixed( 3 );
          threshold.profitRate = 1 + ( Math.multiply( productArbitrageProfitRate, this.generalConf.arbitrageProfitRate ) );

          // 裁定に必要な粗利量を算出
          threshold.profitAmount = Math.multiply( base.fiatBalance, threshold.profitRate );

          /**************************/
          /*  売上を算出              */
          /**************************/

          // 実際の売上率を算出
          profit.rate = Math.division( valid.ltp, base.ltp );

          // 実際の売上量を算出
          profit.saleRealAmount = Math.multiply( base.fiatBalance , profit.rate );

          /**************************/
          /*  購入額 | 売却額 | 費用   */
          /**************************/

          cost.setInFiat();

          // 通貨の購入額を取得
          base.tradeAmount = Math.division( base.fiatBalance, base.ltp );
          cost.setAsks( base );
          cost.setWithDraws( base );

          // 通過の売却額を取得( 購入額から送金手数料(暗号通貨単位)を差し引く )
          valid.tradeAmount = this.util.getDecimel( base.tradeAmount - cost.withDraw, 5 );

          cost.setBids( valid, profit.saleRealAmount );
          cost.setOutFiat( profit.saleRealAmount );
          cost.setTotalFiat();

          /**************************/
          /*  粗利を算出              */
          /**************************/

          // 法定通貨の粗利を取得
          profit.amount = profit.saleRealAmount - cost.totalFiat;

          /**************************/
          /*  裁定の実施判定          */
          /**************************/

          // 裁定実行フラグ
          arbitrageData.base = base;
          arbitrageData.valid = valid;
          arbitrageData.cost = cost;
          arbitrageData.profit = profit;
          arbitrageData.threshold = threshold;
          arbitrageData.cost = cost;
          arbitrageData.setIsArbitrage();

          /**************************/
          /*  DEBUG                 */
          /**************************/

          const debug = arbitrageData.getDebug();

          Logs.searchArbitorage.debug( debug );
          console.log( debug );

          // アビトラージが成立する場合
          if( arbitrageData.isArbitrage ){
            arbitrageDatas.push( arbitrageData );
          }
        });
      });
      resolve( arbitrageDatas );
    });
  }

  async getBestArbitrageData( arbitrageDatas ){
    return new Promise( ( resolve, reject ) => {
      const { orderToTrendMode } = this.generalConf;
      let bestArbitrageData = new this.Schemas.ArbitrageData();
      let bestProfitRealAmount = 0;
      if( arbitrageDatas.length > 0 ){
        arbitrageDatas.forEach( ( arbitrageData, index ) => {
          if( bestProfitRealAmount < arbitrageData.profit.amount ){
            if( orderToTrendMode.includes( arbitrageData.trend.mode ) ){
              bestProfitRealAmount = arbitrageData.profit.amount;
              bestArbitrageData = arbitrageData;
            }
          }
        });
      }

      if( bestArbitrageData.isArbitrage ){
        const debug = bestArbitrageData.getDebug()
        Logs.arbitorage.debug( debug );
        console.log("@@@ BEST: " + debug )
      }
      resolve( bestArbitrageData );
    });
  }

  async getRefrectedTrendParams( arbitrageDatas, logsLtpParams, addLtpParams ){
    return new Promise( ( resolve, reject ) => {
      const { logLtpParamsAmount } = this.generalConf.trendMode;
      this.logsLtpParams = logsLtpParams;
      this.logsLtpParams.unshift( addLtpParams );

      arbitrageDatas.forEach( ( arbitrageData, index ) => {
        if( arbitrageData.isArbitrage ){
          arbitrageDatas[ index ] = this._getRefrectedTrendParams( arbitrageData, logsLtpParams );
        }
      });

      if( logLtpParamsAmount <= this.logsLtpParams.length ){
        this.logsLtpParams.pop();
      }

      resolve( arbitrageDatas );
    });
  }

  _getRefrectedTrendParams( arbitrageData, logLtpParams ){

      const { TrendParams } = this.Schemas;
      const { productCode } = arbitrageData;
      const baseCurrencyCode = productCode.split('_')[ 0 ];
      const logLtpParamsLastIndex = logLtpParams.length - 1 ;
      const latestAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, logLtpParams[ 0 ] );
      const oldestAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, logLtpParams[ logLtpParamsLastIndex ] );
      let reBaseAvalageLtp = oldestAvalageLtp;

      arbitrageData.trend.mode = this.getTrendMode( productCode, oldestAvalageLtp, latestAvalageLtp );

      // 乱高下(チョッピー)チェック( 新しいデータからループでまわす )
      logLtpParams.forEach( ( loopLtpParams, index ) => {

        if( index === 0 ){
          return;

        }else if( logLtpParamsLastIndex === index ){

          const existUP = arbitrageData.trend.lv[ TrendParams.MODE_UP ] > 0 ;
          const existDOWN = arbitrageData.trend.lv[ TrendParams.MODE_DOWN ] > 0;

          if( existUP && existDOWN ){
            arbitrageData.trend.mode = TrendParams.MODE_CHOPPY;
            arbitrageData.trend.lv[ TrendParams.MODE_CHOPPY ] =
              Math.floor( arbitrageData.trend.lv[ TrendParams.MODE_UP ] + arbitrageData.trend.lv[ TrendParams.MODE_DOWN ] ) / 2 ;
          }else if( existUP ){
            arbitrageData.trend.mode = TrendParams.MODE_UP;
          }else if( existDOWN ){
            arbitrageData.trend.mode = TrendParams.MODE_DOWN;
          }
          //console.log( `${baseCurrencyCode} ${index} ${ JSON.stringify( trendParams.lv ) }` );

        }else{
          const loopAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, loopLtpParams );
          const loopTrendMode = this.getTrendMode( productCode, reBaseAvalageLtp, loopAvalageLtp );

          arbitrageData.trend.lv[ loopTrendMode ]++;

          //console.log( ` - loop ${index} ${loopTrendMode} base: ${reBaseAvalageLtp } loop: ${loopAvalageLtp}`  );

          if( loopTrendMode !== SetStatus.MODE_NORMAL ){
            //reBaseAvalageLtp = loopAvalageLtp;
          }
        }
      });
      return arbitrageData;
  }

  getTrendMode( productCode, baseAvalageLtp, validAvalageLtp ){
      const { TrendParams } = this.Schemas;
      const arbitrageProfitRate = this.productConf[ productCode ].arbitrageProfitRate * this.generalConf.arbitrageProfitRate;
      const risingAmount = Math.floor( baseAvalageLtp * arbitrageProfitRate );

      // 上昇トレンドチェックに入る場合( 1000 > ( 500 + 5 ) )
      if( validAvalageLtp > ( baseAvalageLtp + risingAmount ) ){
        return TrendParams.MODE_UP;
      // 下降トレンドチェックに入る場合( 1000 < ( 500 - 5 ) )
      }else if( validAvalageLtp < ( baseAvalageLtp - risingAmount ) ){
        return TrendParams.MODE_DOWN;
      }else{
        return TrendParams.MODE_NORMAL;
      }

  }

  getAvalageFromLtpParams( baseCurrencyCode, ltpParams ){
    let sumLtp = 0;
    const filter = ltpParams.filter( params => params.productCode.indexOf( baseCurrencyCode ) === 0 )
    const filteredNull = this.getExParamsFilteredNull( filter );
    filteredNull.forEach( ( param ) => sumLtp += param.ltp );
    return sumLtp > 0 ? Math.floor( sumLtp ) / filteredNull.length : 0 ;
  }

  getLatestlogsLtpParams(){
    return new Promise( ( resolve, reject ) => {
      resolve( this.logsLtpParams );
    });
  }

  // アビトラデータが存在して、トレンドモードが普通・上昇で、コストが妥当な場合b
  async getOrderParams( bestArbitrageData ){
    return new Promise( ( resolve, reject ) => {
      resolve( true );
    });
  }
}
