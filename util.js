import util from './util';

export default {
  multiply: ( value1, value2, decimelNum = 0 ) => {
    if( value1 === 0 || value2 === 0 ) return 0;
    const returnValue = ( ( value1 * 10 ) ) * ( ( value2 * 10 ) ) / 100;
    return decimelNum > 0 ? util.getDecimel( returnValue, decimelNum ) : returnValue ;
  },
  division: ( value1, value2, decimelNum = 0 ) => {
    if( value1 === 0 || value2 === 0 ) return 0;
    const returnValue = value1 / value2;
    return decimelNum > 0 ? util.getDecimel( returnValue, decimelNum ) : returnValue ;
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
