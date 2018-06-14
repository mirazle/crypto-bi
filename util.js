import util from './util';

export default {
  multiply: ( value1, value2, decimelNum = 0 ) => {
    if( value1 === 0 || value2 === 0 ) return 0;
    let returnValue = ( ( value1 * 10 ) ) * ( ( value2 * 10 ) ) / 100;
    if( decimelNum > 0 ){
      returnValue = util.getDecimel( returnValue, decimelNum );
    }
    return returnValue;
  },
  division: ( value1, value2, decimelNum = 0 ) => {
    if( value1 === 0 || value2 === 0 ) return 0;
    let returnValue = value1 / value2;
    if( decimelNum > 0 ){
      returnValue = util.getDecimel( returnValue, decimelNum );
    }
    return returnValue ;
  },
  getDecimel: ( value, decimelNum = 3 ) => {
    return Math.floor( value * Math.pow( 10, decimelNum ) ) / Math.pow( 10, decimelNum ) ;
  },
  orgRound: ( value, base ) => {
   return Math.round(value * base) / base;
 },
  orgCeil: ( value, base ) => {
    return Math.ceil(value * base) / base;
  },
  orgFloor: ( value, base ) => {
    return Math.floor(value * base) / base;
  }
}
