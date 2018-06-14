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

          const baseControl = this.exConf[ base.exName ].productConf[ base.productCode ];
          const validControl = this.exConf[ valid.exName ].productConf[ valid.productCode ];
          const cost = new this.Schemas.CostParams( { productCode: base.productCode, baseExName: base.exName, validExName: valid.exName } );
          const currencyCode = this.getCurrencyCode( base.exName, base.productCode );
          const fiatCode = this.getFiatCode( base.exName, base.productCode );
          base.fiatBalance = Number( balanceParams.filter( bp => bp.exName === base.exName )[ 0 ].response );
          valid.fiatBalance = Number( balanceParams.filter( bp => bp.exName === valid.exName )[ 0 ].response );

          if( base.fiatBalance === 0 ) return false;                            // 購入余力が0の場合
          if( !baseControl.enable ) return false;                               // 購入元取引所の通貨ペアが有効でない場合
          if( !validControl.enable ) return false;                              // 売却先取引所の通貨ペアが有効でない場合

          /**************************/
          /*  裁定に必要な閾値を算出    */
          /**************************/

          // 裁定に必要な粗利率を算出する
          let { arbitrageProfitRate: productArbitrageProfitRate } = this.productConf[ base.productCode ];
          const { arbitrageProfitRate: generalArbitrageProfitRate } = this.generalConf;
          productArbitrageProfitRate = ( productArbitrageProfitRate - 1 ).toFixed( 3 );
          const profitThresholdRate = 1 + ( this.util.multiply( productArbitrageProfitRate, generalArbitrageProfitRate ) );

          // 裁定に必要な粗利量を算出
          const profitThresholdAmount = this.util.multiply( base.fiatBalance, profitThresholdRate );

          /**************************/
          /*  売上を算出              */
          /**************************/

          // 実際の売上率を算出
          const profitRealRate = this.util.division( valid.ltp, base.ltp, 5 );

          // 実際の売上量を算出
          const saleRealAmount = this.util.multiply( base.fiatBalance , profitRealRate, 5 );

          /**************************/
          /*  購入額 | 売却額 | 費用   */
          /**************************/

          // 通貨の購入額を取得
          base.tradeAmount = this.util.division( base.fiatBalance, base.ltp, 4 );

          cost.setAsks( base );
          cost.setWithDraws( base );

          // 通過の売却額を取得( 購入額から送金手数料(暗号通貨単位)を差し引く )
          valid.tradeAmount = this.util.getDecimel( base.tradeAmount - cost.withDraw, 5 );

          cost.setBids( base, valid );
          cost.setTotalFiat();

          /**************************/
          /*  粗利を算出              */
          /**************************/

          // 法定通貨の粗利を取得
          const profitRealAmount = saleRealAmount - cost.totalFiat;

          /**************************/
          /*  裁定の実施判定          */
          /**************************/

          // 裁定実行フラグ
          const isArbitrage = profitThresholdAmount < profitRealAmount;

          /**************************/
          /*  DEBUG                 */
          /**************************/

          const debugSummary = `${isArbitrage} BUY: ${base.fiatBalance}${fiatCode}`;
          const debugBase = `${base.exName}[ ${base.tradeAmount}${currencyCode} : ${base.ltp}${fiatCode} ]`;
          const debugValid = `SELL: ${valid.exName}[ ${valid.tradeAmount}${currencyCode}( -${cost.withDraw}${currencyCode} ) : ${valid.ltp}${fiatCode} ]`;
          const debugThreashold = `THRESHOLD ${profitThresholdAmount}[ ${profitThresholdRate} ]`;
          const debugReal =  `REAL ${profitRealAmount}( ${ saleRealAmount } - ${ cost.totalFiat }${fiatCode} )[ ${profitRealRate} ]`;
          const debug = `${debugSummary} ( ${debugBase} ${debugValid} ) ${debugReal} ${debugThreashold} `

          Logs.searchArbitorage.debug( debug );
          console.log( debug );

          // アビトラージが成立する場合
          if( isArbitrage ){

            //Logs.arbitorage.info( `ARBITRAGE! ¥${profitAmount} [ ${base.exName}(${base.productCode}) to ${valid.exName}(${valid.productCode}) ]`, 'strong' );
            const arbitrageData = new this.Schemas.ArbitrageData({
              productCode: base.productCode,
              exName: base.exName,
              profitRealAmount,
              profitRealRate,
              profitThresholdAmount,
              profitThresholdRate,
              fiatCode,
              cost,
              base,
              valid,
            });
            arbitrageDatas.push( arbitrageData );
          }
        });
      });
      resolve( arbitrageDatas );
    });
  }

  async getBestArbitrageData( arbitrageDatas ){
    return new Promise( ( resolve, reject ) => {
      let bestArbitrageData = new this.Schemas.ArbitrageData();
      let bestProfitRealAmount = 0;
      if( arbitrageDatas.length > 0 ){
        arbitrageDatas.forEach( ( arbitrageData, index ) => {
          if( bestProfitRealAmount < arbitrageData.profitRealAmount ){
            bestProfitRealAmount = arbitrageData.profitRealAmount;
            bestArbitrageData = arbitrageData;
          }
        });
      }
      if( bestProfitRealAmount > 0 ){
        Logs.arbitorage.debug( bestArbitrageData );
      }
      resolve( bestArbitrageData );
    });
  }

  async getRefrectedTrendParams( bestArbitrageData, logsLtpParams, addLtpParams ){
    return new Promise( ( resolve, reject ) => {
      const { logLtpParamsAmount } = this.generalConf.trendMode;
      this.logsLtpParams = logsLtpParams;
      this.logsLtpParams.unshift( addLtpParams );

      if( bestArbitrageData.exist ){

        bestArbitrageData = this._getRefrectedTrendParams( bestArbitrageData, logsLtpParams );
      }

      if( logLtpParamsAmount <= this.logsLtpParams.length ){
        this.logsLtpParams.pop();
      }

      resolve( bestArbitrageData );
    });
  }

  _getRefrectedTrendParams( bestArbitrageData, logLtpParams ){

      const { TrendParams } = this.Schemas;
      const { productCode } = bestArbitrageData;
      const baseCurrencyCode = productCode.split('_')[ 0 ];
      const logLtpParamsLastIndex = logLtpParams.length - 1 ;
      const latestAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, logLtpParams[ 0 ] );
      const oldestAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, logLtpParams[ logLtpParamsLastIndex ] );
      let reBaseAvalageLtp = oldestAvalageLtp;

      bestArbitrageData.trend.mode = this.getTrendMode( productCode, oldestAvalageLtp, latestAvalageLtp );

      // 乱高下(チョッピー)チェック( 新しいデータからループでまわす )
      logLtpParams.forEach( ( loopLtpParams, index ) => {

        if( index === 0 ){
          return;

        }else if( logLtpParamsLastIndex === index ){

          const existUP = bestArbitrageData.trend.lv[ TrendParams.MODE_UP ] > 0 ;
          const existDOWN = bestArbitrageData.trend.lv[ TrendParams.MODE_DOWN ] > 0;

          if( existUP && existDOWN ){
            bestArbitrageData.trend.mode = TrendParams.MODE_CHOPPY;
            bestArbitrageData.trend.lv[ TrendParams.MODE_CHOPPY ] =
              Math.floor( bestArbitrageData.trend.lv[ TrendParams.MODE_UP ] + bestArbitrageData.trend.lv[ TrendParams.MODE_DOWN ] ) / 2 ;
          }else if( existUP ){
            bestArbitrageData.trend.mode = TrendParams.MODE_UP;
          }else if( existDOWN ){
            bestArbitrageData.trend.mode = TrendParams.MODE_DOWN;
          }
          //console.log( `${baseCurrencyCode} ${index} ${ JSON.stringify( trendParams.lv ) }` );

        }else{
          const loopAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, loopLtpParams );
          const loopTrendMode = this.getTrendMode( productCode, reBaseAvalageLtp, loopAvalageLtp );

          bestArbitrageData.trend.lv[ loopTrendMode ]++;

          //console.log( ` - loop ${index} ${loopTrendMode} base: ${reBaseAvalageLtp } loop: ${loopAvalageLtp}`  );

          if( loopTrendMode !== SetStatus.MODE_NORMAL ){
            //reBaseAvalageLtp = loopAvalageLtp;
          }
        }
      });
      return bestArbitrageData;

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
