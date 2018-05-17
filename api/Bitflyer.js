import crypto from 'crypto';
import setup from '../setup';
import Rest from './Rest';
import confPrivate from '../conf/private';

export default class Bitflyer extends Rest{

  static get endpoint(){ return `https://api.bitflyer.jp/${Bitflyer.apiVer}/` }
  static get apiVer(){ return 'v1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return 'sha256' }
  static getSign( text ){ return crypto.createHmac( Bitflyer.authAlgorithm , confPrivate.Bitflyer.secret ).update( text ).digest('hex') }

  static getMethod( path ){
    let method = 'GET';
    switch( path ){
    case 'me/sendchildorder':
      method = Rest.POST;
      break;
    case 'ticker':
    case 'markets':
      method = Rest.GET;
      break;
    }
    return method;
  }

  static getOptions( path, requestParams, urlParams = {} ){
    const timestamp = Rest.getTimestamp();
    const body = requestParams ? JSON.stringify( requestParams ): '';
    const method = Bitflyer.getMethod( path );
    const text = `${timestamp}${method}/${Bitflyer.apiVer}/${path}${body}`;

    const sign = Bitflyer.getSign( text );
    const urlParamsString = Rest.getUrlParamsString( urlParams );

    const url = `${Bitflyer.endpoint}${path}${urlParamsString}`;

    const headers = {
      'ACCESS-KEY': confPrivate.Bitflyer.key,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-SIGN': sign,
      'Content-Type': Bitflyer.contentType
    }
    return body ? { url, method, body, headers } : { url, method, headers };
  }

  get me(){
    return {
      sendchildorder: async ( requestPrams, urlParams ) => {
        const options = Bitflyer.getOptions( `me/sendchildorder`, requestPrams, urlParams );
        return await this.request( options, ( err, response, payload ) => {
          return JSON.parse( payload );
        });
      }
    }
  }

  async markets(){
    const options = Bitflyer.getOptions( 'markets' );
    return await this.request( options, ( err, response, payload ) => {
      return JSON.parse( payload );
    })
  }

  async ticker(){
    const options = Bitflyer.getOptions( 'ticker' );
    return await this.request( options, ( err, response, payload ) => {
      return JSON.parse( payload );
    })
  }
}
