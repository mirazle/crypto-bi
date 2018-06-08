import Schema from './Schema';

export default class TrendParams extends Schema{

  static get MODE_NORMAL(){ return 'NORMAL' };
  static get MODE_UP(){ return 'UP' };
  static get MODE_DOWN(){ return 'DOWN' };
  static get MODE_CHOPPY(){ return 'CHOPPY' };

  constructor( params = {} ){
    super();
    const productCode = params.productCode ? params.productCode : '';
    const mode = params.mode ? params.mode : '';
    const lv = this.getLvSchema( params.lv );
    return this.create({
      productCode,
      mode,
      lv,
    });
  }

  getLvSchema( params = {} ){
    const UP = params.UP ? params.UP : 0;
    const NORMAL = params.NORMAL ? params.NORMAL : 0;
    const DOWN = params.DOWN ? params.DOWN : 0;
    const CHOPPY = params.CHOPPY ? params.CHOPPY : 0;
    return this.create({
      UP,
      NORMAL,
      DOWN,
      CHOPPY,
    });
  }
}
