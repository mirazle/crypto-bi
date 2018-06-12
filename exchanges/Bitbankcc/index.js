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
    if( balanceDatas && balanceDatas.data && balanceDatas.data.assets ){
      const balanceData =  balanceDatas.data.assets.filter( b => b.asset === currency )[ 0 ];
      return balanceData.free_amount;
    }else{
      return 0;
    }
  }

  async order( params ){
    return await api.user.spot.order( params );
  }
}
