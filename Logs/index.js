export default class Logs{

  static strong( v ){
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log( v );
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  }

  static assert( v ){
    console.assert(v);
  }

  static count( v ){
    console.count(v);
  }

  static debug( v ){
    console.debug(v);
  }

  static dir( v ){
    console.dir(v);
  }

  static dirxml( v ){
    console.dirxml(v);
  }

  static error( v ){
    console.error(v);
  }

  static group( v ){
    console.group(v);
  }

  static groupCollapsed( v ){
    console.groupCollapsed(v);
  }

  static groupEnd( v ){
    console.groupEnd(v);
  }

  static info( v ){
    console.info(v);
  }

  static log( v ){
    console.log(v);
  }

  static markTimeline( v ){
    console.markTimeline(v);
  }

  static profile( v ){
    console.profile(v);
  }

  static profileEnd( v ){
    console.profileEnd(v);
  }

  static time( v ){
    console.time(t);
  }

  static timeEnd( v ){
    console.timeEnd(t);
  }

  static timeStamp( v ){
    console.timeStamp(t);
  }

  static trace( v ){
    console.trace(t);
  }

  static warn( v ){
    console.warn(t);
  }
}
