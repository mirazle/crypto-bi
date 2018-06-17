import Schema from './Schema';
import util from '../util';
import confControl from '../conf/control';

export default class ProfitParams extends Schema{

  constructor( params = {} ){
    super();
    const rate = params.rate ? params.rate : 0;
    const amount = params.amount ? params.amount : 0;
    const saleRealAmount = params.saleRealAmount ? params.saleRealAmount : 0 ;
    return this.create({
      rate,
      amount,
      saleRealAmount
    });
  }
}
