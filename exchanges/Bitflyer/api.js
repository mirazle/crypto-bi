import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Bitflyer extends Rest{

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

  static getOptions( path, params = {bodyParams, urlParams} ){
    const { bodyParams, urlParams } = params;
    const timestamp = Rest.getTimestamp();
    const body = bodyParams ? JSON.stringify( bodyParams ): '';
    const method = Bitflyer.getMethod( path );
    const text = `${timestamp}${method}/${Bitflyer.apiVer}/${path}${body}`;
    const sign = Bitflyer.getSign( text );
    const urlParamsString = Rest.getUrlParamsString( urlParams, true );
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
      sendchildorder: async ( bodyParams, urlParams ) => {
        const options = Bitflyer.getOptions( `me/sendchildorder`, {bodyParams, urlParams} );
        return await this.request( options, ( err, response, payload ) => {
          try {
            return JSON.parse( payload );
          } catch (e) {
            Logs.out( e, 'strong' );
            return null;
          }
        });
      },
      getBalance: async ( bodyParams, urlParams ) => {
        const options = Bitflyer.getOptions( `me/getbalance`, {bodyParams, urlParams} );
        return await this.request( options, ( err, response, payload ) => {
          try {
            console.log( payload );
            return JSON.parse( payload );
          } catch (e) {
            Logs.out( e, 'strong' );
            return null;
          }
        });
      }
    }
  }

  async markets(){
    const options = Bitflyer.getOptions( 'markets' );
    return await this.request( options, ( err, response, payload ) => {
      try {
        return JSON.parse( payload );
      } catch (e) {
        Logs.out( e, 'strong' );
        return null;
      }
    })
  }

  async ticker( product_code ){
    const options = Bitflyer.getOptions( 'ticker', {urlParams: product_code} );
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

export default new Bitflyer();
