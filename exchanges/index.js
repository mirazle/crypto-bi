import Bitflyer from './Bitflyer/';
import Quoinex from './Quoinex/';
import Zaif from './Zaif/';

export default {
  bitflyer: new Bitflyer(),
  quoinex: new Quoinex(),
  zaif: new Zaif()
}
