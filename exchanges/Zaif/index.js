import Exchange from '../Exchange';
import api from './api';

export default class Zaif extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'btc_jpy' ){
    const res = await api.ticker( currencyPairCode );
    return res.last ? parseFloat( res.last ) : null ;
  }
/*
  async getBalance(){
    return await api.getbalance();
  }
*/
}
