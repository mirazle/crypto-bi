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

  async getArbitrageData( ltpParams ){
    let arbitrageData = [];

    ltpParams.forEach( ( base ) => {
      if( base.ltp === null ) return false;
      ltpParams.forEach( ( valid ) => {
        if( valid.ltp === null ) return false;
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
}
