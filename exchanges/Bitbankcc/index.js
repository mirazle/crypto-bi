import Exchange from '../Exchange';
import api from './api';

export default class Bitbankcc extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'btc_jpy' ){
    const res = await api.ticker( currencyPairCode );
    return res && res.data && res.data.last ? parseFloat( res.data.last ) : null ;
  }

  async getBalance( currency = 'jpy'){
    const balanceDatas = await api.user.assets();
    if( balanceDatas && balanceDatas.length > 0 ){
      const balanceData =  balanceDatas.filter( b => b.asset === currency );
      return balanceData.free_amount;
    }else{
      return 0;
    }
  }

  async order( params ){
    return await api.user.spot.order( params );
  }
}
