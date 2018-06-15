import Schema from './Schema';
import util from '../util';
import confControl from '../conf/control';

export default class CostParams extends Schema{

  static get currencyCode(){ return 'currency' }
  static get promiseFiatCode(){ return 'promiseFiat' }

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
    const { type, amount } = this.baseControl.askCost;
    const costBase = type === CostParams.currencyCode ? base.tradeAmount : base.fiatBalance ;
    this.bid = util.multiply( costBase, amount );
    this.askFiat = util.multiply( base.ltp, this.ask );
    return this;
  }

  setWithDraws( base ){
    const { type, amount } = this.baseControl.withDrawCost;
    this.withDraw = util.multiply( base.tradeAmount, amount, 8 );
    this.withDrawFiat = Math.ceil( util.multiply( base.ltp, this.withDraw ) );
    return this;
  }

  setBids( valid, saleRealAmount ){
    const { type, amount } = this.validControl.bidCost;

    if( type === CostParams.currencyCode ){
      this.bid = util.multiply( valid.tradeAmount, amount );
      this.bidFiat = util.multiply( saleRealAmount, this.bid );
    }else{

      // 購入額( 300000 ) * 手数料率( 0.0025 ) = ( 手数料 )750 ( LTP: 700000 )
      this.bidFiat = Math.ceil( util.multiply( saleRealAmount, amount ) );

      // 売却額( 300000 ) / LTP( 700000 ) = 0.4285( 売却量 )
      // 0.4285( 売却量  ) * ( 手数料率 )0.0025 = 手数料(コインベース)
      this.bid = util.multiply( valid.tradeAmount, amount, 5 );
    }

// TODO Nan
// false BUY: 300000JPY ( bitbankcc[ 3.0864BCH : 97200JPY ] SELL: quoinex[ 3.08331BCH( -0.00308639BCH ) : 97708.01005JPY ] ) REAL NaNJPY( 301565.99999JPY - NaNJPY )[ 1.00522% ] THRESHOLD 300450JPY[ 1.0015% ]
    //this.bid = util.multiply( costBase, amount );
    //this.bidFiat = util.multiply( valid.ltp, this.bid );
    //console.log( this.bid + " fiat: " + this.bidFiat + " @@ " + valid.exName + " " + valid.productCode + " " + costBase + " " + amount );
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
