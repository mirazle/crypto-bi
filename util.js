import util from './util';

Math._getDecimalLength = function( value ) {
  let list = (value + '').split('.'), result = 0;
  if (list[ 1 ] !== undefined  && list[ 1 ].length > 0) {
      result = list[ 1 ].length;
  }
  return result;
};

Math.multiply = function( value1, value2 ) {
  let intValue1 = +( value1 + '' ).replace('.', ''),
      intValue2 = +( value2 + '' ).replace('.', ''),
      decimalLength = Math._getDecimalLength( value1 ) + Math._getDecimalLength( value2 ),
      result;

  result = (intValue1 * intValue2) / Math.pow(10, decimalLength);

  return result;
};

Math.subtract = function(value1, value2) {
    var max = Math.max(Math._getDecimalLength(value1), Math._getDecimalLength(value2)),
        k = Math.pow(10, max);
    return (Math.multiply(value1, k) - Math.multiply(value2, k)) / k;
};

export default {
  multiply: ( value1, value2, decimelNum = 0 ) => {
    if( value1 === 0 || value2 === 0 ) return 0;
    let returnValue = Math.multiply( value1, value2 );
//    let returnValue = ( ( value1 * 10 ) * ( value2 * 10 ) ) / 100;
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
