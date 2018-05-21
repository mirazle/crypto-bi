import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Bitbankcc extends Rest{

  static get endpointPublic(){ return `https://public.bitbank.cc/` }
  static get apiVer(){ return '1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return '' }
  static getSign( text ){ return crypto.createHmac( Bitbankcc.authAlgorithm , confPrivate.Bitbankcc.secret ).update( text ).digest('hex') }

  async ticker( currencyPairCode ){
    const options = {url: `${Bitbankcc.endpointPublic}${currencyPairCode}/ticker`};
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

export default new Bitbankcc();
