import Exchange from '../Exchange';
import api from './api';

export default class Fisco extends Exchange{
  constructor(){
    super();
  }

  async getLtp( currencyPairCode = 'btc_jpy' ){
    const res = await api.ticker( currencyPairCode );
    return res && res.last ? parseFloat( res.last ) : null ;
  }

  async getBalance( currency = 'jpy'){
    const balanceDatas = await api.getInfo();
    if( balanceDatas && balanceDatas.return && balanceDatas.return.funds && balanceDatas.return.funds[ currency ] ){
      return balanceDatas.return.funds[ currency ];
    }else{
      return 0;
    }
  }

  async order( params ){
    return await api.trade( params );
  }
}
