import Schema from './Schema';
import util from '../util';
import confControl from '../conf/control';

export default class ThresholdParams extends Schema{

  constructor( params = {} ){
    super();
    const profitRate = params.profitRate ? params.profitRate : 0;
    const profitAmount = params.profitAmount ? params.profitAmount : 0;

    return this.create({
      profitRate,
      profitAmount,
    });
  }
}
