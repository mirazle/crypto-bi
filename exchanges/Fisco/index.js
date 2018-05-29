import Exchange from '../Exchange';
import api from './api';

export default class Fisco extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'btc_jpy' ){
    const res = await api.ticker( currencyPairCode );
    return res.last ? parseFloat( res.last ) : null ;
  }

  async getBalance(){
    return await api.getInfo();
  }

  async order(){
    return await api.trade();
  }
}
