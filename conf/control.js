
// JPYに換金可能で送金APIが整備してるある、送金時間が短い通貨を対象にする

let controlBase = {
  exConf: {
    bitflyer: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: true,
      currencyAliases: {},
      timeout: 2000,
      productCodeStructure: {head: 'UP', separater: '_', foot: 'UP'}
    },
    quoinex: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: false,
      currencyAliases: {},
      timeout: 2000,
      productCodeStructure: {head: 'UP', separater: null, foot: 'UP'}
    },
    zaif: {
      enable: true,
      ipWhitelist: true,
      withDrawApi: true,
      currencyAliases: {},
      timeout: 5000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    bitbankcc: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: true,
      currencyAliases: {BCH: 'BCC'},
      timeout: 2000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    btcbox: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: false,
      currencyAliases: {},
      timeout: 2000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    fisco: {
      enable: true,
      ipWhitelist: true,
      withDrawApi: true,
      currencyAliases: {},
      timeout: 2000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    }
  },
  productConf: {
    BTC_JPY: { enable: false, askBalanceRate: 0.1, arbitrageProfitRate: 0.02, askCost: 0, withDrawCost: 0, bidCost: 0, inCost: 0, outCost: 0, checkTransaction: true },
    BCH_JPY: { enable: false, askBalanceRate: 1, arbitrageProfitRate: 0.02, askCost: 0, withDrawCost: 0, bidCost: 0, inCost: 0, outCost: 0, checkTransaction: true },
    ETH_JPY: { enable: true, askBalanceRate: 2, arbitrageProfitRate: 0.02, askCost: 0, withDrawCost: 0, bidCost: 0, inCost: 0, outCost: 0, checkTransaction: true },
    XRP_JPY: { enable: true, askBalanceRate: 2000, arbitrageProfitRate: 0.02, askCost: 0, withDrawCost: 0, bidCost: 0, inCost: 0, outCost: 0, checkTransaction: true },
    XEM_JPY: { enable: true, askBalanceRate: 1000, arbitrageProfitRate: 0.02, askCost: 0, withDrawCost: 0, bidCost: 0, inCost: 0, outCost: 0, checkTransaction: true },
    MONA_JPY: { enable: true, askBalanceRate: 400, arbitrageProfitRate: 0.02, askCost: 0, withDrawCost: 0, bidCost: 0, inCost: 0, outCost: 0, checkTransaction: true },
    LTC_JPY: { enable: true, askBalanceRate: 10, arbitrageProfitRate: 0.02, askCost: 0, withDrawCost: 0, bidCost: 0, inCost: 0, outCost: 0, checkTransaction: true },
  },
  generalConf: {
    baseCurrencyCode: 'BTC',
    assetsJpy: 100000,
    feeBalance: 0.05,
    trendMode: {
//     logLtpParamsAmount: 1080,   // 3時間
      logLtpParamsAmount: 300,
    },
    arbitrageProfitRate: 0.1,
    orderToTrendMode: [ 'NORMAL', 'UP' ],
    log: {console: true, web: false},
    proccessTermMicroSecond: 10000, // 10秒毎に実行する
  }
}

Object.keys( controlBase.exConf ).forEach( ( exName ) =>{
  if ( !controlBase.exConf[ exName ].enable ) delete controlBase.exConf[ exName ];
});

Object.keys( controlBase.productConf ).forEach( ( productCode ) =>{
  if ( !controlBase.productConf[ productCode ].enable ) delete controlBase.productConf[ productCode ];
});

export default controlBase;
/*
  １ 何秒に一回実行するか？(回転数)
  ３ 手数料の反映
*/
