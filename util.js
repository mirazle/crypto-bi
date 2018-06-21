import util from './util';

// 小数点の数を返す
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
      calc,
      powed,
      result;

      calc = intValue1 * intValue2;
      powed = Math.pow( 10, decimalLength) ;
      result = calc / powed;
  return result;
};

Math.division = function( value1, value2 ) {
  let result = parseFloat( ( value1 / value2 ).toFixed( 5 ) );// / powed;
  return result;
};

Math.subtract = function(value1, value2) {
    var max = Math.max(Math._getDecimalLength(value1), Math._getDecimalLength(value2)),
        k = Math.pow(10, max);
    return (Math.multiply(value1, k) - Math.multiply(value2, k)) / k;
};

export default {
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
