var _log4js = undefined;
var _ = require('underscore');

function who(module) {
  var path = require('path');
  return path.basename(module.filename, '.js');
}

var defaultLogConf = {
  'appenders': [
    { 'type': 'console',
      'layout': {
        'type': 'pattern',
        'pattern': '%[%r %p %c -%] %m'
      }
    }
  ],
  'replaceConsole': true
};

var defaultTestLogConf = {
  'appenders': [
    {
      'type': 'file',
      'layout': {
        'type': 'pattern',
        'pattern': '[%r %p %c] %m'
      },
      'filename': 'log/run.log',
      'maxLogSize': 1048576,
      'backups': 10
    }
  ],
  'replaceConsole': false
};

exports.get = function(module) {
  if (_log4js == undefined) {
    _log4js = require('log4js');
    if (require('fs').existsSync('./etc/test')) {
      // test mode, load test log conf, and keep silent
      _log4js.configure(defaultTestLogConf);
      // and set a flag
      require('./test').testMode = true;
    } else {
      if (require('fs').existsSync('./etc/log.json')) {
        _log4js.configure('./etc/log.json');
      } else {
        // load default log conf
        _log4js.configure(defaultLogConf);
      }
      console.log('log4js loaded, logging started.');
    }
  }
  if (_.isString(module)) {
    return _log4js.getLogger(module);
  } else {
    return _log4js.getLogger(who(module));
  }
};

