import Schema from './Schema';
import Schemas from './index';

export default class ArbitrageData extends Schema{

  constructor( params = {} ){
    super();
    const productCode = params.productCode ? params.productCode : '';
    const exName = params.exName ? params.exName : '';
    const grossProfitAmount = params.grossProfitAmount ? params.grossProfitAmount : 0;
    const profitAmount = params.profitAmount ? params.profitAmount : 0;
    const arbitrageThresholdAmount = params.arbitrageThresholdAmount ? params.arbitrageThresholdAmount : 0.0;
    const arbitrageProfitRate = params.arbitrageProfitRate ? params.arbitrageProfitRate : 0.0;
    const fiatCode = params.fiatCode ? params.fiatCode : '';
    const base = new Schemas.LtpParams( params.base );
    const valid = new Schemas.LtpParams( params.valid );
    const cost = new Schemas.CostParams( params.cost );
    const trend = new Schemas.TrendParams( params.trend );
    const exist = params.productCode ? true : false ;

    return this.create({
      exist,
      productCode,
      exName,
      grossProfitAmount,
      profitAmount,
      arbitrageThresholdAmount,
      arbitrageProfitRate,
      fiatCode,
      base,
      valid,
      cost,
      trend
    });
  }

  setGrossProfitAmount(){
    this.grossProfitAmount = this.profitAmount - this.cost.total;
  }
}
