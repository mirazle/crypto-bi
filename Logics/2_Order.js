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

  exe(){
    console.log("ZAIF!!!");
/*
    exchanges.zaif.order({
      currency_pair: 'bch_jpy',
      action: 'ask',
      price:	900,
      amount:	0.01,
      limit: 1000,
      comment:	'api',
    });
*/
  }
}
