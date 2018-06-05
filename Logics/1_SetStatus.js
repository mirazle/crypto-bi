import Logics from './Logics';
import confControl from '../conf/control';
import exchanges from '../exchanges/';
import Logs from '../Logs/';

export default class SetStatus extends Logics{

  static get TREND_MODE_NORMAL(){ return 'NORMAL' };
  static get TREND_MODE_UP(){ return 'UP' };
  static get TREND_MODE_DOWN(){ return 'DOWN' };
  static get TREND_MODE_CHOPPY(){ return 'CHOPPY' };

  constructor( params ){
    super();
    this.exConf = params.exConf;
    this.productConf = params.productConf;
    this.generalConf = params.generalConf;
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

  async getLtpParams(){
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
          param.ltp = ltps[ index ];
          return param;
        });
        resolve( ltpParams );
      });
    });
  }

  getLtpParamsFilteredNull( ltpParams ){
    return ltpParams.filter( param => param.ltp !== null );
  }

  async getArbitrageDatas( ltpParams ){
    let arbitrageDatas = [];

    Logs.searchArbitorage.debug( "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );

    ltpParams.forEach( ( base ) => {
      ltpParams.forEach( ( valid ) => {
        if( base.exName === valid.exName ) return false;
        if( base.productCode !== valid.productCode ) return false;
        if( !this.exConf[ base.exName ].withDrawApi  ) return false;           // 送金APIがない取引所では購入はしない

        // 基本変数を定義
        const { arbitrageProfitRate: generalArbitrageProfitRate } = this.generalConf;
        const { arbitrageProfitRate: productArbitrageProfitRate, askBalanceRate } = this.productConf[ base.productCode ];
        const arbitrageProfitRate = productArbitrageProfitRate * generalArbitrageProfitRate;

        // 購入レートを反映
        base.askBalanceAmount = base.ltp * askBalanceRate;
        valid.askBalanceAmount = valid.ltp * askBalanceRate;

        // 裁定量の閾値を取得
        const arbitrageThresholdAmount = Math.floor( base.askBalanceAmount * arbitrageProfitRate );
        const profitAmount = Math.floor( valid.askBalanceAmount - base.askBalanceAmount );
        const isArbitrage = arbitrageThresholdAmount !== 0 && base.askBalanceAmount < ( valid.askBalanceAmount - arbitrageThresholdAmount );

        Logs.searchArbitorage.debug( `${isArbitrage} ${profitAmount} [ ${base.exName}(${base.productCode}) to ${valid.exName}(${valid.productCode}) ] ${base.askBalanceAmount} < ( ${valid.askBalanceAmount} - ${arbitrageThresholdAmount} )` );

        // アビトラージが成立する場合
        if( isArbitrage ){

          //Logs.arbitorage.info( `ARBITRAGE! ¥${profitAmount} [ ${base.exName}(${base.productCode}) to ${valid.exName}(${valid.productCode}) ]`, 'strong' );
          const arbitrageData = {
            productCode: base.productCode,
            profitAmount,
            arbitrageThresholdAmount,
            arbitrageProfitRate,
            base,
            valid
          }
          arbitrageDatas.push( arbitrageData );
        }
      });
    });
    return arbitrageDatas;
  }

  async getBestArbitrageData( arbitrageDatas ){
    let bestArbitrageData = {profitAmount:0, exist: false};
    let mostProritAmount = 0;
    if( arbitrageDatas.length > 0 ){
      arbitrageDatas.forEach( ( ad, index ) => {
        if( bestArbitrageData.profitAmount < ad.profitAmount){
          bestArbitrageData = ad;
        }
      });
    }
    if( bestArbitrageData.profitAmount > 0 ){
      Logs.arbitorage.debug( bestArbitrageData );
    }
    return bestArbitrageData;
  }

  async getRefrectedTrendModeParams( logsLtpParams, addLtpParams ){

    // 先頭にログを追加
    logsLtpParams.unshift( addLtpParams );

    // 安定している(急な上がり下がりrbitrageProfitRate分の上下がない)且つ、開始点と、終止点でarbitrageProfitRate分以上値が上昇している場合
    const trendModeParams = await this.getTrendModeParams( logsLtpParams );

    if( this.generalConf.trendMode.logLtpParamsAmount <= logsLtpParams.length ){

      // 後方からログを削除
      logsLtpParams.pop();
    }

    return {trendModeParams, logsLtpParams};
  }

  getCurrencyFromLtpParams( ltpParams, currencyCode = this.generalConf.baseCurrencyCode ){
    return ltpParams.filter( params => params.productCode.indexOf( currencyCode ) === 0 );
  }

  getAvalageFromLtpParams( baseCurrencyCode, ltpParams ){
    let sumLtp = 0;
    const filter = ltpParams.filter( params => params.productCode.indexOf( baseCurrencyCode ) === 0 )
    const filteredNull = this.getLtpParamsFilteredNull( filter );
    filteredNull.forEach( ( param ) => sumLtp += param.ltp );
    return sumLtp > 0 ? Math.floor( sumLtp ) / filteredNull.length : 0 ;
  }

  async getTrendModeParams( logLtpParams ){

    let trendModeParams = {}

    const getTrendMode = ( productCode, baseAvalageLtp, validAvalageLtp ) => {

      const arbitrageProfitRate = this.productConf[ productCode ].arbitrageProfitRate * this.generalConf.arbitrageProfitRate;
      const risingAmount = Math.floor( baseAvalageLtp * arbitrageProfitRate );

      // 上昇トレンドチェックに入る場合( 1000 > ( 500 + 5 ) )
      if( validAvalageLtp > ( baseAvalageLtp + risingAmount ) ){
        return SetStatus.TREND_MODE_UP;
      // 下降トレンドチェックに入る場合( 1000 < ( 500 - 5 ) )
      }else if( validAvalageLtp < ( baseAvalageLtp - risingAmount ) ){
        return SetStatus.TREND_MODE_DOWN;
      }else{
        return SetStatus.TREND_MODE_NORMAL;
      }
    }

    Object.keys( this.productConf ).forEach( ( productCode ) => {

      trendModeParams[ productCode ] = {
        productCode,
        trendMode: SetStatus.TREND_MODE_NORMAL,
        lv: {
            [ SetStatus.TREND_MODE_UP ]: 0,
            [ SetStatus.TREND_MODE_NORMAL ]: 0,
            [ SetStatus.TREND_MODE_DOWN ]: 0,
            [ SetStatus.TREND_MODE_CHOPPY ]: 0
        }
      };

      const baseCurrencyCode = productCode.split('_')[ 0 ];
      const logLtpParamsLastIndex = logLtpParams.length - 1 ;
      const latestAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, logLtpParams[ 0 ] );
      const oldestAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, logLtpParams[ logLtpParamsLastIndex ] );
      trendModeParams[ productCode ].trendMode = getTrendMode( productCode, oldestAvalageLtp, latestAvalageLtp );
      let reBaseAvalageLtp = oldestAvalageLtp;

      // 乱高下(チョッピー)チェック( 新しいデータからループでまわす )
      logLtpParams.forEach( ( loopLtpParams, index ) => {

        if( index === 0 ){
          return;
        }else if( logLtpParamsLastIndex === index ){

          const existUP = trendModeParams[ productCode ].lv[ SetStatus.TREND_MODE_UP ] > 0 ;
          const existDOWN = trendModeParams[ productCode ].lv[ SetStatus.TREND_MODE_DOWN ] > 0;

          if( existUP && existDOWN ){
            trendModeParams[ productCode ].trendMode = SetStatus.TREND_MODE_CHOPPY;
            trendModeParams[ productCode ].lv[ SetStatus.TREND_MODE_CHOPPY ] =
              ( trendModeParams[ productCode ].lv[ SetStatus.TREND_MODE_UP ] + trendModeParams[ productCode ].lv[ SetStatus.TREND_MODE_DOWN ] ) / 2 ;
          }else if( existUP ){
            trendModeParams[ productCode ].trendMode = SetStatus.TREND_MODE_UP;
          }else if( existDOWN ){
            trendModeParams[ productCode ].trendMode = SetStatus.TREND_MODE_DOWN;
          }
          //console.log( `${baseCurrencyCode} ${index} ${ JSON.stringify( trendModeParams[ productCode ].lv ) }` );
        }else{
          const loopAvalageLtp =  this.getAvalageFromLtpParams( baseCurrencyCode, loopLtpParams );
          const loopTrendMode = getTrendMode( productCode, reBaseAvalageLtp, loopAvalageLtp );

          trendModeParams[ productCode ].lv[ loopTrendMode ]++;

          //console.log( ` - loop ${index} ${loopTrendMode} base: ${reBaseAvalageLtp } loop: ${loopAvalageLtp}`  );

          if( loopTrendMode !== SetStatus.TREND_MODE_NORMAL ){
            //reBaseAvalageLtp = loopAvalageLtp;
          }
        }
      });
    });

    return trendModeParams;
  }

  // アビトラデータが存在して、トレンドモードが普通・上昇で、コストが妥当な場合b
  getOrderParams( balanceParams, trendModeParams, bestArbitrageData ){
  }
}
