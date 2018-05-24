import Exchange from '../Exchange';
import api from './api';

export default class Quoinex extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'BTCJPY' ){
    const res = await api.products();
    let ltp = 0;
    res.some( ( r ) => {
      if( r.currency_pair_code === currencyPairCode ){
        ltp = r.last_traded_price;
        return true;
      }
    });
    return ltp !== 0 ? parseFloat( ltp ) : null;
  }

  async getBalance(){
    return await api.accounts.balance();
  }
}
