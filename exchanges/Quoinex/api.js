import Rest from '../Rest';
import jwt from 'jsonwebtoken';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

class Quoinex extends Rest{

  static get endpoint(){ return `https://api.quoine.com/` }
  static get apiVer(){ return '2' }
  static get contentType(){ return 'application/json' }
  static get authAlgorithm(){ return 'hs256' }
  static getSign( path ){ return jwt.sign({ path, nonce: Date.now(), token_id: confPrivate.Quoinex.key}, confPrivate.Quoinex.secret); }
  static getMethod( path ){
    let method = 'GET';
    switch( path ){
    case 'orders':
      method = Rest.GET;
      break;
    }
    return method;
  }

  static getOptions( path, params = {} ){
    const bodyParams = params.bodyParams ? params.bodyParams :  {};
    const urlParams = params.urlParams ? params.urlParams: {};
    const timestamp = Rest.getTimestamp();
    const urlParamsString = Rest.getUrlParamsString( urlParams, true );
    const sign = Quoinex.getSign( `/${path}${urlParamsString}` );

    const url = `${Quoinex.endpoint}${path}${urlParamsString}`;
    const method = Quoinex.getMethod( path );
    const headers = {
      'X-Quoine-API-Version': Quoinex.apiVer,
      'X-Quoine-Auth': sign,
      'Content-Type': Quoinex.contentType
    }
    return { url, method, headers };
  }

  async orders( urlParams ){
    const options = Quoinex.getOptions( 'orders', urlParams );
    return await this.request( options, ( err, response, payload ) => {
      try {
        return JSON.parse( payload );
      } catch (e) {
        Logs.out( e, 'strong' );
        return null;
      }
    })
  }

  async products( ){
    const options = {url: `${Quoinex.endpoint}products`};
    return await this.request( options, ( err, response, payload ) => {
      try {
        return JSON.parse( payload );
      } catch (e) {
        Logs.out( e, 'strong' );
        return null;
      }
    })
  }

  get accounts(){
    return {
      balance: async ( params ) => {
        console.log("@@@@@@@@@@1 ");
        const options = Quoinex.getOptions( `accounts/balance`, params );
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

export default new Quoinex();
