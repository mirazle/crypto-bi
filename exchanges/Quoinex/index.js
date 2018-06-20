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
/*
      console.log("@@@@@@ RESULT BALANCE @@@@@@@");
      console.log( balanceData );
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
*/
      return balanceData.balance;
    }else{
      return 0;
    }
  }

  // TODO
  async order( params ){
    const order =  await api.orders( params );
/*
    console.log("@@@@@@ RESULT ORDER @@@@@@@");
    console.log( order );
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@");
*/
    return order;
  }
}
