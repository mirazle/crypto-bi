import SetStatus from './1_SetStatus';
import Phase2 from './2_Phase2';

export default class LoadLogics{
  constructor( params ){
    this.setStatus = new SetStatus( params );
    this.p2 = new Phase2( params );
  }
}
