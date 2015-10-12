/**
 * Created by liangkuaisheng on 15/10/10.
 */

'use strict';

var path = require('path');

/*
* 获取配置文件相对路径
* */
function getRelativePath (root, leaf) {
    var arr = leaf.split(root)[1].split('/'),
        pathArr = [];
    for (var i = 0; i < arr.length-1; i++) {
        pathArr.push('..');
    }
    return pathArr.join('/');
}
function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

/*
* 暴露模块
* */
function config () {

    var defaultFilename = 'dev',
        defaultFiletype = 'json',
        defaultConfigPath = 'config';
    /*
    * 默认参数
    * */
    this.opt = {
        readRuntime: true,
        filename: defaultFilename,
        fileType: defaultFiletype,
        configPath: defaultConfigPath
    };

    var rootPath = process.cwd(),
        leafPath = __dirname,
        configEnv = process.env.NODE_ENV || defaultFilename;
    this.__params = {
        absoluteFilePath: path.join(rootPath, defaultConfigPath, configEnv + '.' + defaultFiletype),
        configEnv: configEnv
    };

    /*
    * 初始化默认参数，可以不执行
    * */
    this.init = function (opt) {
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                this.opt[key] = opt[key];
            }
        }
        this.__params.configEnv = process.env.NODE_ENV || this.opt.filename || defaultFilename;
        this.__params.absoluteFilePath = path.join(rootPath, this.opt.configPath, this.__params.configEnv + '.' + this.opt.fileType);
    };

    /*
    * 获取数据，key为undefined，null，‘’时返回所有数据
    * key可以为 'aaa.bbb.ccc' 形式
    * filepath 为配置文件相对根目录路径，若不填则为环境变量配置相关配置文件
    * readRuntime 为 是否实时读取配置文件信息，若为undefined，null，‘’则使用config初始化数据opt.readRuntime
    * */
    this.get = function (key, filepath, readRuntime) {
        if (typeof filepath === 'undefined' || filepath === null || filepath === '') {
            filepath = this.__params.absoluteFilePath;
        }else{
            filepath = path.join(rootPath, filepath);
        }
        if (typeof readRuntime === 'undefined' || readRuntime === null || readRuntime === '') {
            readRuntime = this.opt.readRuntime;
        }
        if (readRuntime && require.cache[filepath]) {
            delete require.cache[filepath];
        }
        var configVal = require(filepath);
        if (typeof key === 'undefined' || key === null || key === '') {
            return configVal;
        }
        var keyArr = key.split('.');
        var obj = configVal;
        var len = keyArr.length;
        for (var i = 0; i < len; i++) {
            obj = obj[keyArr[i]];
            if ((i < len - 1) && !isObject(obj)) {
                return undefined;
            }
        }
        return obj;
    }

}
config.instance = null;
config.getInstance = function(){
    if(this.instance === null){
        this.instance = new config();
    }
    return this.instance;
};

module.exports = config.getInstance();