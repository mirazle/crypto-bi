import setup from './setup';
import Bitflyer from './api/Bitflyer';
import Quoinex from './api/Quoinex';

class CryptoBi{

  constructor(){
  }

  async start(){
    const bitflyer = new Bitflyer();
    const quoinex = new Quoinex();

    const products = await quoinex.products();
    const orders = await quoinex.orders( { product_id: 1 } );

    const sendchildorder = await bitflyer.me.sendchildorder({
      product_code: 'BTC_JPY',
      child_order_type: 'LIMIT',
      side: 'BUY',
      price: 30000,
      size: 0.1
    });
    const markets = await bitflyer.markets();
    const ticker = await bitflyer.ticker();
  }
}

const cryptoBi = new CryptoBi();
cryptoBi.start();
