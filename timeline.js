import confControl from './conf/control';
import LoadLogics from './Logics/';
import Logs from './Logs/';
import custom from './custom';


let buyAmount = 0;
let profitAmount = 0;
let buyCnt = 0;
const startTime = new Date();

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

    if( arbitrageData.length > 0 ){
      arbitrageData.forEach( ( ad ) => {
        buyAmount = buyAmount + ad.ltp;
        profitAmount = profitAmount + ad.profitAmount;

        const endTime = new Date();
        const diffTime = startTime.getTime() - endTime.getTime();
        const diffMinute = Math.floor(diffTime / ( 1000 * 60 ));
        buyCnt = buyCnt + 1;
        Logs.out( -( diffMinute + 1 ) + " 分経過 " + buyCnt + " 回購入　@@@@@@@@@@@@@@@@@@@@@@ " + ad.exName + " " + ad.productCode );
        Logs.out( "購入金額　　： ¥" + ad.ltp );
        Logs.out( "売上　　　　： ¥" + ad.profitAmount );
        Logs.out( "購入合計金額： ¥" + buyAmount );
        Logs.out( "売上合計金額： ¥" + profitAmount );
        Logs.out( "" );
        return profitAmount;
      });
    }
  }

  async phase2(){
//    Logs.out( `@ Phase2 ${this.productCode}`);
  }
}

const { exchanges, productCodes } = confControl;

for( let productCode in productCodes ){

  const conf = productCodes[ productCode ];

  if( conf.enable ){
    const cryptoBi = new CryptoBi( exchanges, productCode, conf );
    cryptoBi.start();
  }
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
