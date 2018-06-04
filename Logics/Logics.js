

export default class Logics{

  getExProductCode( exName, productCode ){
    let exProductCode = '';
    const { productCodeStructure, currencyAliases } = this.exConf[ exName ];
    const { head, separater, foot } = productCodeStructure;
    const pc = productCode.split('_');
    const headCode = currencyAliases[ pc[ 0 ] ] ? currencyAliases[ pc[ 0 ] ] : pc[ 0 ];
    const footCode = pc[ 1 ];

    // 取引所毎の通貨の記法を吸収する
    exProductCode += head === 'UP' ? headCode.toUpperCase() :headCode.toLowerCase() ;
    exProductCode += separater === null ? '' :separater ;
    exProductCode += head === 'UP' ? footCode.toUpperCase() : footCode.toLowerCase() ;

    return exProductCode;
  }
}
