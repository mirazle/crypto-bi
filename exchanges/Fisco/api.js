import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Fisco extends Rest{

  static get endpoint(){ return `https://api.fcce.jp/api/${Fisco.apiVer}/` }
  static get apiVer(){ return '1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return 'sha256' }
  static getSign( text ){ return crypto.createHmac( Fisco.authAlgorithm , confPrivate.Fisco.secret ).update( text ).digest('hex') }

  async currencies( currency = 'btc' ){
    const options = {url: `${Fisco.endpoint}currencies/${currency}`};
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
    const options = {url: `${Fisco.endpoint}ticker/${currencyPairCode}`};
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

export default new Fisco();
