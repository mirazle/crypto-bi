import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Zaif extends Rest{

  static get endpoint(){ return `https://api.zaif.jp/api/${Zaif.apiVer}/` }
  static get apiVer(){ return '1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return 'sha256' }
  static getSign( text ){ return crypto.createHmac( Zaif.authAlgorithm , confPrivate.Zaif.secret ).update( text ).digest('hex') }

  async currencies( currency = 'btc' ){
    const options = {url: `${Zaif.endpoint}currencies/${currency}`};
    return await this.request( options, ( err, response, payload ) => {
      try {
        return JSON.parse( payload );
      } catch (e) {
        Logs.out( e, 'strong' );
        return null;
      }
    })
  }

  async ticker( currencyPairCode ){
    const options = {url: `${Zaif.endpoint}ticker/${currencyPairCode}`};
    return await this.request( options, ( err, response, payload ) => {
      try {
        return JSON.parse( payload );
      } catch (e) {
        Logs.out( e, 'strong' );
        return null;
      }
    })
  }

  async getBalance(){
    return await this.request( options, ( err, response, payload ) => {
    });
  }
}

export default new Zaif();
