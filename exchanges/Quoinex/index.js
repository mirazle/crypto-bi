import Exchange from '../Exchange';
import api from './api';

export default class Quoinex extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'BTCJPY' ){
    const res = await api.products();
    let ltp = 0;

    if( res ){
      res.some( ( r ) => {
        if( r.currency_pair_code === currencyPairCode ){
          ltp = r.last_traded_price;
          return true;
        }
      });
    }
    return res && ltp !== 0 ? parseFloat( ltp ) : null;
  }

  async getBalance( currency = 'JPY'){
    const balanceDatas = await api.accounts.balance();
    if( balanceDatas && balanceDatas.length > 0 ){
      const balanceData =  balanceDatas.filter( b => b.currency === currency )[ 0 ];
      return balanceData.balance;
    }else{
      return 0;
    }
  }

  // TODO
  async order( currencyPairCode = 'BTCJPY' ){
    return await api.orders( params );
  }
}
