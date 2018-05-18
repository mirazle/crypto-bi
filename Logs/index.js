export default class Logs{


  static out( log, type = 'log'){
    Logs.exe( type, log );
  }

  static exe( type, log ){
    console[ type ]( log );
  }
}
