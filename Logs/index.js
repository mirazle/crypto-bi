import log4js from 'log4js';
log4js.configure('Logs/log4js_config.json', { reloadSecs: 10 });

const logs = {
  all: log4js.getLogger('all'),
  response: log4js.getLogger('response'),
  searchArbitorage: log4js.getLogger('searchArbitorage'),
  arbitorage: log4js.getLogger('arbitorage')
}

export default class Logs{

  static out ( type ){
    return {
      trace: ( log  ) =>  {
        Logs.trace( log );
        logs[ type ].trace( log );
      },
      debug: ( log ) => {
        Logs.trace( log );
        logs[ type ].debug( log );
      },
      info: ( log ) => {
        Logs.trace( log );
        logs[ type ].info( log );
      },
      warn: ( log  ) => {
        Logs.trace( log );
        logs[ type ].warn( log );
      },
      error: ( log ) =>  {
        Logs.trace( log );
        logs[ type ].error( log );
      },
      fatal: ( log  ) =>  {
        Logs.trace( log );
        logs[ type ].fatal( log );
      }
    }
  }

  static get response(){ return Logs.out( 'response' ) }
  static get searchArbitorage(){ return Logs.out( 'searchArbitorage' ) }
  static get arbitorage(){ return Logs.out( 'arbitorage' ) }

  static trace( log ){
    logs.all.trace( log );
  }

  static debug( log ){
    logs.all.debug( log );
  }

  static info( log ){
    logs.all.info( log );
  }

  static warn( log ){
    logs.all.warn( log );
  }

  static error( log ){
    logs.all.error( log );
  }

  static fatal( log ){
    logs.all.fatal( log );
  }
}
