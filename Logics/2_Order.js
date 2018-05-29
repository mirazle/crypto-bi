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

  async exe(){
    return new Promise( ( resolve, reject ) => {
      const zaif = exchanges.zaif.order({
        currency_pair: 'xem_jpy',
        action: 'bid',
        price:	25,
        amount:	1,
        limit: 30,
        comment:	'apiBot'
      });
      resolve( zaif );
    });
  }
}
