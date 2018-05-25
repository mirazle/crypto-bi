import request from 'request';
import crypto from 'crypto';
import Logs from '../Logs/';

export default class Rest{

  static get GET(){ return 'GET'}
  static get POST(){ return 'POST'}
  static getTimestamp(){ return Date.now().toString() }
  static getTime(){ return new Date().getTime() }
  static getBody( params ){ return JSON.stringify( params ) }
  static getText(){ return timestamp + method + path + body; }
  static getBody( params ){ return JSON.stringify( params ) }
  static md5( data ){ return crypto.createHash('md5').update( new Buffer( data ) ).digest('hex').toString() }

  static getUrlParamsString( obj, addQuestion = false ){
    let spredObjStr = ''
    if( typeof( obj ) === 'object' && Object.keys( obj ).length > 0 ){
      const keys = Object.keys( obj );
      const length = keys.length;

      keys.forEach( ( key, index ) => {
        const isLast = length <= ( index + 1 );
        const andKey = isLast ? '' : '&' ;
        spredObjStr += `${key}=${obj[ key ]}${andKey}`
      });
      return addQuestion ? `?${spredObjStr}` : spredObjStr;
    }else{
      return spredObjStr;
    }
  }

  static isJSON( arg ){
  	arg = (typeof arg === "function") ? arg() : arg;
  	if (typeof arg  !== "string") {
  		return false;
  	}
  	try {
  		arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
  		return true;
  	} catch (e) {
  		return false;
  	}
  }

  request( options, callback ){
    return new Promise( ( resolve, reject ) => {
      request( options, ( err, response, payload ) => {
        resolve( callback( err, response, payload ) );
      });
    });
  }

  response( err, response, payload ){
    if( err ){
      Logs.trace( err, 'strong' );
      return null;
    }
    if( !Rest.isJSON( payload ) ){
      Logs.trace( 'NOT JSON', 'strong' );
      return null;
    }
    return JSON.parse( payload );
  }
}
