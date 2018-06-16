import Schema from './Schema';
import util from '../util';
import confControl from '../conf/control';

export default class CostParams extends Schema{

  static get selfCurrencyAmount(){ return 'selfCurrencyAmount' }
  static get selfCurrencyPercent(){ return 'selfCurrencyPercent' }
  static get promisedFiatPercent(){ return 'promisedFiatPercent' }

  constructor( params = {} ){
    super();
    const baseExName = params.base && params.base.exName ? params.base.exName : '';
    const validExName = params.valid && params.valid.exName ? params.valid.exName : '';
    const productCode = params.base && params.base.productCode ? params.base.productCode : '';
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
      const pc = productCode.split('_');
      const currencyCode = pc[ 0 ];
      const fiatCode = pc[ 1 ];
      this.inFiatControl = confControl.exConf[ validExName ].inFiatCost[ fiatCode ];
      this.baseControl = confControl.exConf[ baseExName ].productConf[ productCode ];
      this.validControl = confControl.exConf[ validExName ].productConf[ productCode ];
      this.outFiatControl = confControl.exConf[ validExName ].outFiatCost[ fiatCode ];
    }
  }

  setInFiat(){
    this.inFiat = this.inFiatControl
    return this;
  }

  // トータルの数量に対して0.001とかではないか？
  setAsks( base ){
    const { type, size } = this.baseControl.askCost;
    const costBase = type === CostParams.selfCurrencyPercent ? base.tradeAmount : base.fiatBalance ;
    this.bid = Math.multiply( costBase, size / 100 );
    this.askFiat = Math.ceil( Math.multiply( base.ltp, this.ask ) );
    return this;
  }

  setWithDraws( base ){
    const { type, size } = this.baseControl.withDrawCost;
    this.withDraw = size;
    this.withDrawFiat = Math.ceil( Math.multiply( base.ltp, this.withDraw ) );
    return this;
  }

  // トータルの数量に対して0.001とかではないか？
  setBids( valid, saleRealAmount ){
    const { type, size } = this.validControl.bidCost;

    //console.log("     ====== " + type + " " + saleRealAmount + " " + size + " " + valid.tradeAmount);
    //     ====== 301308 0.1 975.742
    // bidFiat      : 293998.870536 _ 0.975742

    if( type === CostParams.selfCurrencyPercent ){
      this.bid = Math.multiply( valid.tradeAmount, size / 100 );
      this.bidFiat = Math.ceil( Math.multiply( valid.ltp, this.bid ) );
    }else{

      // 購入額( 300000 ) * 手数料率( 0.0025 ) = ( 手数料 )750 ( LTP: 700000 )
      this.bidFiat = Math.ceil( Math.multiply( saleRealAmount, size / 100 ) );

      // 売却額( 300000 ) / LTP( 700000 ) = 0.4285( 売却量 )
      // 0.4285( 売却量  ) * ( 手数料率 )0.0025 = 手数料(コインベース)
      this.bid = Math.multiply( valid.tradeAmount, size / 100 );
    }
    return this;
  }

  setOutFiat( saleRealAmount ){
    const { low, high, sep } = this.outFiatControl
    this.outFiat = saleRealAmount >= sep ? high : low ;
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
