import Exchange from '../Exchange';
import api from './api';

export default class Bitbankcc extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'btc_jpy' ){
    const res = await api.ticker( currencyPairCode );
    return res.data && res.data.last ? parseFloat( res.data.last ) : null ;
  }
/*
  async getBalance(){
    return await api.getbalance();
  }
*/
}
