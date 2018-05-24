import crypto from 'crypto';
import Rest from '../Rest';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Bitbankcc extends Rest{

  static get endpointPublic(){ return `https://public.bitbank.cc/` }
  static get endpointPrivate(){ return `https://api.bitbank.cc/${Bitbankcc.apiVer}/` }
  static get apiVer(){ return 'v1' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return 'sha256' }
  static getSign( text ){ return crypto.createHmac( Bitbankcc.authAlgorithm , confPrivate.Bitbankcc.secret ).update( new Buffer( text ) ).digest('hex').toString() }
  static getMethod( path ){
    let method = 'GET';
    return method;
  }
  static getOptions( path, params = {} ){
    const bodyParams = params.bodyParams ? params.bodyParams :  {};
    const urlParams = params.urlParams ? params.urlParams: {};
    const timestamp = Rest.getTime();
    const body = Object.keys( bodyParams ).length > 0 ? JSON.stringify( bodyParams ): '';
    const method = Bitbankcc.getMethod( path );
    const urlParamsString = Rest.getUrlParamsString( urlParams, true );
    const url = `${Bitbankcc.endpointPrivate}${path}${urlParamsString}`;
    const text = `${timestamp}/${Bitbankcc.apiVer}/${path}${urlParamsString}`;

    //リクエストのパス、クエリパラメータ
    const sign = Bitbankcc.getSign( text );

    const headers = {
      'ACCESS-KEY': confPrivate.Bitbankcc.key,
      'ACCESS-NONCE': timestamp,
      'ACCESS-SIGNATURE': sign,
      'Content-Type': Bitbankcc.contentType
    }
    return body ? { url, method, body, headers } : { url, method, headers };
  }

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

  get user(){
    return {
      assets: async ( params ) => {
        const options = Bitbankcc.getOptions( `user/assets`, params );
        return await this.request( options, ( err, response, payload ) => {
          try {
            return JSON.parse( payload );
          } catch (e) {
            Logs.out( e, 'strong' );
            return null;
          }
        });
      }
    }
  }
}

export default new Bitbankcc();
