let controlBase = {
  exConf: {
    bitflyer: {
      enable: true,
      ipWhitelist: false,
      timeout: 2000,
      productCodeStructure: {head: 'UP', separater: '_', foot: 'UP'}
    },
    quoinex: {
      enable: true,
      ipWhitelist: false,
      timeout: 2000,
      productCodeStructure: {head: 'UP', separater: null, foot: 'UP'}
    },
    zaif: {
      enable: true,
      ipWhitelist: true,
      timeout: 5000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    bitbankcc: {
      enable: true,
      ipWhitelist: false,
      timeout: 2000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    btcbox: {
      enable: true,
      ipWhitelist: false,
      timeout: 2000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    fisco: {
      enable: true,
      ipWhitelist: true,
      timeout: 2000,
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    }
  },
  productConf: {
    BTC_JPY: {
      enable: true,
      arbitrageProfitRate: 0.005
    },
    BCH_JPY: {
      enable: true,
      arbitrageProfitRate: 0.015
    },
    ETH_JPY: {
      enable: true,
      arbitrageProfitRate: 0.015
    },
    XRP_JPY: {
      enable: true,
      arbitrageProfitRate: 0.015
    },
    XEM_JPY: {
      enable: true,
      arbitrageProfitRate: 0.015
    },
    MONA_JPY: {
      enable: true,
      arbitrageProfitRate: 0.015
    },
    DASH_JPY: {
      enable: true,
      arbitrageProfitRate: 0.015
    },
    LTC_JPY: {
      enable: true,
      arbitrageProfitRate: 0.015
    }
  },
  generalConf: {
    baseCurrencyCode: 'BTC',
    risingTrendMode: {
//      logLtpParamsAmount: 1080,   // 3時間
      logLtpParamsAmount: 3,
    },
    arbitrageProfitRate: 0.1,
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
