import log4js from 'log4js';
log4js.configure('conf/log4js.json', { reloadSecs: 10 });

const logs = {
  all: log4js.getLogger('all'),
  response: log4js.getLogger('response'),
  searchArbitorage: log4js.getLogger('searchArbitorage'),
  arbitorage: log4js.getLogger('arbitorage')
}

export default class Logs{

  static get response(){ return Logs.out( 'response' ) }
  static get searchArbitorage(){ return Logs.out( 'searchArbitorage' ) }
  static get arbitorage(){ return Logs.out( 'arbitorage' ) }

  static out ( type ){
    return {
      trace: ( log  ) =>  {
        logs[ type ].trace( log );
      },
      debug: ( log ) => {
        logs[ type ].debug( log );
      },
      info: ( log ) => {
        logs[ type ].info( log );
      },
      warn: ( log  ) => {
        logs[ type ].warn( log );
      },
      error: ( log ) =>  {
        logs[ type ].error( log );
      },
      fatal: ( log  ) =>  {
        logs[ type ].fatal( log );
      }
    }
  }
}
