import Logics from './Logics';
import confControl from '../conf/control';
import exchanges from '../exchanges/';
import Logs from '../Logs/';
import zaif from 'zaif.jp';

export default class Order extends Logics{

  constructor( params ){
    super();
    this.exConf = params.exConf;
    this.productConf = params.productConf;
    this.generalConf = params.generalConf;
  }

  exe(){
    const api = zaif.createPrivateApi(
      '1c28bccd-4b32-4a44-bd1f-0db508329a59',
      'cc23d9a7-6e83-4c4a-9fc0-5c6535612e97',
      'user agent is node-zaif'
    );

    console.log( api );

    api.trade('xem_jpy', 'bid', 25, 1).then(console.log);
/*
    exchanges.zaif.order({
      currency_pair: 'xem_jpy',
      action: 'bid',
      price:	25,
      amount:	1,
      limit: 24,
      comment:	'apiBot'
    });
*/
  }
}
