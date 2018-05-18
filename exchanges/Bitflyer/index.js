import Exchange from '../Exchange';
import api from './api';

export default class Bitflyer extends Exchange{

  async getLtp( product_code = 'BTC_JPY' ){
    const res = await api.ticker( {product_code} );
    return res.ltp ? parseFloat( res.ltp ) : null;
  }
}
