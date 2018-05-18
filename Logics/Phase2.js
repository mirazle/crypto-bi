import confControl from '../conf/control';
import exchangeApis from '../exchanges/';

export default class Phase2{

  constructor( exchangeConf, productCode, conf ){
    this.exchangeConf = exchangeConf;
    this.productCode = productCode;
    this.conf = conf;
  }

  async getLtps(){
    const bitflyerLtp = await bitflyer.getLtp();
    const quoinexLtp = await quoinex.getLtp();
    const zaifLtp = await zaif.getLtp();
    return {bitflyer: bitflyerLtp, quoinex: quoinexLtp, zaif: zaifLtp};
  }

  async getArbitrageCurrencyData( ltps ){
    for( let exchangeBaseKey in ltps ){
      for( let exchangeValidKey in ltps ){
        if( exchangeBaseKey === exchangeValidKey ) continue

        if( ltps[ exchangeBaseKey] < ltps[ exchangeValidKey ] ){
          const arbitrageAmount = Math.floor( ltps[ exchangeBaseKey ] * this.conf.arbitrageRate );
          if( ltps[ exchangeBaseKey] < ( ltps[ exchangeValidKey ] - arbitrageAmount ) ){

            console.log("@@@@@@@@@@@@@@@@@@@@@ " + Math.floor( ltps[ exchangeValidKey ] - ltps[ exchangeBaseKey] ) );
            console.log( `BASE ${exchangeBaseKey}:${ltps[ exchangeBaseKey] } < VALID ${exchangeValidKey}: ${ltps[ exchangeValidKey ] }`);
            console.log( `●arbitrageRate=${this.conf.arbitrageRate} arbitrageAmount=${arbitrageAmount}` );
          }
        }
      }
    }
  }
}
