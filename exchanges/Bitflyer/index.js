import Exchange from '../Exchange';
import api from './api';

export default class Bitflyer extends Exchange{

  async getLtp( product_code = 'BTC_JPY' ){
    const res = await api.ticker( {product_code} );
    return res && res.ltp ? parseFloat( res.ltp ) : null;
  }

  async getBalance( currency = 'JPY'){
    const balanceDatas =  await api.me.getBalance();
    if( balanceDatas && balanceDatas.length > 0 ){
      const balanceData =  balanceDatas.filter( b => b.currency_code === currency );
      return balanceData.available;
    }else{
      return 0;
    }
  }

  async order( params ){
    return await api.me.sendchildorder( {bodyParams: params, urlParams: {}} );
  }
}
