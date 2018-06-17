import os from 'os';
const hostName = os.hostname();
const env = hostName.indexOf( 'hmiyazakinoMacBook-Pro.local' ) >= 0 ? 'DEV' : 'PROD' ;
const generalArbitrageProfitRate = env === 'PROD' ? 1 : 0.01 ;
const devFiatBalance = env === 'PROD' ? 300000 : 300000 ;

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
        BTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0.11}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.0004}, bidCost: {type: 'selfCurrencyPercent', size: 0.11}, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.0002}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.005}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false }
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
        BTC_JPY: { enable: true, askCost: {type: 'promisedFiatPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'promisedFiatPercent', size: 0}, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: {type: 'promisedFiatPercent', size: 0.25}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'promisedFiatPercent', size: 0.25/* 0.25% */}, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: {type: 'promisedFiatPercent', size: 0.1}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'promisedFiatPercent', size: 0.1/* 0.1% */}, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: {type: 'promisedFiatPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'promisedFiatPercent', size: 0}, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: {type: 'promisedFiatPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'promisedFiatPercent', size: 0}, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: false, askCost: {type: 'promisedFiatPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'promisedFiatPercent', size: 0}, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: false, askCost: {type: 'promisedFiatPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'promisedFiatPercent', size: 0}, withDrawCostCheckTransaction: false }
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
        BTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.01}, bidCost: {type: 'selfCurrencyPercent', size: 0.3}, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.025}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 10}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.01}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false }
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
        BTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.005}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.15}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false }
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
        BTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0.05}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0.05}, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.01}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.002}, bidCost: {type: 'selfCurrencyPercent', size: 0.1}, withDrawCostCheckTransaction: false }
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
        BTC_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.0005}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCheckTransaction: false },
        BCH_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0.3}, withDrawCostCheckTransaction: false },
        ETH_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.01}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        XRP_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        XEM_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        MONA_JPY: { enable: true, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0.001}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false },
        LTC_JPY: { enable: false, askCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCost: {type: 'selfCurrencyAmount', size: 0}, bidCost: {type: 'selfCurrencyPercent', size: 0}, withDrawCostCheckTransaction: false }
      },
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    }
  },
  productConf: {
    BTC_JPY: { enable: true, arbitrageProfitRate: 1.03 },
    BCH_JPY: { enable: true, arbitrageProfitRate: 1.03 },
    ETH_JPY: { enable: true, arbitrageProfitRate: 1.03 },
    XRP_JPY: { enable: true, arbitrageProfitRate: 1.03 },
    XEM_JPY: { enable: true, arbitrageProfitRate: 1.03 },
    MONA_JPY: { enable: true, arbitrageProfitRate: 1.03 },
    LTC_JPY: { enable: true, arbitrageProfitRate: 1.03 }
  },
  generalConf: {
    env,
    devFiatBalance,
    baseCurrencyCode: 'BTC',
    minProfitBalance: 1.015,
    trendMode: {
     logLtpParamssize: 1080,   // 3時間
    },
    arbitrageProfitRate: generalArbitrageProfitRate,
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
