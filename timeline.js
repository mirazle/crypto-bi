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
      ltpParams: []
    };
  }

  async timerHour(){
    const currentTime = new Date();
    const status = (currentTime - this.startTime) / 1000 + '秒経過';
    Logs.trace( status );
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

    // 各取引所の「資産状況」を取得
    const balanceParams = await this.logics.setStatus.getBalanceParams();

    // 「最適な裁定情報」を取得
    const ltpParams = await this.logics.setStatus.getLtpParams();
    const ltpsNullParams = await this.logics.setStatus.getLtpParamsFilteredNull( ltpParams );
    const arbitrageDatas = await this.logics.setStatus.getArbitrageDatas( ltpsNullParams );
    const bestArbitrageData = await this.logics.setStatus.getBestArbitrageData( arbitrageDatas );

    // 現在の「トレンド状況」を取得
    const {trendModeParams, logsLtpParams } = await this.logics.setStatus.getRefrectedTrendModeParams( this.logs.ltpParams, ltpParams );
    this.logs.ltpParams = logsLtpParams;

    // 資産状況、トレンド状況、最適な裁定情報を鑑みて「発注情報」を取得する
    this.orderParams = this.logics.setStatus.getOrderParams( balanceParams, trendModeParams, bestArbitrageData );
  }

  async phase2(){

  }
}


const cryptoBi = new CryptoBi( confControl );
cryptoBi.start();
