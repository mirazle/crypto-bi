import Bitflyer from './Bitflyer/';
import Quoinex from './Quoinex/';
import Zaif from './Zaif/';
import Bitbankcc from './Bitbankcc/';
import Btcbox from './Btcbox/';
import Fisco from './Fisco/';

export default {
  bitflyer: new Bitflyer(),
  quoinex: new Quoinex(),
  zaif: new Zaif(),
  bitbankcc: new Bitbankcc(),
  btcbox: new Btcbox(),
  fisco: new Fisco()
}
