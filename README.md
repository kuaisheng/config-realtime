## config-realtime

`
    var configRuntime = require('config-realtime');
    var obj = configRuntime.get();
    var name = configRuntime.get('name');
    var vvv = configRuntime.get('sss.vvv');
    var ssss = configRuntime.get('', './package.json', true);
`