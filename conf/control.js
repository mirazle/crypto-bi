export default {
  exConf: {
    bitflyer: {
      productCodeStructure: {head: 'UP', separater: '_', foot: 'UP'}
    },
    quoinex: {
      productCodeStructure: {head: 'UP', separater: null, foot: 'UP'}
    },
    zaif: {
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    bitbankcc: {
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    },
    btcbox: {
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
    }
  },
  generalConf: {
    arbitrageProfitRate: 0.1,
    log: {console: true, web: false},
    proccessTermMicroSecond: 5000, // 10秒毎に実行する
  }
}


/*
  １ 何秒に一回実行するか？(回転数)
  ２ アビトラージ額の上下設定
  ３ 手数料の反映
*/
