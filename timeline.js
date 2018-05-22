import confControl from './conf/control';
import LoadLogics from './Logics/';
import exchanges from './exchanges/';
import Logs from './Logs/';

let buyAmount = 0;
let profitAmount = 0;
let buyCnt = 0;
const startTime = new Date();

class CryptoBi{

  constructor( params = { exConf, productConf, generalConf } ){
    this.exConf = params.exConf;
    this.productConf = params.productConf;
    this.generalConf = params.generalConf;
    this.logics = new LoadLogics( params );
  }

  start( proccessTermMicroSecond = 0 ){
    setTimeout( () => {
      this.phase1();
      this.phase2();
      this.start( confControl.generalConf.proccessTermMicroSecond );
    }, proccessTermMicroSecond );
  }

  // 情報収集
  async phase1(){
    Logs.out( `@ Phase1`);

    // 各取引所の資産を取得

    // 現在が上昇トレンド中かどうかを取得

    // 裁定可能状況を取得
    const ltpParams = await this.logics.p1.getLtpParams();
    const arbitrageData = await this.logics.p1.getArbitrageData( ltpParams );
    const bestArbitrageData = await this.logics.p1.getBestArbitrageData( arbitrageData );

    console.log( bestArbitrageData );


/*
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
*/
  }

  async phase2(){

  }
}


const cryptoBi = new CryptoBi( confControl );
cryptoBi.start();

// phase1で各取引所の資産状況を1回だけ取得しておく必要がある。

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
