import Phase1 from './Phase1';
import Phase2 from './Phase2';

export default class LoadLogics{
  constructor( params ){
    this.p1 = new Phase1( params );
    this.p2 = new Phase2( params );
  }
}
