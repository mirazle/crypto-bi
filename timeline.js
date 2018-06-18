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
    this.orderParams = {};

    // ログを保持
    this.logs = {
      exParams: []
    };
  }

  async timerHour(){
    const currentTime = new Date();
    const status = (currentTime - this.startTime) / 1000 + '秒経過';
    console.log( `@${status}` );
  }

  start( proccessTermMicroSecond = 0 ){
    setTimeout( () => {
      this.timerHour();
      this.phase1();
      this.phase2();
      this.start( confControl.generalConf.proccessTermMicroSecond );
    }, proccessTermMicroSecond );
  }

  // 情報をセット
  async phase1(){

    // 各取引所の「資産状況」を取得する
    const balanceParams = await this.logics.setStatus.getBalanceParams();

    // 「最適な裁定情報」を取得
    const exParams = await this.logics.setStatus.getExParams();
    const exParamsFilteredNull = await this.logics.setStatus.getExParamsFilteredNull( exParams );
    let arbitrageDatas = await this.logics.setStatus.getArbitrageDatas( balanceParams, exParamsFilteredNull );

    // 現在の「トレンド状況」を反映して取得
    arbitrageDatas = await this.logics.setStatus.getRefrectedTrendParams( arbitrageDatas, this.logs.exParams, exParams );

    // 現在の「トレンド状況ログ」を取得
    this.logs.exParams = await this.logics.setStatus.getLatestlogsLtpParams();

    let bestArbitrageData = await this.logics.setStatus.getBestArbitrageData( arbitrageDatas );

    // 資産状況、コスト状況、トレンド状況、最適な裁定情報を鑑みて「発注情報」を取得する
    this.orderParams = await this.logics.setStatus.getOrderParams( bestArbitrageData );
  }

  // 発注
  async phase2(){
    const ordered = await this.logics.order.exe();
  }
}


const cryptoBi = new CryptoBi( confControl );
cryptoBi.start();
