import confControl from './conf/control';
import LoadLogics from './Logics/';
import Logs from './Logs/';
import custom from './custom';

class CryptoBi{

  constructor( exchangeConf, productCode, conf ){
    this.exchangeConf = exchangeConf;
    this.productCode = productCode;
    this.conf = conf;
    this.logics = new LoadLogics( exchangeConf, productCode, conf );
  }

  start( proccessTermMicroSecond = 0 ){
    setTimeout( () => {
      this.phase1();
      this.phase2();
      this.start( confControl.proccessTermMicroSecond );
    }, proccessTermMicroSecond );
  }

  async phase1(){
    Logs.out( `@ Phase1 ${this.productCode}`);
    const ltps = await this.logics.p1.getLtps();
    const arbitrageData = await this.logics.p1.getArbitrageData( ltps );
  }

  async phase2(){
//    Logs.out( `@ Phase2 ${this.productCode}`);
  }
}

const { exchanges, productCodes } = confControl;

for( let productCode in productCodes ){
  const cryptoBi = new CryptoBi( exchanges, productCode, productCodes[ productCode ] );
  cryptoBi.start();
}



/*
    const products = await this.quoinex.api.products();
    const orders = await this.quoinex.api.orders( { product_id: 1 } );

    const sendchildorder = await this.bitflyer.api.me.sendchildorder({
      product_code: 'BTC_JPY',
      child_order_type: 'LIMIT',
      side: 'BUY',
      price: 30000,
      size: 0.1
    });
    const markets = await this.bitflyer.api.markets();
    const ticker = await this.bitflyer.api.ticker();

    const currencies = await this.zaif.api.currencies();
    const zaifTicker = await this.zaif.api.ticker();
    console.log(zaifTicker);
*/
