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
    case 'trade_add' :
      method = Rest.POST;
      break;
    }
    return method;
  }
  static getOptions( path, params ){
    const method = Btcbox.getMethod( path );
    const timestamp = Rest.getTime();
    const urlParamsString = Rest.getUrlParamsString( params, true );
    const url = `${Btcbox.endpoint}${path}${urlParamsString}`;
    let options = {};
    let sign = '';
    if( method === Rest.POST ){

      const postBase = {nonce: timestamp, key: confPrivate.Btcbox.key,  };
      const post = {...postBase, ...params };
      const qstring = Rest.getUrlParamsString( post );
      const sign = Btcbox.getSign( qstring );
      const formParams = {...post, ...{signature: sign}};
      const form = Rest.getUrlParamsString(formParams);
      options = {
        url: url,
        method: method,
        form: form,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': form.length,
          'User-Agent': '',
        }
      };
    }

    return options;
  }

  async getBalance( params ){
    const options = Btcbox.getOptions( `balance`, params );
    return await this.request( options, this.response );
  }

  async ticker( currencyPairCode ){
    if( currencyPairCode !== 'btc_jpy') return false;
    const options = {url: `${Btcbox.endpoint}ticker`};
    return await this.request( options, this.response )
  }

  async trade_add( params ){
    const options = Btcbox.getOptions( `trade_add`, params );
//    console.log( options );
//
    return await this.request( options, this.response );
  }

}

export default new Btcbox();
