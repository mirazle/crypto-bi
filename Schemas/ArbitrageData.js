import Schema from './Schema';
import Schemas from './index';

export default class ArbitrageData extends Schema{

  constructor( params = {} ){
    super();
    const productCode = params.productCode ? params.productCode : '';
    const exName = params.exName ? params.exName : '';
    const profitRealAmount = params.profitRealAmount ? params.profitRealAmount : 0;
    const profitRealRate = params.profitRealRate ? params.profitRealRate : 0;
    const profitThresholdAmount = params.profitThresholdAmount ? params.profitThresholdAmount : 0.0;
    const profitThresholdRate = params.profitThresholdRate ? params.profitThresholdRate : 0.0;
    const fiatCode = params.fiatCode ? params.fiatCode : '';
    const base = new Schemas.ExParams( params.base );
    const valid = new Schemas.ExParams( params.valid );
    const cost = new Schemas.CostParams( params.cost );
    const trend = new Schemas.TrendParams( params.trend );
    const exist = params.productCode ? true : false ;

    return this.create({
      exist,
      productCode,
      exName,
      profitRealAmount,
      profitRealRate,
      profitThresholdAmount,
      profitThresholdRate,
      fiatCode,
      base,
      valid,
      cost,
      trend
    });
  }
}
