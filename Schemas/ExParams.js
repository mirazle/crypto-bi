import Schema from './Schema';

export default class ExParams extends Schema{

  constructor( params = {} ){
    super();
    const exName = params.exName ? params.exName : '';
    const productCode = params.productCode ? params.productCode : '';
    const exProductCode = params.exProductCode ? params.exProductCode : '';
    const ltp = params.ltp ? params.ltp : 0 ;
    const fiatBalance = params.fiatBalance ? params.fiatBalance : 0 ;
    const tradeAmount = params.tradeAmount ? params.tradeAmount : 0 ;
    return this.create({
      exName,
      productCode,
      exProductCode,
      ltp,
      fiatBalance,          // 元本となる法定通貨の資産状況
      tradeAmount           // トレードする通過量
    });
  }
}
