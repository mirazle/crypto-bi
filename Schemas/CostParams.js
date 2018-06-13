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

  static generate( base, valid ){
    const costParams = new CostParams();
    const { exName, productCode, fiatBalance } = base;
    const { inFiatCost, outFiatCost, productConf } = this.exConf[ exName ];
    const { enable, askCost, withDrawCost, bidCost, withDrawCheckTransaction } = productConf[ productCode ];
    const fiatCode = this.getFiatCode( exName, productCode );
    const outFiatCostFix = outFiatCost[ fiatCode ].sep <= fiatBalance ? outFiatCost[ fiatCode ].high : outFiatCost[ fiatCode ].low ;

    if( enable ){
      costParams.inFiat = Number( inFiatCost[ fiatCode ] );
      costParams.ask = this.util.multiply( fiatBalance, askCost );
      costParams.withDraw = this.util.multiply( fiatBalance, withDrawCost );
      costParams.bid = this.util.multiply( valid.fiatBalance, bidCost );
      costParams.outFiat = Number( outFiatCostFix );
      costParams.setTotal();
    }
    return costParams;
  }
}
