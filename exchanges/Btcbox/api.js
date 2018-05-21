import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Btcbox extends Rest{

  static get endpointPublic(){ return `https://www.btcbox.co.jp/api/${Btcbox.apiVer}/` }
  static get apiVer(){ return 'v1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return '' }

  async ticker( currencyPairCode ){
    if( currencyPairCode !== 'btc_jpy') return false;
    const options = {url: `${Btcbox.endpointPublic}ticker`};
    return await this.request( options, ( err, response, payload ) => {
      try {
        return JSON.parse( payload );
      } catch (e) {
        Logs.out( e, 'strong' );
        return null;
      }
    })
  }
}

export default new Btcbox();
