import Logics from './Logics';
import confControl from '../conf/control';
import exchanges from '../exchanges/';
import Logs from '../Logs/';

export default class Phase1 extends Logics{

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

  async getArbitrageData( ltpParams ){
    let arbitrageData = [];

    ltpParams.forEach( ( base ) => {
      ltpParams.forEach( ( valid ) => {
        if( base.exName === valid.exName ) return false;
        if( base.productCode !== valid.productCode ) return false;

        const arbitrageProfitRate = this.productConf[ base.productCode ].arbitrageProfitRate * this.generalConf.arbitrageProfitRate;
        const enableArbitrageAmount = Math.floor( base.ltp * arbitrageProfitRate );
        const diffAmount = Math.floor( valid.ltp - base.ltp );
        const isArbitrage = enableArbitrageAmount !== 0 && base.ltp < ( valid.ltp - enableArbitrageAmount );
        //Logs.out( `${isArbitrage} ${diffAmount} [ ${base.exName}(${base.productCode}) to ${valid.exName}(${valid.productCode}) ] ${base.ltp} < ( ${valid.ltp} - ${enableArbitrageAmount} )` );

        // アビトラージが成立する場合
        if( isArbitrage ){
          const profitAmount = Math.floor( valid.ltp - base.ltp );

          //Logs.out( `ARBITRAGE! ¥${profitAmount} [ ${base.exName}(${base.productCode}) to ${valid.exName}(${valid.productCode}) ]`, 'strong' );

          arbitrageData.push( {...base, profitAmount} );
        }
      });
    });
    return arbitrageData;
  }

  async getBestArbitrageData( arbitrageData ){
    let bestArbitrageData = {profitAmount:0};
    let mostProritAmount = 0;

    if( arbitrageData.length > 0 ){
      arbitrageData.forEach( ( ad, index ) => {
        if( bestArbitrageData.profitAmount < ad.profitAmount){
          bestArbitrageData = ad;
        }
      });
    }
    return bestArbitrageData;
  }

  getCurrencyFromLtpParams( ltpParams, currencyCode = this.generalConf.baseCurrencyCode ){
    return ltpParams.filter( params => params.productCode.indexOf( currencyCode ) === 0 );
  }

  static getLtpFromLtpParams(){

  }

  async getRisingTrendMode( logLtpParams ){

    const getLtp = ( value ) => {
      if( value >= 0  ){
        return value;
      }else if( value.ltp ){
        return Number( value.ltp );
      }else if( value.ltp === null ){
        return  0;
      }else if( value.ltp === undefined ){
        return 0;
      }else{
        return value ;
      }
    }

    Object.keys( this.productConf ).forEach( ( productCode ) => {
      const baseCurrencyCode = productCode.split('_')[ 0 ];
      console.log("----------------- " + baseCurrencyCode );
      const firstLtpParams = logLtpParams[ 0 ];
      const lastLtpParams = logLtpParams[ logLtpParams.length - 1 ];

      console.log( firstLtpParams.ltp );
      console.log( lastLtpParams.ltp );
/*
      logLtpParams.forEach( ( ltpParams ) => {

        let sumLtp = 0;
        const filter = ltpParams.filter( params => params.productCode.indexOf( baseCurrencyCode ) === 0 )
        const filterdNull = this.getLtpParamsFilteredNull( filter );
        filterdNull.forEach( ( param ) => sumLtp += param.ltp );

        const avelageLtp = sumLtp > 0 ? Math.floor( sumLtp ) / filterdNull.length : 0 ;
        console.log("@@@@ RESULT " + Math.floor( sumLtp ) + " " + filterdNull.length);
        console.log( avelageLtp );

      });
*/

    });

/*
    [ [ { exName: 'bitflyer',
          productCode: 'BTC_JPY',
          exProductCode: 'BTC_JPY',
          ltp: 853665 },
        { exName: 'bitflyer',
          productCode: 'BCH_JPY',
          exProductCode: 'BCH_JPY',
          ltp: null },
        { exName: 'bitflyer',
          productCode: 'ETH_JPY',
          exProductCode: 'ETH_JPY',
          ltp: null },
        { exName: 'bitflyer',
*/
  }
}
