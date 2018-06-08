import Schema from './Schema';

export default class CostParams extends Schema{

  constructor( params = {} ){
    super();
    const total = params.total ? params.total : 0 ;
    const inFiat = params.inFiat ? params.inFiat : 0 ;
    const ask = params.ask ? params.ask : 0 ;
    const withDraw = params.withDraw ? params.withDraw : 0 ;
    const bid = params.bid ? params.bid : 0 ;
    const outFiat = params.outFiat ? params.outFiat : 0 ;
    return this.create({
      total,
      inFiat,
      ask,
      withDraw,
      bid,
      outFiat
    });
  }

  setTotal(){
    this.total = Math.ceil(
      this.inFiat +
      this.ask +
      this.withDraw +
      this.bid +
      this.outFiat
    );
  }
}
