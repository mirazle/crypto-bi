import Schema from './Schema';
import Schemas from './index';

export default class ArbitrageData extends Schema{

  constructor( params = {} ){
    super();
    const productCode = params.productCode ? params.productCode : '';
    const exName = params.exName ? params.exName : '';
    const grossProfitAmount = params.grossProfitAmount ? params.grossProfitAmount : 0;
    const profitAmount = params.profitAmount ? params.profitAmount : '';
    const arbitrageThresholdAmount = params.arbitrageThresholdAmount ? params.arbitrageThresholdAmount : '';
    const arbitrageProfitRate = params.arbitrageProfitRate ? params.arbitrageProfitRate : '';
    const fiatCode = params.fiatCode ? params.fiatCode : '';
    const base = new Schemas.LtpParams( params.base );
    const valid = new Schemas.LtpParams( params.valid );
    const cost = new Schemas.CostParams( params.cost );
    return this.create({
      productCode,
      exName,
      grossProfitAmount,
      profitAmount,
      arbitrageThresholdAmount,
      arbitrageProfitRate,
      fiatCode,
      base,
      valid,
      cost
    });
  }

  setGrossProfitAmount(){
    this.grossProfitAmount = this.profitAmount - this.cost.total;
  }
}
