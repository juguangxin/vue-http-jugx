import wsPlugin from './websocket'
import {socketConfig} from './websocket'
import ajaxPlugin from './ajax'
import {AJAXCONF} from './ajax'
// import _vue_ from 'vue'
var JugxPlugin = {}
JugxPlugin.config = {}

var ajaxBody={
    send:function(config,scope) {
        // 逻辑...
        return new ajaxPlugin.xmlHttpRequest(scope).send(config);
    },
    interceptors:{
        setRequest:function(fn){
            AJAXCONF.requestInterceptor=fn;
        },
        setResponse:function(fn){
            AJAXCONF.responseInterceptor=fn;
        }
    },
    config:{
        get baseUrl(){
            return AJAXCONF.baseUrl;
        },
        set baseUrl(value){
            AJAXCONF.baseUrl=value;
        },
        get mockMode(){
            return AJAXCONF.mockMode;
        },
        set mockMode(value){
            AJAXCONF.mockMode=value;
        },
        get default(){
            return AJAXCONF.userDefaultConfig;
        },
        set default(value){
            AJAXCONF.userDefaultConfig=value;
        },
        set successStatus(fn){
            AJAXCONF.successStatus=fn;
            console.log(AJAXCONF.successStatus(300))
        }
    },
    addMock:function(){
        if(arguments.length==2){
            AJAXCONF.mockCache[arguments[0]]=arguments[1];
        }
        else if(arguments.length==1){
            for(var key in arguments[0]){
                AJAXCONF.mockCache[key]=arguments[0][key];
            }
        }
        
    }
}
var wsBody={
    listen:function(option,sc){
        return new wsPlugin(sc).listen(option);
    },
    send:function(){
        if(!arguments.length || !arguments[0]) return null;
        if(arguments.length==3){
            if(typeof arguments[1]==="string"){
                return new wsPlugin(arguments[2]).send({url:arguments[1],data:arguments[0]});
            }
            else{
                var option=arguments[1]
                option.data=arguments[0]
                return new wsPlugin(arguments[2]).send(option);
            }
        }
        else if(arguments.length==2){
            if(typeof arguments[1]==="string"){
                var option={
                    data:arguments[0],
                    url:arguments[1]
                }
                return new wsPlugin(this).send(option);
            }
            else{
                var option=arguments[1]
                option.data=arguments[0]
                return new wsPlugin(this).send(option);
            }
        }
        else if(arguments.length==1){
            if(typeof arguments[0]==="string"){
                var option={
                    data:arguments[0],
                }
                return new wsPlugin(this).send(option);
            }
            else{
                return new wsPlugin(this).send(arguments[0]);
            }
        }
        
    },
    config:{
        get baseUrl(){
            return socketConfig.baseUrl;
        },
        set baseUrl(value){
            socketConfig.baseUrl=value;
        },
        get reconnectTimeout(){
            return socketConfig.timeout;
        },
        set reconnectTimeout(value){
            socketConfig.timeout=value;
        }
    }
};
JugxPlugin.install = function(Vue, options={}) {
    /**
     * author:Jugx
     * date:2018/11/06
     */
    AJAXCONF.instanceName=options.instanceName || AJAXCONF.instanceName;
    AJAXCONF.mockInstanceName=options.mockInstanceName || AJAXCONF.mockInstanceName;
    AJAXCONF.wsInstanceName=options.wsInstanceName || AJAXCONF.wsInstanceName;
    AJAXCONF.VueGlobalInstanceName=AJAXCONF.instanceName.replace(/\$/g,'');//全局替换
    AJAXCONF.WSGlobalInstanceName=AJAXCONF.wsInstanceName.replace(/\$/g,'');//全局替换
    AJAXCONF.successFormatCallback=options.successFormat || options.resultFormat || AJAXCONF.successFormatCallback;//返回数据的格式化
    AJAXCONF.errorFormatCallback=options.errorFormat || options.resultFormat || AJAXCONF.errorFormatCallback;
    AJAXCONF.userDefaultConfig=Object.assign({},options.defaultConfig || {},AJAXCONF.userDefaultConfig);
    
    Vue[AJAXCONF.VueGlobalInstanceName]=Vue.prototype[AJAXCONF.instanceName]=ajaxBody
    
    Vue[AJAXCONF.VueGlobalInstanceName+"Success"] = function(data, message) {
        return AJAXCONF.successFormatCallback.call(this,arguments);
    }
    Vue[AJAXCONF.VueGlobalInstanceName+"Error"] = function(message) {
        return AJAXCONF.errorFormatCallback.call(this,arguments);
    }

    Vue[AJAXCONF.WSGlobalInstanceName]= Vue.prototype[AJAXCONF.wsInstanceName]=wsBody
}
JugxPlugin[AJAXCONF.VueGlobalInstanceName]=ajaxBody;
JugxPlugin[AJAXCONF.WSGlobalInstanceName]=wsBody;

// _vue_[AJAXCONF.VueGlobalInstanceName]=_vue_.prototype[AJAXCONF.instanceName]=ajaxBody;
// _vue_[AJAXCONF.WSGlobalInstanceName]=_vue_.prototype[AJAXCONF.wsInstanceName]=wsBody;
export default JugxPlugin;


            // if (opt.timeout) {
            //     var timeoutRequest = new Promise(function(resolve, reject) {
            //         setTimeout(function() {
            //             if (!request._complete) {
            //                 request.abort();
            //                 reject(["timeout-" + opt.timeout, request]);
            //             }
            //             // setTimeout(function() {
            //             //     request.abort();
            //             // }, 0)
            //             // reject(["timeout-" + opt.timeout, request]);
            //         }, opt.timeout)
            //     });
            //     return Promise.race([currentRequest, timeoutRequest]);
            // }