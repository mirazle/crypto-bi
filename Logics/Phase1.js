import Logics from './Logics';
import confControl from '../conf/control';
import exchanges from '../exchanges/';
import Logs from '../Logs/';

export default class Phase1 extends Logics{

  constructor( exchangeConf, productCode, conf ){
    super();
    this.exchangeConf = exchangeConf;
    this.productCode = productCode;
    this.conf = conf;
  }

  async getLtps(){
    let ltps = [];
    for( let exName in this.exchangeConf ){
      if( exchanges[ exName ] ){
        const { productCode } = this;
        const exchangeProductCode = this.getExchangeProductCode( exName );
        const ltp = await exchanges[ exName ].getLtp( exchangeProductCode );
        ltps.push( {exName, exchangeProductCode, productCode, ltp} );
      }else{
        Logs.out( `Exist conf/control.js. Bad, No Exist File. ${exName}` );
      }
    }
    return ltps;
  }

  async getArbitrageData( ltps ){
    let arbitrageData = [];

    ltps.forEach( ( base ) => {
      if( base.ltp === null ) return false;
      ltps.forEach( ( valid ) => {
        if( valid.ltp === null ) return false;
        if( base.exName === valid.exName ) return false;

        const arbitrageAmount = Math.floor( base.ltp * this.conf.arbitrageProfitRate );

        //Logs.out( `${base.productCode} [ ${base.exName} to ${valid.exName} ] ${base.ltp} < ( ${valid.ltp} - ${arbitrageAmount} )` );

        // アビトラージが成立する場合
        if( base.ltp < ( valid.ltp - arbitrageAmount ) ){
          const profitAmount = Math.floor( valid.ltp - base.ltp );

          //Logs.out( `ARBITRAGE! ¥${profitAmount}`, 'strong' );

          arbitrageData.push( {...base, profitAmount} );
        }
      });
    });
    return arbitrageData;
  }
}
