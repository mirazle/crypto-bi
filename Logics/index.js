import SetStatus from './1_SetStatus';
import Order from './2_Order';

export default class LoadLogics{
  constructor( params ){
    this.setStatus = new SetStatus( params );
    this.order = new Order( params );
  }
}
