import Exchange from '../Exchange';
import api from './api';

export default class Btcbox extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'btc_jpy' ){
    const res = await api.ticker( currencyPairCode );
    return res && res.last ? parseFloat( res.last ) : null ;
  }

  async getBalance( currency = 'jpy'){
    const balanceData = await api.getBalance();
    return balanceData[ `${ currency }_balance` ] ? balanceData[ `${ currency }_balance` ] : 0 ;
  }

  /*
  * amount: 0.1
  * price: 10000
  * type: 'buy' | 'sell'
  */
  async order( params ){
    return await api.trade_add( params );
  }
}
