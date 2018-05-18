export default {
  exchanges: {
    bitflyer: {
      productCodeStructure: {head: 'UP', separater: '_', foot: 'UP'}
    },
    quoinex: {
      productCodeStructure: {head: 'UP', separater: null, foot: 'UP'}
    },
    zaif: {
      productCodeStructure: {head: 'DOWN', separater: '_', foot: 'DOWN'}
    }
  },
  productCodes: {
    BTC_JPY: {
      arbitrageProfitRate: 0.0025
    },
    BCH_JPY: {
      arbitrageProfitRate: 0.025
    },
    ETH_JPY: {
      arbitrageProfitRate: 0.025
    },
    XRP_JPY: {
      arbitrageProfitRate: 0.025
    }
  },
  log: {console: true, web: false},
  proccessTermMicroSecond: 5000, // 10秒毎に実行する
}
