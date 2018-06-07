
// JPYに換金可能で送金APIが整備してるある、送金時間が短い通貨を対象にする

let controlBase = {
  exConf: {
    bitflyer: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: true,
      currencyAliases: {},
      timeout: 2000,
      inFiatCost: {JPY: 324},
      outFiatCost: {JPY: { low: 540, high: 756, sep: 30000 } },
      productConf: {
        BTC_JPY: { enable: true, askCost: 0.11, withDrawCost: 0.0004, bidCost: 0.11, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: 0, withDrawCost: 0.0002, bidCost: 0, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: 0, withDrawCost: 0.005, bidCost: 0, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0, withDrawCostCheckTransaction: false }
      },
      productCodeStructure: {head: 'UP', separater: '_', foot: 'UP'}
    },
    quoinex: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: false,
      currencyAliases: {},
      timeout: 2000,
      inFiatCost: {JPY: 0},
      outFiatCost: {JPY: { low: 356, high: 756, sep: 500000 } },
      productConf: {
        BTC_JPY: { enable: true, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: 0.25, withDrawCost: 0, bidCost: 0.25, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: 0.1, withDrawCost: 0, bidCost: 0.1, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false }
      },
      productCodeStructure: {head: 'UP', separater: null, foot: 'UP'}
    },
    zaif: {
      enable: true,
      ipWhitelist: true,
      withDrawApi: true,
      currencyAliases: {},
      timeout: 5000,
      inFiatCost: {JPY: 0},
      outFiatCost: {JPY: { low: 500, high: 500, sep: null } },
      productConf: {
        BTC_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: 0, withDrawCost: 0.01, bidCost: 0, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: 0, withDrawCost: 0.025, bidCost: 0, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: true, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: true, askCost: 0, withDrawCost: 10, bidCost: 0, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: 0, withDrawCost: 0.01, bidCost: 0, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false }
      },
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    bitbankcc: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: true,
      currencyAliases: {BCH: 'BCC'},
      timeout: 2000,
      inFiatCost: {JPY: 0},
      outFiatCost: {JPY: { low: 540, high: 756, sep: 30000 } },
      productConf: {
        BTC_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: 0, withDrawCost: 0.005, bidCost: 0, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: true, askCost: 0, withDrawCost: 0.15, bidCost: 0, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0, withDrawCostCheckTransaction: false }
      },
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    btcbox: {
      enable: true,
      ipWhitelist: false,
      withDrawApi: false,
      currencyAliases: {},
      timeout: 2000,
      inFiatCost: {JPY: 0},
      outFiatCost: {JPY: { low: 400, high: 750, sep: 150000 } },
      productConf: {
        BTC_JPY: { enable: true, askCost: 0.05, withDrawCost: 0.001, bidCost: 0, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: 0.1, withDrawCost: 0.001, bidCost: 0, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: 0.1, withDrawCost: 0.01, bidCost: 0, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: true, askCost: 0.1, withDrawCost: 0.002, bidCost: 0, withDrawCostCheckTransaction: false }
      },
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    fisco: {
      enable: true,
      ipWhitelist: true,
      withDrawApi: true,
      currencyAliases: {},
      timeout: 2000,
      inFiatCost: {JPY: 0},
      outFiatCost: {JPY: { low: 300, high: 756, sep: 500000 } },
      productConf: {
        BTC_JPY: { enable: true, askCost: 0, withDrawCost: 0.0005, bidCost: 0, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0.3, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: false, askCost: 0, withDrawCost: 0.01, bidCost: 0, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: 0, withDrawCost: 0.001, bidCost: 0, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: false, askCost: 0, withDrawCost: 0, bidCost: 0, withDrawCostCheckTransaction: false }
      },
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    }
  },
  productConf: {
    BTC_JPY: { enable: true, askBalanceRate: 0.1, arbitrageProfitRate: 0.05 },
    BCH_JPY: { enable: true, askBalanceRate: 1, arbitrageProfitRate: 0.05 },
    ETH_JPY: { enable: true, askBalanceRate: 2, arbitrageProfitRate: 0.05 },
    XRP_JPY: { enable: true, askBalanceRate: 2000, arbitrageProfitRate: 0.05 },
    XEM_JPY: { enable: true, askBalanceRate: 1000, arbitrageProfitRate: 0.05 },
    MONA_JPY: { enable: true, askBalanceRate: 400, arbitrageProfitRate: 0.05 },
    LTC_JPY: { enable: true, askBalanceRate: 10, arbitrageProfitRate: 0.05 }
  },
  generalConf: {
    baseCurrencyCode: 'BTC',
    minProfitBalance: 1.015,
    trendMode: {
     logLtpParamsAmount: 1080,   // 3時間
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
