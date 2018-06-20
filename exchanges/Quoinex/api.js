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
      method = Rest.POST;
      break;
    }
    return method;
  }

  static getOptions( path, params = {} ){
    const timestamp = Rest.getTimestamp();
    const urlParamsString = Rest.getUrlParamsString( params, true );
    const sign = Quoinex.getSign( `/${path}${urlParamsString}` );
/*
    console.log("----- " + path );
    console.log( params );
    console.log("-----");
*/
    const url = `${Quoinex.endpoint}${path}${urlParamsString}`;
    const method = Quoinex.getMethod( path );
    const headers = {
      'X-Quoine-API-Version': Quoinex.apiVer,
      'X-Quoine-Auth': sign,
      'Content-Type': Quoinex.contentType
    }
    return { url, method, headers };
  }

  async orders( params ){
    const options = Quoinex.getOptions( 'orders', params );
//    console.log( options );
    return await this.request( options, this.response )
  }

  async products( ){
    const options = {url: `${Quoinex.endpoint}products`};
    return await this.request( options, this.response );
  }

  get accounts(){
    return {
      balance: async ( params ) => {
        const options = Quoinex.getOptions( `accounts/balance`, params );
//    console.log( options );
        return await this.request( options, this.response );
      }
    }
  }

}

export default new Quoinex();
