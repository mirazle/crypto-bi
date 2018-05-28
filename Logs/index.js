import log4js from 'log4js';
log4js.configure('Logs/log4js_config.json', { reloadSecs: 10 });

const logs = {
  all: log4js.getLogger('all'),
  response: log4js.getLogger('response'),
  arbitorage: log4js.getLogger('arbitorage')
}

export default class Logs{

  static out ( type ){
    return {
      trace: ( log, params = '' ) =>  {
        Logs.trace( log, params );
        logs[ type ].trace( log, params );
      },
      debug: ( log, params = ''  ) => {
        Logs.trace( log, params );
        logs[ type ].debug( log, params );
      },
      info: ( log, params = ''  ) => {
        Logs.trace( log, params );
        logs[ type ].info( log, params );
      },
      warn: ( log, params = ''  ) => {
        Logs.trace( log, params );
        logs[ type ].warn( log, params );
      },
      error: ( log, params = ''  ) =>  {
        Logs.trace( log, params );
        logs[ type ].error( log, params );
      },
      fatal: ( log, params = ''  ) =>  {
        Logs.trace( log, params );
        logs[ type ].fatal( log, params );
      }
    }
  }

  static get response(){ return Logs.out( 'response' ) }
  static get arbitorage(){ return Logs.out( 'arbitorage' ) }

  static trace( log, params = ''  ){
    logs.all.trace( log, params );
  }

  static debug( log, params = '' ){
    logs.all.debug( log, params );
  }

  static info( log, params = ''  ){
    logs.all.info( log, params );
  }

  static warn( log, params = ''  ){
    logs.all.warn( log, params );
  }

  static error( log, params = ''  ){
    logs.all.error( log, params );
  }

  static fatal( log, params = ''  ){
    logs.all.fatal( log, params );
  }
}
