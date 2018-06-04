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
    switch( path ){
    case 'user/spot/order':
      method = Rest.POST;
      break;
    }
    return method;
  }
  static getOptions( path, params = {} ){
    const method = Bitbankcc.getMethod( path );
    const timestamp = Rest.getTime();
    const urlParamsString = Rest.getUrlParamsString( params, true );
    let uri = '';
    const body = params;
    let text = '';
    let headers = {
      'Content-Type': Bitbankcc.contentType,
      'ACCESS-KEY': confPrivate.Bitbankcc.key,
      'ACCESS-NONCE': timestamp,
      'ACCESS-SIGNATURE': ''
    }
    let options = {};
    if( method === Rest.GET ){
      uri = `${Bitbankcc.endpointPrivate}${path}${urlParamsString}`;
      text = `${timestamp}/${Bitbankcc.apiVer}/${path}${urlParamsString}`;
      headers['ACCESS-SIGNATURE'] = Bitbankcc.getSign( text );
      options = { uri, method, headers };
    }else{
      uri = `${Bitbankcc.endpointPrivate}${path}`;
      text = `${timestamp}${JSON.stringify( params )}`;
      headers['ACCESS-SIGNATURE'] = Bitbankcc.getSign( text );
      options = { method, uri, body, headers, json: true };
    }
    return options;
  }

  async ticker( currencyPairCode ){
    const options = {url: `${Bitbankcc.endpointPublic}${currencyPairCode}/ticker`};
    return await this.request( options, this.response );
  }

  get user(){
    const self = this;
    return {
      assets: async ( params ) => {
        const options = Bitbankcc.getOptions( `user/assets`, params );
        return await this.request( options, this.response );
      },
      get spot() {
        return {
          order: async ( params ) => {
            const options = Bitbankcc.getOptions( `user/spot/order`, params );
            return await self.request( options, self.response );
          }
        }
      },
    }
  }
}

export default new Bitbankcc();
