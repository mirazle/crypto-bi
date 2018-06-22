import Rest from '../Rest';
import jwt from 'jsonwebtoken';
import confPrivate from '../../conf/private';
import Logs from '../../Logs/';

import api from '../../quac-master/quoinex/api';
import conf from '../../conf/private';

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

console.log(conf.Quoinex.key);
console.log(conf.Quoinex.secret);

//    const options = Quoinex.getOptions( 'orders', params );
/*
const pri = new api.PrivateAPI( conf.Quoinex.key, conf.Quoinex.secret );
const options = pri.makeRequest( 'POST', '/orders', {
  order_type: "limit",
  product_id: 1,
  side: 'buy',
  quantity: "0.01",
  price: "7800"
});
*/
const pri = new api.PrivateAPI( conf.Quoinex.key, conf.Quoinex.secret )
  .call("POST", '/orders/', {
    order_type: "limit",
    product_id: 1,
    side: 'buy',
    quantity: "0.01",
    price: "7800"
  })
  .then(console.log)
  .catch(console.error)

//    return await this.request( options, this.response )
  }

  async products( ){
    const options = {url: `${Quoinex.endpoint}products`};
    return await this.request( options, this.response );
  }

  get accounts(){
    return {
      balance: async ( params ) => {
        const options = Quoinex.getOptions( `accounts/balance`, params );
        return await this.request( options, this.response );
      }
    }
  }

}

export default new Quoinex();
