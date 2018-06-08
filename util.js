export default {
  multiply: ( value1, value2 ) => {
    return ( ( value1 * 10 ) ) * ( ( value2 * 10 ) ) / 100;
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
