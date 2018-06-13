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

  async getRefrectedBalanceParams( bestArbitrageData ){
    return new Promise( ( resolve, reject ) => {

      const { exist, base, valid } = bestArbitrageData;

      if( exist ){

        let promises = [], promiseExTypes = [];

        if( exchanges[ base.exName ] && exchanges[ base.exName ].getBalance ){
          promiseExTypes.push( 'base' );
          promises.push( exchanges[ base.exName ].getBalance() );
        }

        if( exchanges[ valid.exName ] && exchanges[ valid.exName ].getBalance ){
          promiseExTypes.push( 'valid' );
          promises.push( exchanges[ valid.exName ].getBalance() );
        }

        Promise.all( promises ).then( ( responses ) => {
          promiseExTypes.forEach( ( promiseExType, index ) => {
            bestArbitrageData[ promiseExType ].fiatBalance = responses[ index ];
          });
          resolve( bestArbitrageData );
        });
      }else{
        resolve( bestArbitrageData );
      }
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
          if( !this.exConf[ base.exName ].withDrawApi  ) return false;           // 送金APIがない取引所では購入はしない

          // 資産状況を代入する
          base.fiatBalance = Number( balanceParams.filter( bp => bp.exName === base.exName )[ 0 ].response );
          valid.fiatBalance = Number( balanceParams.filter( bp => bp.exName === valid.exName )[ 0 ].response );

          if( base.fiatBalance > 0 ) return false;                              // 購入余力がない場合

          // TODO
          // そもそも、資産を保有している取引所に限定した上で、裁定取引の判定に入るべきでは？
          // 予算分,300000からコストを引いた分が購入金額になるはず( base.のexNameのfiatBalaneを設定するべき )
          // 変数名も分かり辛い
          // バグってはいない模様

          // 裁定率を算出する
          const { arbitrageProfitRate: generalArbitrageProfitRate } = this.generalConf;
          const { arbitrageProfitRate: productArbitrageProfitRate, askBalanceRate } = this.productConf[ base.productCode ];
          const arbitrageProfitRate = this.util.multiply( productArbitrageProfitRate, generalArbitrageProfitRate );

          // 資産状況から、コストを引いた、実際の購入額
          base.askBalanceAmount = base.fiatBalance;

          // 資産状況から、コストを引いた、実際の売却額
          valid.askBalanceAmount = base.fiatBalance;

          // 「実粗利」を算出
          const profitAmount = ( valid.askBalanceAmount > 0 && base.askBalanceAmount > 0 && valid.askBalanceAmount > base.askBalanceAmount ) ?
            Math.floor( valid.askBalanceAmount - base.askBalanceAmount ) : 0;

          // 「コスト」を取得
          const cost = this.getCostParams(  base, valid );

          // 資産状況から、コストを引いた、実際の購入額を算出
          const grossProfitAmount = profitAmount - cost.total;

          // 「必要粗利」を算出
          const arbitrageThresholdAmount = Math.floor( base.askBalanceAmount * arbitrageProfitRate );

          // 裁定実行フラグ
          const isArbitrage = arbitrageThresholdAmount !== 0 && base.askBalanceAmount < ( valid.askBalanceAmount - arbitrageThresholdAmount );

          const fiatCode = this.getFiatCode( base.exName, base.productCode );
          const debug = `${isArbitrage} ${profitAmount} BASE[ ${base.exName}(${base.productCode}: ${base.askBalanceAmount})] < VALID[ ${valid.exName}(${valid.productCode}: ( ${valid.askBalanceAmount} - ${arbitrageThresholdAmount} ) ) ] ${arbitrageProfitRate}`;

          Logs.searchArbitorage.debug( debug );

          // アビトラージが成立する場合
          if( isArbitrage ){

            //Logs.arbitorage.info( `ARBITRAGE! ¥${profitAmount} [ ${base.exName}(${base.productCode}) to ${valid.exName}(${valid.productCode}) ]`, 'strong' );
            const arbitrageData = new this.Schemas.ArbitrageData({
              productCode: base.productCode,
              exName: base.exName,
              grossProfitAmount,
              profitAmount,
              arbitrageThresholdAmount,
              arbitrageProfitRate,
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
      let bestProfitAmount = 0;
      if( arbitrageDatas.length > 0 ){
        arbitrageDatas.forEach( ( arbitrageData, index ) => {
          if( bestProfitAmount < arbitrageData.profitAmount ){
            bestProfitAmount = arbitrageData.profitAmount;
            bestArbitrageData = arbitrageData;
          }
        });
      }
      if( bestProfitAmount > 0 ){
        Logs.arbitorage.debug( bestArbitrageData );
      }
      resolve( bestArbitrageData );
    });
  }

  getCostParams( base, valid ){
    const costParams = new this.Schemas.CostParams;
    const { exName, productCode } = base;
    const { inFiatCost, outFiatCost, productConf } = this.exConf[ exName ];
    const { enable, askCost, withDrawCost, bidCost, withDrawCheckTransaction } = productConf[ productCode ];
    const fiatCode = this.getFiatCode( exName, productCode );
    const outFiatCostFix = outFiatCost[ fiatCode ].sep <= base.askBalanceAmount ? outFiatCost[ fiatCode ].high : outFiatCost[ fiatCode ].low ;

    if( enable ){
      costParams.inFiat = Number( inFiatCost[ fiatCode ] );
      costParams.ask = this.util.multiply( base.askBalanceAmount, askCost );
      costParams.withDraw = this.util.multiply( base.askBalanceAmount, withDrawCost );
      costParams.bid= this.util.multiply( valid.askBalanceAmount, bidCost );
      costParams.outFiat = Number( outFiatCostFix );
      costParams.setTotal();
    }
    return costParams;
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
