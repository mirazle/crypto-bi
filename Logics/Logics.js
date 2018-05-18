export default class Logics{
  getExchangeProductCode( exName ){
    let exchangeProductCode = '';
    const { head, separater, foot } = this.exchangeConf[ exName ].productCodeStructure;
    const pc = this.productCode.split('_');

    exchangeProductCode += head === 'UP' ? pc[ 0 ].toUpperCase() : pc[ 0 ].toLowerCase() ;
    exchangeProductCode += separater === null ? '' :separater ;
    exchangeProductCode += head === 'UP' ? pc[ 1 ].toUpperCase() : pc[ 1 ].toLowerCase() ;
    return exchangeProductCode;
  }
}
