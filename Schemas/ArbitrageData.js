import Schema from './Schema';
import Schemas from './index';
import Logs from '../Logs/';

export default class ArbitrageData extends Schema{

  constructor( params = {} ){
    super();
    const exName = params.exName ? params.exName : '';
    const productCode = params.productCode ? params.productCode : '';
    const currencyCode = params.productCode ? params.productCode.split('_')[ 0 ] : '';
    const fiatCode = params.productCode ? params.productCode.split('_')[ 1 ] : '';
    const threshold = new Schemas.ThresholdParams( params.threshold );
    const profit = new Schemas.ProfitParams( params.profit );
    const base = new Schemas.ExParams( params.base );
    const valid = new Schemas.ExParams( params.valid );
    const cost = new Schemas.CostParams( params );
    const trend = new Schemas.TrendParams( params.trend );
    const isArbitrage = false;

    const arbitrageData = this.create({
      isArbitrage,
      productCode,
      currencyCode,
      fiatCode,
      exName,
      profit,
      threshold,
      base,
      valid,
      cost,
      trend
    });

    return this.setIsArbitrage();
  }

  setIsArbitrage(){
    this.isArbitrage = this.threshold.profitAmount < this.profit.amount;
    return this;
  }

  getDebug(){
    const {
      isArbitrage,
      productCode,
      currencyCode,
      fiatCode,
      threshold,
      profit,
      base,
      valid,
      cost,
      trend
    } = this;

    const debugSummary = `${isArbitrage} BUY: ${base.fiatBalance}${fiatCode}`;
    const debugBase = `${base.exName}[ ${base.tradeAmount}${currencyCode} : ${base.ltp}${fiatCode} ]`;
    const debugValid = `SELL: ${valid.exName}[ ${valid.tradeAmount}${currencyCode}( -${cost.withDraw}${currencyCode} ) : ${valid.ltp}${fiatCode} ]`;
    const debugThreashold = `THRESHOLD ${threshold.profitAmount}${fiatCode}[ ${threshold.profitRate}% ]`;
    const debugReal =  `REAL ${profit.amount}${fiatCode}( ${ profit.saleRealAmount }${fiatCode} - ${ cost.totalFiat }${fiatCode} )[ ${profit.rate}% ]`;
    const debugTrend =  `TREND ${trend.mode}`;
    const debug = `${debugSummary} ( ${debugBase} ${debugValid} ) ${debugReal} ${debugThreashold} ${debugTrend}`

    return debug;
  }
}
