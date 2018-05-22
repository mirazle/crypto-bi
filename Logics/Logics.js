export default class Logics{
  getExProductCode( exName, productCode ){
    let exProductCode = '';
    const { head, separater, foot } = this.exConf[ exName ].productCodeStructure;
    const pc = productCode.split('_');

    exProductCode += head === 'UP' ? pc[ 0 ].toUpperCase() : pc[ 0 ].toLowerCase() ;
    exProductCode += separater === null ? '' :separater ;
    exProductCode += head === 'UP' ? pc[ 1 ].toUpperCase() : pc[ 1 ].toLowerCase() ;
    return exProductCode;
  }
}
