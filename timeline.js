import confControl from './conf/control';
import LoadLogics from './Logics/';
import exchanges from './exchanges/';
import Logs from './Logs/';

class CryptoBi{

  constructor( params = { exConf, productConf, generalConf } ){
    this.exConf = params.exConf;
    this.productConf = params.productConf;
    this.generalConf = params.generalConf;
    this.logics = new LoadLogics( params );

    this.startTime = new Date();
    this.trendModeParams = {};

    // ログを保持
    this.logs = {
      ltpParams: []
    };
  }

  async timerHour(){
    const currentTime = new Date();
    const status = (currentTime - this.startTime) / 1000 + '秒経過';
    Logs.strong( status );
  }

  start( proccessTermMicroSecond = 0 ){
    setTimeout( () => {
      this.timerHour();
      this.setStatus();
      this.phase2();
      this.start( confControl.generalConf.proccessTermMicroSecond );
    }, proccessTermMicroSecond );
  }

  // 情報をセット
  async setStatus(){

    // 各取引所の資産を取得
    //const balanceParams = await this.logics.setStatus.getBalanceParams();


    // 裁定可能状況を取得
    const ltpParams = await this.logics.setStatus.getLtpParams();
    const ltpsNullParams = await this.logics.setStatus.getLtpParamsFilteredNull( ltpParams );
    const arbitrageData = await this.logics.setStatus.getArbitrageData( ltpsNullParams );
    const bestArbitrageData = await this.logics.setStatus.getBestArbitrageData( arbitrageData );

    // 現在が上昇トレンド中かどうかを取得
    const {trendModeParams, logsLtpParams } = await this.logics.setStatus.getRefrectedTrendModeParams( this.logs.ltpParams, ltpParams );
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
