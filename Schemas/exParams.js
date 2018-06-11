import Schema from './Schema';

export default class ExParams extends Schema{

  constructor( params = {} ){
    super();
    const exName = params.exName ? params.exName : '';
    const productCode = params.productCode ? params.productCode : '';
    const exProductCode = params.exProductCode ? params.exProductCode : '';
    const ltp = params.ltp ? params.ltp : 0 ;
    const fiatBalance = params.fiatBalance ? params.fiatBalancezs : 0 ;
    const askBalanceAmount = params.askBalanceAmount ? params.askBalanceAmount : 0 ;
    return this.create({
      exName,
      productCode,
      exProductCode,
      ltp,
      fiatBalance,
      askBalanceAmount
    });
  }
}
