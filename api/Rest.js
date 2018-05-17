import request from 'request';
import crypto from 'crypto';

export default class Rest{

  static get GET(){ return 'GET'}
  static get POST(){ return 'POST'}
  static getTimestamp(){ return Date.now().toString() }
  static getBody( params ){ return JSON.stringify( params ) }
  static getText(){ return timestamp + method + path + body; }
  static getBody( params ){ return JSON.stringify( params ) }

  static getUrlParamsString( obj, addQuestion = false ){
    let spredObjStr = ''
    if( typeof( obj ) === 'object' ){
      const keys = Object.keys( obj );
      const length = keys.length;
      keys.forEach( ( key, index ) => {
        const isLast = length >= ( index + 1 );
        const andKey = isLast ? '' : '&' ;
        spredObjStr += `${key}=${obj[ key ]}${andKey}`
      });
      return addQuestion ? `?${spredObjStr}` : spredObjStr;
    }else{
      return spredObjStr;
    }
  }

  request( options, callback ){
    return new Promise( ( resolve, reject ) => {
      request( options, ( err, response, payload ) => {
        resolve( callback( err, response, payload ) );
      });
    });
  }
}
