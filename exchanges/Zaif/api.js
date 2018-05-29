import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Zaif extends Rest{

  static get endpoint(){ return `https://api.zaif.jp/api/` }

  static get endpointPublic(){ return `https://api.zaif.jp/api/${Zaif.apiVer}` }
  static get endpointPrivate(){ return `https://api.zaif.jp/tapi` }
  static get endpointFx(){ return `https://api.zaif.jp/fapi/` }
  //https://api.zaif.jp/api/1
  // https://api.zaif.jp/tapi
  static get apiVer(){ return '1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return 'sha512' }
  static getNonce(){ return new Date() / 1000 };
  static getSign( text ){ return crypto.createHmac( Zaif.authAlgorithm , confPrivate.Zaif.secret ).update( text ).digest('hex').toString() }
  static getMethod( path ){
    let method = Rest.GET;
    switch( path ){
    case 'get_info':
    case 'trade':
      method = Rest.POST;
      break;
    }
    return method;
  }

  static getOptions( path, params = {} ){
    const urlParams = params.urlParams ? params.urlParams: {};
    const method = Zaif.getMethod( path );
    const nonce = Zaif.getNonce();
    const urlParamsString = Rest.getUrlParamsString( urlParams, true );
    const url = `${Zaif.endpointPrivate}${path}${urlParamsString}`;
    let bodyParams = {};
    let sign = '';
    if( method === Rest.POST ){

      const post = {nonce, method: path, ...bodyParams};
      const qstring = Rest.getUrlParamsString( post );
      const sign = Zaif.getSign( qstring );
      const formParams = {...{nonce, method: path}, ...params};
      const form = Rest.getUrlParamsString(formParams);
      bodyParams = {
        url: `${Zaif.endpointPrivate}`,
        method: method,
        forever: false,
        form: formParams,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': form.length,
          'User-Agent': '',
          'Sign': Zaif.getSign( form ),
          'Key': confPrivate.Zaif.key,
        },
        timeout: Math.floor(2 * 10000),
        transform2xxOnly : true,
        transform: function(body){
            return JSON.parse(body)
        },
      }
    }
    return bodyParams;
  }

  async currencies( currency = 'btc' ){
    const options = {url: `${Zaif.endpointPublic}/currencies/${currency}`};
    return await this.request( options, this.response );
  }

  async ticker( currencyPairCode ){
    const options = {url: `${Zaif.endpointPublic}/ticker/${currencyPairCode}`};
    return await this.request( options, this.response );
  }

  async getInfo(){
    const options = Zaif.getOptions( 'get_info' );

    return await this.request( options, this.response );
  }

  async trade( params ){
    const options = Zaif.getOptions( 'trade', params );
    return await this.request( options, this.response );
  }
}

export default new Zaif();
