import Schema from './Schema';
import util from '../util';
import confControl from '../conf/control';

export default class CostParams extends Schema{

  constructor( params = {}, type ){
    super();
    const baseExName = params.baseExName ? params.baseExName : '';
    const validExName = params.validExName ? params.validExName : '';
    const productCode = params.productCode ? params.productCode : '';
    const totalFiat = params.totalFiat ? params.totalFiat : 0 ;
    const inFiat = params.inFiat ? params.inFiat : 0 ;
    const ask = params.ask ? params.ask : 0 ;
    const askFiat = params.askFiat ? params.askFiat : 0 ;
    const withDraw = params.withDraw ? params.withDraw : 0 ;
    const withDrawFiat = params.withDrawFiat ? params.withDrawFiat : 0 ;
    const bid = params.bid ? params.bid : 0 ;
    const bidFiat = params.bidFiat ? params.bidFiat : 0 ;
    const outFiat = params.outFiat ? params.outFiat : 0 ;

    this.setConf( baseExName, validExName, productCode );

    return this.create({
      baseExName,           // require
      validExName,          // require
      productCode,          // require
      totalFiat,
      inFiat,
      ask,
      askFiat,
      withDraw,
      withDrawFiat,
      bid,
      bidFiat,
      outFiat
    });
  }

  setConf( baseExName, validExName, productCode ){
    if( baseExName, validExName, productCode ){
      this.baseControl = confControl.exConf[ baseExName ].productConf[ productCode ];
      this.validControl = confControl.exConf[ validExName ].productConf[ productCode ];
    }
  }

  setAsks( base ){
    const { askCost } = this.baseControl;
    this.ask = util.multiply( base.tradeAmount, askCost );
    this.askFiat = util.multiply( base.ltp, this.ask );
    return this;
  }

  setWithDraws( base ){
    const { withDrawCost } = this.baseControl;
    this.withDraw = util.multiply( base.tradeAmount, withDrawCost, 8 );
    this.withDrawFiat = Math.ceil( util.multiply( base.ltp, this.withDraw ) );
    return this;
  }

  setBids( base, valid ){
    const { bidCost } = this.validControl;
    this.bid = util.multiply( valid.tradeAmount, bidCost );
    this.bidFiat = util.multiply( base.ltp, this.bid );
    return this;
  }

  setTotalFiat(){
    this.totalFiat = Math.ceil(
      this.inFiat +
      this.askFiat +
      this.withDrawFiat +
      this.bidFiat +
      this.outFiat
    );
    return this;
  }
}
