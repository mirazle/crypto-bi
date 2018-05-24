import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Btcbox extends Rest{

  static get endpoint(){ return `https://www.btcbox.co.jp/api/${Btcbox.apiVer}/` }
  static get apiVer(){ return 'v1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return 'sha256' }
  static getSign( text ){ return crypto.createHmac( Btcbox.authAlgorithm , Rest.md5( confPrivate.Btcbox.secret ) ).update( new Buffer( text ) ).digest('hex').toString() }
  static getMethod( path ){
    let method = Rest.GET;
    switch( path ){
    case 'balance':
      method = Rest.POST;
      break;
    }
    return method;
  }
  static getOptions( path, params = {bodyParams, urlParams} ){
    const method = Btcbox.getMethod( path );
    const urlParams = params.urlParams ? params.urlParams: {};
    const timestamp = Rest.getTime();
    const urlParamsString = Rest.getUrlParamsString( urlParams, true );
    const url = `${Btcbox.endpoint}${path}${urlParamsString}`;
    let bodyParams = {};
    let sign = '';
    if( method === Rest.POST ){

      const postBase = {nonce: timestamp, key: confPrivate.Btcbox.key,  };
      const post = {...postBase, ...bodyParams };
      const qstring = Rest.getUrlParamsString( post );
      const sign = Btcbox.getSign( qstring );
      const formParams = {...post, ...{signature: sign}};
      const form = Rest.getUrlParamsString(formParams);
      bodyParams = {
        url: url,
        method: method,
        form: form,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': form.length,
          'User-Agent': '',
        }
      };
console.log(bodyParams);
    }else{

    }

    return bodyParams;
  }

  async getBalance( bodyParams, urlParams ){
    const options = Btcbox.getOptions( `balance`, {bodyParams, urlParams} );
    return await this.request( options, ( err, response, payload ) => {
      try {
        return JSON.parse( payload );
      } catch (e) {
        Logs.out( e, 'strong' );
        return null;
      }
    });
  }

  async ticker( currencyPairCode ){
    if( currencyPairCode !== 'btc_jpy') return false;
    const options = {url: `${Btcbox.endpoint}ticker`};
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
