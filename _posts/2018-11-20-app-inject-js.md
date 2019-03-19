---
layout: post
title: app注入javascript实现webview资源表单数据获取与填充
author: beyondouyuan
date: 2018-11-20
categories: blog
tags: [JavaScript]
javascript: javascript
description: 汴水流，泗水流，流到瓜州古渡头。吴山点点愁。
---

## 写在前面

在app中嵌入h5页面在webview中，若h5是第三方的页面，此时有机会获取或者填充数据到h5页面中，app可以实现，但是当页面较多时，可以通过在viewview中注入js来实现


## 需求


公司与银行合作，在app中注入银行信用卡申请页面，老板灵机一动，脑中灵光一闪，想到，如果，我们在用户进入申请页面时，利用我们掌握的数据，可以让用户少输入内容，同时在用户提交申请的时候保存用户的信息，等到用户在其他银行页面申请时也可以利用之前保存掌握的数据自动填充，这样的话可以极大提供用户体验，让更多用户使用我门的产品？好！技术来解决这个问题，这个需求很重要！！！


## 开干

需求不复杂，无非是app引用前端写好的js，然后调用js中暴露的方法去执行即可实现需求，这是app需要做的事情，

至于前端写的javascript部分，无非是去遍历dom中的表单，初始化时遍历操作表单对应项填充数据到webview的表单中，在用户点击提交按钮时，保存数据并发送到自己服务器即可。


说简单也很简单，说麻烦嘛，就是需要用户去看这每一个银行的申请页面的dom结构，做对应处理，因为每一个银行的页面，以及需要填充保存的数据都不一样，所以，很多时候除了公用方法，无法进行大量的抽象封装，只能一个一个银行的去写


## 设计

ES5写javascript实在不友好，还是选择ES6来写，之后打包输出。


webpack构建多入口项目，分别打包各个处理银行的js文件。

webpack多入口主要大致如下：

```javascript

const path = require('path')
const glob = require('glob')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const rootPath = path.resolve(__dirname, '../')
const getEntry = function(globPath) {
    let entries = {};
    glob.sync(globPath).forEach(function(entry) {
        var pathname = entry.split('/').splice(-1).join('/').split('.')[0]
        if (pathname === 'common' || pathname === 'utils' || pathname === 'test') return // common 为共用工具模块 不进行打包
        entries[pathname] = entry
    });
    return entries
};
const entries = getEntry('./src/*/*.js')

const config = {
    mode: 'production',
    entry: {
        ...entries
    },
    output: {
        path: path.resolve(rootPath, 'bundle'),
        filename: '[name]-bundle.js',
        chunkFilename: '[name]-bundle.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: "babel-loader",
            // options: {
            //     presets: [
            //         "env",
            //         "stage-0",
            //         "stage-2",
            //         "stage-3"
            //     ]
            // }
        }]
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        },
        minimize: true,
        sideEffects: false,
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                warnings: false,
                parse: {},
                compress: {},
                mangle: true, // Note `mangle.properties` is `false` by default.
                output: null,
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_fnames: false,
            }
        })]

    }
}
module.exports = config
```

common目录作为公用的一些dom操作的工具库，不做打包处理，其他文件统一打包输出的文件名为xxx-bundle.js yyy-bundle.js

不开启hash是考虑到app注入时候的方便


## 核心代码

考虑到输出的js是注入到别人的页面中，为了避免变量名函数吗等冲突，将核心代码都放在一个类里形成自己的命名空间比较保险

```javascript

/*
 * @Author: beyondouyuan
 * @Date:   2018-10-23 17:19:11
 * @Last Modified by:   liyuan
 * @Last Modified time: 2019-01-21 17:25:57
 */

/**
 * 待优化项  Tree-shaking
 */

class CBBUTILS {

    constructor() {

    }
    /**
     * [config 默认配置服务器地址 实际运用中由app端传入base_url切换环境]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:12:23+0800
     * @return   {[type]}                 [description]
     */
    static config() {
        return {
            postAPI: 'http:/xxx/api/saveUserInfo.do',
            getAPI: 'http:/xxx/api/getUserInfo.do'
        }
    }
    /**
     * [$ id选择器简单封装 目前没有对class attr name 和tag的封装，后续可优化]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:14:17+0800
     * @param    {[type]}                 target [description]
     * @return   {[type]}                        [description]
     */
    static $(target) {
        try {
            return document.getElementById(target)
        } catch (e) {
            console.log(e)
        }
    }
    static hasClass(target, name) {
        try {
            return target.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'))
        } catch (e) {
            console.log(e)
        }
    }
    static addClass(target, name) {
        try {
            if (!this.hasClass(target, name)) target.className += " " + name
        } catch (e) {
            console.log(e)
        }
    }
    static removeClass(target, name) {
        try {
            if (this.hasClass(target, name)) {
                const reg = new RegExp('(\\s|^)' + name + '(\\s|$)')
                target.className = target.className.replace(reg, '')
            }
        } catch (e) {
            console.log(e)
        }
    }
    static getStorage(k) {
        try {
            return window.localStorage && JSON.parse(window.localStorage.getItem(k))
        } catch (e) {
            console.log(e)
        }
    }
    static setStorage(k, v) {
        try {
            return window.localStorage && window.localStorage.setItem(k, JSON.stringify(v))
        } catch (e) {
            console.log(e)
        }
    }
    static removeStorage(k) {
        try {
            return window.localStorage && window.localStorage.removeItem(k)
        } catch (e) {
            console.log(e)
        }
    }
    static siblings(target) {
        try {
            const chid = target.parentNode.children,
                targetMatch = [];
            for (let i = 0, len = chid.length; i < len; i++) {
                if (chid[i] != target) {
                    targetMatch.push(chid[i])
                }
            }
            return targetMatch
        } catch (e) {
            console.log(e)
        }

    }
    static html(target) {
        try {
            if (arguments.length === 1) {
                return this.$(target).innerHTML;
            } else if (arguments.length === 2) {
                this.$(target).innerHTML = arguments[1];
            }
        } catch (e) {
            console.log(e)
        }
    }
    static formsParams(data) {
        let arr = [];
        for (let prop in data) {
            arr.push(prop + "=" + data[prop])
        }
        return arr.join("&")
    }
    /**
     * [$ajax ajax封装]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:17:33+0800
     * @param    {[type]}                 config [description]
     * @return   {[type]}                        [description]
     */
    static $ajax(config) {
        const option = {
            type: 'POST',
            url: '',
            async: true,
            data: null,
            success: function() {},
            error: function() {},
            complete: function() {}
        }
        Object.assign(option, config)
        let xmlHttp = null
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest()
        } else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
        }
        const postData = this.formsParams(option.data)
        if (option.type.toUpperCase() === 'POST') {
            xmlHttp.open(option.type, option.url, option.async)
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xmlHttp.send(postData)

        } else if (option.type.toUpperCase() === 'GET') {
            xmlHttp.open(option.type, option.url + '?' + postData, option.async)
            xmlHttp.send(null)
        }
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4) {
                const status = xmlHttp.status
                // 请求成功
                if (status === 200 /* >= 200 && status < 300 */ ) {
                    option.success(JSON.parse(xmlHttp.responseText), JSON.parse(xmlHttp.responseXML))
                } else {
                    option.error(status)
                }
                option.complete(JSON.parse(xmlHttp.responseText))
            } else {
                option.error(xmlHttp)
            }
        }
    }
    /**
     * [handleGetter 获取input输入框值 开发前没注意银行页面诡异多变，默认均以id做标注，但有些银行会用class或者name做标注，后期可作优化封装]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:17:57+0800
     * @param    {[type]}                 target [description]
     * @return   {[type]}                        [description]
     */
    static handleGetter(target) {
        try {
            return this.$(target).value
        } catch (e) {
            console.log(e)
        }

    }
    /**
     * [handleSetter 设置input框值 同理 传入的是id]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:19:48+0800
     * @param    {[type]}                 target [description]
     * @param    {[type]}                 val    [description]
     * @return   {[type]}                        [description]
     */
    static handleSetter(target, val) {
        if (this.handleGetter(target)) return
        if (!val || val == 'undefined') return
        try {
            this.$(target).value = val
            // 手动触发blur事件
            this.$dispatchEvent(target, 'blur')
        } catch (e) {
            console.log(e)
        }
    }
    static handleGetterByName(target, val) {
        try {
            return document.getElementsByName(target)[0].value
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * [handleAddEvent 事件监听器]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:20:19+0800
     * @param    {[type]}                 target  [绑定元素]
     * @param    {[type]}                 type    [事件类型]
     * @param    {[type]}                 handler [回调函数]
     * @param    {Boolean}                bubbles [是否冒泡]
     * @return   {[type]}                         [description]
     */
    static handleAddEvent(target, type, handler, bubbles = false) {
        try {
            if (target.addEventListener) {
                target.addEventListener(type, handler, bubbles)
            } else if (target.attachEvent) {
                target.attachEvent("on" + type, handler)
            } else {
                target["on" + type] = handler
            }
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * [handlePropsGetter 获取input属性值]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:21:19+0800
     * @param    {[type]}                 target [description]
     * @param    {[type]}                 props  [description]
     * @return   {[type]}                        [description]
     */
    static handlePropsGetter(target, props) {
        try {
            return this.$(target).getAttribute(props)
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * [handleSelectedGetter 获取select选中对象，返回一个对象 包括选中元素的下标、值、以及文本]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:22:08+0800
     * @param    {[type]}                 target [description]
     * @return   {[type]}                        [description]
     */
    static handleSelectedGetter(target) {
        try {
            const ele = this.$(target) ? this.$(target) : document.getElementsByName(target)[0] ? document.getElementsByName(target)[0] : document.querySelector(target)
            const selectedIndex = ele.selectedIndex
            const selectedVal = ele.options[selectedIndex].value
            const selectedText = ele.options[selectedIndex].innerHTML

            return {
                selectedIndex: selectedIndex,
                selectedVal: selectedVal,
                selectedText: selectedText
            }
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * [handleSelectedSetterByValue 设置select选中状态]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:23:06+0800
     * @param    {[type]}                 target [description]
     * @param    {[type]}                 value  [description]
     * @return   {[type]}                        [description]
     */
    static handleSelectedSetterByValue(target, value) {
        try {
            if (value == 'undefined' || value == undefined) return
            const select = this.$(target) ? this.$(target) : document.getElementsByName(target)[0] ? document.getElementsByName(target)[0] : document.querySelector(target)
            const self = this
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value == value) {
                    select.options[i].selected = true;
                    select.value = value
                    self.$dispatchEvent(target, 'change')
                    break;
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * [$dispatchEvent 模拟事件触发，一般而言，设置input框都需要再次触发blur或者change事件，这主要是为了针对银行在输入中文名字后触发失焦事件自动获取姓名拼音而定制]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2019-01-21
     * @modified 2019-01-21T17:23:25+0800
     * @param    {[type]}                 target [所在元素]
     * @param    {[type]}                 type   [事件类型]
     * @return   {[type]}                        [description]
     */
    static $dispatchEvent(target, type) {
        try {
            const ele = this.$(target) ? this.$(target) : document.getElementsByName(target)[0];
            const event = document.createEvent('events')
            event.initEvent(type, true, true)
            event.eventType = 'message'
            ele.dispatchEvent(event)
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * [$requestMsg 前端向app通知请求状态]
     * awesome method! 没时间解释了，快上车！
     * @author handsome Ou Yuan
     * @version  [version]
     * @date     2018-12-03
     * @modified 2018-12-03T11:19:19+0800
     * @param    {[type]}                 msg  [description]
     * @param    {[type]}                 code [description]
     * @return   {[type]}                      [description]
     */
    static $requestMsg(params) {
        const system = this.getAppSystem()
        const {
            msg,
            code
        } = params
        if (system.value === 1) {
            //ios
            try {
                window.webkit.messageHandlers.handleRequstMsg.postMessage(`{"msg": "${msg}", "code": "${code}"}`)
            } catch (err) {
                console.log(err)
            }
        }
        if (system.value === 2) {
            //android
            try {
                window.nf.handleRequstMsg(`{"msg": "${msg}", "code": "${code}"}`)
            } catch (err) {
                console.log(err)
            }
        }

    }
    static getAppSystem() {
        const ua = navigator.userAgent
        if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
            return {
                value: 2,
                text: 'android'
            }
        } else if (ua.indexOf('iPhone') > -1) {
            return {
                value: 1,
                text: 'iOS'
            }
        } else if (ua.indexOf('Windows Phone') > -1) {
            return {
                value: 3,
                text: 'other'
            }
        }
    }
}

export {
    CBBUTILS
}
```


核心代码只封装了常用的dom操作以及ajx交互封装，同时包含了一些事件处理的封装，主要用于填充数据时去模拟一些事件的处罚，比如input框select框的onchange事件模拟出发，在一些银行中，input框onchange事件会做一些处理，所以我们应该考虑在某些输入框注入数据时，不影响银行本身的交互逻辑，需要手动模拟触发事件，这一部分当然不可能让用户去点击啦，所以需要js去触发。


由于开始着手实现核心代码时，只看了三家银行的页面，每一家银行的input select button等都带有id，所以$的封装的并不周全，后来发现一些银行使用了vue和react等前端框架，那么id钩子没有了，就需要补充操作dom的方式，此时不可能更改太多，所以也就没有大改，只做了一部分的补救。当然刚刚写完就想要重构了，毕竟可优化的点以及设计方式的思考还是很多的，但是为了进度，只能委屈代码了。


将方法都写成静态方法的原因是，我不想调用时候new一次


## 调用示例

```javascript
/*
 * @Author: beyondouyuan
 * @version: 工行升级vue版本...
 * @Date:   2018-11-20 11:11:29
 * @Last Modified by:   liyuan
 * @Last Modified time: 2018-12-04 17:30:59
 */


import {
    CBBUTILS
} from '../common/common'

const {
    postAPI,
    getAPI
} = CBBUTILS.config()

const requestMsg = {
    msg: '成功',
    code: '1'
}

const EDULIST = {
    doctor: {
        val: 1,
        text: '博士及以上'
    },
    master: {
        val: 2,
        text: '硕士'
    },
    regular: {
        val: 3,
        text: '本科'
    },
    college: {
        val: 4,
        text: '专科及以下'
    }
}

let paramsInfo = {}
/**
 * [handlePostData 提交数据，以传入回调的方式清除缓存在客户端的数据]
 * awesome method! 没时间解释了，快上车！
 * @author handsome Ou Yuan
 * @version  [version]
 * @date     2018-11-10
 * @modified 2018-11-10T16:50:33+0800
 * @param    {[type]}                 data [description]
 * @param    {Function}               cb   [description]
 * @return   {[type]}                      [description]
 */
function handlePostData(data, cb) {
    CBBUTILS.$ajax({
        type: 'POST',
        url: postAPI,
        async: true,
        data: data,
        success: function(res) {
            cb && cb(...arguments)
        },
        error: function(err) {},
        complete: function(res) {}
    })
}


/**
 * [handleFetchData 拉取数据]
 * awesome method! 没时间解释了，快上车！
 * @author handsome Ou Yuan
 * @version  [version]
 * @date     2018-11-10
 * @modified 2018-11-10T16:51:25+0800
 * @param    {[type]}                 data [description]
 * @return   {[type]}                      [description]
 */
function handleFetchData(data) {
    CBBUTILS.$ajax({
        type: 'GET',
        async: true,
        url: getAPI,
        data: data,
        success: function(res) {
            const {
                msg,
                code,
                data
            } = res
            if (msg == requestMsg.msg && code == requestMsg.code) {
                handleSetFormDefaultValue(data)
                window.handleRequstMsg({
                    "msg": "数据请求成功",
                    "code": "200"
                })
            }
        },
        error: function(err) {
            window.handleRequstMsg({
                "msg": "数据请求失败",
                "code": "400"
            })
        },
        complete: function(res) {}
    })
}

function $dispatchEvent(target, type) {
    try {
        const event = document.createEvent('events')
        event.initEvent(type, true, true)
        event.eventType = 'message'
        target.dispatchEvent(event)
    } catch (e) {
        console.log(e)
    }
}


// 渲染学历文本至页面
function handleEduRender(edu) {
    switch (Number(edu)) {
        case 1:
            return {
                ...EDULIST.doctor
            }
        case 2:
            return {
                ...EDULIST.master
            }
        case 3:
            return {
                ...EDULIST.regular
            }
        case 4:
        case 5:
        case 6:
            return {
                ...EDULIST.college
            }
        default:
            return {
                ...EDULIST.regular
            }
    }
}

// 转换学历值用于保存至服务器
function handleEduTransform(edu) {
    switch (edu) {
        case EDULIST.doctor.text:
            return 1
        case EDULIST.master.text:
            return 2
        case EDULIST.regular.text:
            return 3
        case EDULIST.college.text:
            return 4
        default:
            return 3
    }
}

function handleEduSetter(edu) {
    try {
        const spans = document.querySelector('.button-item.button-item2.button-item3.button-item4').querySelectorAll('span')
        Array.from(spans).map(items => {
            const text = items.innerHTML
            const siblings = CBBUTILS.siblings(items)
            if (text === handleEduRender(edu).text) {
                CBBUTILS.addClass(items, 'active')
                Array.from(siblings).map(item => {
                    CBBUTILS.removeClass(item, 'active')
                })
            }
        })
    } catch (e) {
        console.log(e)
    }
}

/**
 * [handleSetFormDefaultValue 填充表单]
 * awesome method! 没时间解释了，快上车！
 * @author handsome Ou Yuan
 * @version  [version]
 * @date     2018-11-10
 * @modified 2018-11-10T16:51:44+0800
 * @param    {[type]}                 result [description]
 * @return   {[type]}                        [description]
 */
function handleSetFormDefaultValue(result) {
    const {
        onekey_name,
        onekey_idcard,
        onekey_mobile,
        onekey_edu
    } = result
    try {
        onekey_edu && handleEduSetter(onekey_edu)
        onekey_edu && CBBUTILS.setStorage('onekey_edu', onekey_edu)
        const wrapper = document.getElementsByClassName('wrapper')
        return Array.from(wrapper).map(item => {
            // .wrapper下第一个label元素
            const label = item.querySelector('label')
            // .wrapper下第一个.input元素
            const inputBox = item.querySelector('.input')
            // .input下第一个input元素
            const input = inputBox.querySelector('input')
            if (label.innerHTML.includes('姓名')) {
                handleInputValSetter(input, onekey_name)
            }
            if (label.innerHTML.includes('身份证号')) {
                handleInputValSetter(input, onekey_idcard)
            }
            if (label.innerHTML.includes('手机号')) {
                handleInputValSetter(input, onekey_mobile)
            }
        })
    } catch (e) {
        console.log(e);
    }

}

function handleInputValSetter(target, val) {
    if (!val || val == 'undefined') return
    target.value = val
    $dispatchEvent(target, 'blur')
    $dispatchEvent(target, 'input')
}

/**
 * [handleFirstStepDataStore 存储表单第一步填写的数据]
 * awesome method! 没时间解释了，快上车！
 * @author handsome Ou Yuan
 * @version  [version]
 * @date     2018-11-10
 * @modified 2018-11-10T16:49:46+0800
 * @return   {[type]}                 [description]
 */
function handleFirstStepDataStore() {
    const data = {}
    const wrapper = document.getElementsByClassName('wrapper')
    Array.from(wrapper).map(item => {
        const label = item.querySelector('label')
        const inputBox = item.querySelector('.input')
        const input = inputBox.querySelector('input')
        if (label.innerHTML.includes('姓名')) {
            data.onekey_name = handleInputValGetter(input)
        }
        if (label.innerHTML.includes('身份证号')) {
            data.onekey_idcard = handleInputValGetter(input)
        }
        if (label.innerHTML.includes('手机号')) {
            data.onekey_mobile = handleInputValGetter(input)
        }
    })

    CBBUTILS.setStorage('gongshang-step1', data)
}


function handleInputValGetter(target) {
    return target.value
}


function handleAddressJoint(address) {
    const provinceIndex = address.indexOf('省')
    const province = address.substring(0, provinceIndex + 1)
    const cityIndex = address.indexOf('市')
    const city = address.substring(provinceIndex + 1, cityIndex + 1)
    const area = address.substring(cityIndex + 1)

    return `${province}-${city}-${area ? area : ''}`
}



function handleTelJoint(tel) {
    return `${(tel[0] && tel[0].value) ? tel[0].value : '0'}-${(tel[1] && tel[1].value) ? tel[1].value : '0'}-${(tel[2] && tel[2].value) ? tel[2].value : '0'}`
}

/**
 * [handleFirstCardSubmitForm 获取第一步存储在客户端的数据进行统一提交]
 * awesome method! 没时间解释了，快上车！
 * @author handsome Ou Yuan
 * @version  [version]
 * @date     2018-11-10
 * @modified 2018-11-10T16:49:57+0800
 * @return   {[type]}                 [description]
 */
function handleFirstCardSubmitForm() {
    const firstStepData = CBBUTILS.getStorage('gongshang-step1')
    const companyTelSpan = document.querySelector('.three-phone').querySelectorAll('input')

    const onekey_idcard_date = document.querySelector('.button-item.button-item2').querySelector('.active')
    const onekey_married_status = document.querySelector('.button-item.button-item3').querySelector('.active')
    const onekey_edu = document.querySelector('.button-item.button-item2.button-item3.button-item4').querySelector('.active')
    const onekey_home_type = document.querySelectorAll('.button-item.button-item2.button-item3.button-item4')[1].querySelector('.active')
    const onekey_home_address = document.querySelector('.select-city').querySelector('.content').querySelector('.active')
    const onekey_home_address_detail = document.querySelector('.select-city').querySelector('.detail').querySelector('input')
    const onekey_company_position_type = document.querySelectorAll('.button-item.button-item3')[3].querySelector('.active')
    const onekey_company_kind = document.querySelectorAll('.button-item.button-item3')[4].querySelector('.active')
    const onekey_company_position = document.querySelectorAll('.button-item.button-item3')[5].querySelector('.active')
    const onekey_company_name = document.querySelectorAll('.containerDefault')[2].querySelector('.inputDefault')
    const onekey_company_address = document.querySelectorAll('.select-city')[1].querySelector('.content').querySelector('.active')
    const onekey_company_address_detail = document.querySelectorAll('.select-city')[1].querySelector('.detail').querySelector('input')
    const onekey_company_tel = handleTelJoint(companyTelSpan)
    const onekey_income = document.querySelectorAll('.containerDefault')[3].querySelector('.inputDefault')
    const onekey_relation_name = document.querySelectorAll('.containerDefault')[4].querySelector('.inputDefault')
    const onekey_relation_mobile = document.querySelectorAll('.containerDefault')[5].querySelector('.inputDefault')
    const onekey_relation = document.querySelectorAll('.button-item.button-item2.button-item3')[2].querySelector('.active')
    const onekey_send_card_address = document.querySelectorAll('.button-item.button-item2')[4].querySelector('.active')
    const relationData = {
        onekey_married_status: onekey_married_status ? onekey_married_status.innerHTML : '',
        onekey_edu: onekey_edu ? handleEduTransform(onekey_edu.innerHTML) : 7,
        onekey_home_type: onekey_home_type ? onekey_home_type.innerHTML : '',
        onekey_home_address: onekey_home_address ? handleAddressJoint(onekey_home_address.innerHTML) : '',
        onekey_home_address_detail: onekey_home_address_detail ? onekey_home_address_detail.value : '',
        onekey_company_position_type: onekey_company_position_type ? onekey_company_position_type.innerHTML : '',
        onekey_company_kind: onekey_company_kind ? onekey_company_kind.innerHTML : '',
        onekey_company_position: onekey_company_position ? onekey_company_position.innerHTML : '',
        onekey_company_name: onekey_company_name ? onekey_company_name.value : '',
        onekey_company_address: onekey_company_address ? handleAddressJoint(onekey_company_address.innerHTML) : '',
        onekey_company_address_detail: onekey_company_address_detail ? onekey_company_address_detail.value : '',
        onekey_company_tel,
        onekey_income: onekey_income ? onekey_income.value : '',
        onekey_relation_name: onekey_relation_name ? onekey_relation_name.value : '',
        onekey_relation_mobile: onekey_relation_mobile ? onekey_relation_mobile.value : '',
        onekey_relation: onekey_relation ? onekey_relation.innerHTML : '',
        onekey_send_card_address: onekey_send_card_address ? onekey_send_card_address.innerHTML : '',
        onekey_idcard_date: onekey_idcard_date ? onekey_idcard_date.innerHTML : ''
    }
    // 合并提交参数
    const data = {
        ...paramsInfo,
        ...firstStepData,
        onekey_edu: relationData.onekey_edu,
        first_card_status: 1,
        user_info: JSON.stringify({
            ...firstStepData,
            ...relationData
        })
    }
    /**
     * 提交数据之后台并清除客户端所存储的第一步的数据
     */
    handlePostData(data, CBBUTILS.removeStorage('gongshang-step1'))
}

function getLastDomNode(eles) {
    return Array.from(eles).filter(item => item.nodeType === 1)
}

function handleSecondCardSubmitForm() {
    const firstStepData = CBBUTILS.getStorage('gongshang-step1')
    const onekey_edu = CBBUTILS.getStorage('onekey_edu')
    const nodes = getLastDomNode(document.querySelector('.radio-button').childNodes)
    const onekey_send_card_address = nodes[nodes.length - 1].innerHTML
    // 合并提交参数
    const data = {
        ...paramsInfo,
        ...firstStepData,
        onekey_edu,
        first_card_status: 2,
        user_info: JSON.stringify({
            ...firstStepData,
            onekey_send_card_address
        })
    }
    /**
     * 提交数据之后台并清除客户端所存储的第一步的数据
     */
    handlePostData(data, CBBUTILS.removeStorage('gongshang-step1'))
}

/**
 * [btn 监听按钮事件]
 * @type {[type]}
 */


const btn = document.querySelector('.btn-atom')
if (btn.innerHTML == '下一步' && btn.addEventListener) {
    CBBUTILS.handleAddEvent(btn, 'click', handleFirstStepDataStore, false)
}
if (btn.innerHTML == '提交申请' && btn.addEventListener) {
    try {
        const showBox = document.querySelector('.show-info')
        if (showBox) {
            const showMsg = showBox.querySelector('.say-hello').innerHTML
            if (showMsg && showMsg.includes('尊敬的')) {
                CBBUTILS.handleAddEvent(btn, 'click', handleSecondCardSubmitForm, false)
            }
        } else {
            CBBUTILS.handleAddEvent(btn, 'click', handleFirstCardSubmitForm, false)
        }
    } catch (e) {
        console.log(e)
    }

}


/**
 * [handleCBBInit 暴露唯一接口]
 * awesome method! 没时间解释了，快上车！
 * @author handsome Ou Yuan
 * @version  [version]
 * @date     2018-11-10
 * @modified 2018-11-10T16:52:29+0800
 * @param    {[type]}                 condition [description]
 * @return   {[type]}                           [description]
 */
function handleCBBInit(condition) {
    Object.assign(paramsInfo, condition)
    const {
        member_id
    } = condition
    const data = {
        member_id
    }
    handleFetchData(data)
}

window.handleCBBInit = handleCBBInit


function handleRequstMsg(params) {
    CBBUTILS.$requestMsg(params)
}

window.handleRequstMsg = handleRequstMsg
```
app调用类似于此：

```html
<script type="text/javascript" src="../../../bundle/gongshang-bundle.js"></script>
            <script type="text/javascript">
            handleCBBInit({
                member_id: '3708348',
                order_no: '20090622122626'
            })
            </script>
```

handleCBBInit是对外暴露给app调用的唯一方法。
之所以将handleCBBInit挂载在window对象上是因为，若不将handleCBBInit挂载在window上，打包后的js是一个模块，并且经过webpack压缩，handleCBBInit方法是访问不到的，要提供给外部只用只能将其挂在全局的window上，这样app只需要引入这个文件，并执行
```javascript
handleCBBInit({
                member_id: '3708348',
                order_no: '20090622122626'
            })
```
即可


关于js通过webview与app的通信，这里选择了postMessage的方式，当我在田中数据成功后，通知app我的数据已经完成填充，app这时节收到通知，将会关闭webview的loading状态，把填充了数据的页面真正展示给用户，这样做也是为了防止用户在我未填充数据时就在页面上操作，导致后续js填充发生数据错乱的问题


```javascript
function handleFetchData(data) {
    CBBUTILS.$ajax({
        type: 'GET',
        async: true,
        url: getAPI,
        data: data,
        success: function(res) {
            const {
                msg,
                code,
                data
            } = res
            if (msg == requestMsg.msg && code == requestMsg.code) {
                handleSetFormDefaultValue(data)
                // 通知app
                window.handleRequstMsg({
                    "msg": "数据请求成功",
                    "code": "200"
                })
            }
        },
        error: function(err) {
            window.handleRequstMsg({
                "msg": "数据请求失败",
                "code": "400"
            })
        },
        complete: function(res) {}
    })
}
```


就这么简单！！！
