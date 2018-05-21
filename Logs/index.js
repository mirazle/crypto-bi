export default class Logs{


  static out( log, type = 'log'){
    Logs.exe( type, log );
  }

  static exe( type, log ){

    switch( type ){
    case 'log':
      console.log( log );
      break;
    case 'warn':
      console.log( log );
      break;
    case 'strong':
      console.log( "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
      console.log( "@ " + log );
      console.log( "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
      break;
    }
  }
}
