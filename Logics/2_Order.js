import Logics from './Logics';
import confControl from '../conf/control';
import exchanges from '../exchanges/';
import Logs from '../Logs/';

export default class Order extends Logics{

  constructor( params ){
    super();
    this.exConf = params.exConf;
    this.productConf = params.productConf;
    this.generalConf = params.generalConf;
  }

  async exe(){
    return new Promise( ( resolve, reject ) => {
      let ordered = {}
/*
      const bitbankcc = exchanges.bitbankcc.order({
        pair: 'mona_jpy',
        price:	360,
        amount:	'1',
        side: 'buy',
        type: 'limit'
      });
*/
/*
      const fisco = exchanges.fisco.order({
        currency_pair: 'mona_jpy',
        action: 'bid',
        price:	360,
        amount:	1,
        limit: 400,
        comment:	'apiBot'
      });
*/
/*
      const zaif = exchanges.zaif.order({
        currency_pair: 'xem_jpy',
        action: 'bid',
        price:	25,
        amount:	1,
        limit: 30,
        comment:	'apiBot'
      });
*/
/*
      const bitflyer = exchanges.bitflyer.order({
        product_code: "BTC_JPY",
        child_order_type: "LIMIT",
        side: "BUY",
        price: 810000,
        size: 0.001,
        minute_to_expire: 1,
        time_in_force: "GTC"
      });
*/
      resolve( ordered );
    });
  }
}
