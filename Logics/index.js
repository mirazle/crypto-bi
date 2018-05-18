import Phase1 from './Phase1';
import Phase2 from './Phase2';

export default class LoadLogics{
  constructor( exchangeConf,  productCode, conf ){
    this.p1 = new Phase1( exchangeConf, productCode, conf );
    this.p2 = new Phase2( exchangeConf, productCode, conf );
  }
}
