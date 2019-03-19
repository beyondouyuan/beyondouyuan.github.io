---
layout: post
title: 记录一次工作用使用发布-订阅模式的过程
author: beyondouyuan
date: 2018-12-09
categories: blog
tags: [JavaScript]
javascript: javascript
description: 试问闲愁都几许！一川烟草，满城风絮，梅子黄时雨

---

## 写在前面

设计模式并不属于一个技术范畴，更确确的理解应该是设计模式是一种思维模式

## 本次使用场景

页面A跳转到页面B，页面B是一个中转页，将会不做停留的跳转的外部C页面，在这个过程中，A、B标签都会在页面底部引入一个log.js文件，用于日志上报服务器，这个js文件中需要发起ajax请求，且这个ajax是同步的，同时，这个js文件是nginx动态插入到页面的最后面的。

模型大概如下：

A页面

```html
<body>
    <div>
        ...
    </div>
    <script type="text/javascript"></script>
    <script type="text/javascript" src=".log.js"></script>
</body>
```

B页面

```html
<head>
    <script type="text/javascript">
        window.href='http://www.baidu.com/c'
    </script>
</head>
<body>
    <div>
        ...
    </div>
    <script type="text/javascript"></script>
    <script type="text/javascript" src=".log.js"></script>
</body>
```

logs.js如下

```javascript
function sendLogInfo(data) {
    $.ajax({
        url: path,
        method: 'post',
        type: 'json',
        async: false,
        data: {
            ...data
        },
        success: function(res) {

        },
    })
} 

window.onload = function() {
    sendLogInfo(data)
}
window.onbeforeunload = function() {
    sendLogInfo(data)
}
```

### bug

这样的过程，很显然，无论B页面中的window.href写在哪个位置上都造成无法正确将日志上报，也许我们会想到Event-loop，将B页面的自动跳转放到异步队列中，等待同步代码执行后再跳转，但是，event-loop的模式前提是，他们在同一执行上下文中。
很显然，当进入B页面时，无论window.href="http://www.baidu.com/c" 放在头部，底部，他都是在log.js之前执行的，因为他们在不同的script标签内，script标签作为event-loop的宏任务将会自上而下执行的，所以，简单的setTimeout的方式解决不了这个bug。


### 解决方式

既然如此，那么我们可能就考虑一种方式，那就是当ajax上报服务器完成后再去通知B页面执行跳转代码，也许可以用一个全局flag，但是，普通的前端环境中，全局的变量并不是响应式的，所以，通过设置flag也是不可行的，那么，如何通知呢，

### 发布订阅模式

我们在ajax成功回调中才告诉B页面，我们做好了，B页面收到通知，就会去执行跳转代码，很显然，最适合的方式就是发布订阅模式


### 实现一个订阅发布

```javascript
/**
 * [EmiterEvent 实现一个发布订阅管理器--用于解决中转页面跳转日志缺失问题]
 * awesome method! 没时间解释了，快上车！
 * @author handsome Ou Yuan
 * @version  [version]
 * @date     2019-01-14
 * @modified 2019-01-14T13:40:50+0800
 */
function EmiterEvent() {
    this._event = {}
}
// 订阅
EmiterEvent.prototype.on = function(key, handler) {
    if (!this._event[key]) {
        this._event[key] = []
    }

    this._event[key].push(handler)
}
// 发布
EmiterEvent.prototype.emit = function(key) {
    var events = this._event[key]
    var args = Array.prototype.slice.call(arguments, 1)
    if (!events) {
        return
    }
    events.forEach(event => {
        event.apply(this, args)
    })
}
// 取消
EmiterEvent.prototype.off = function(key, handler) {
    var handlers = this._event[key]
    if (!handlers) {
        return false
    }
    //如果没有回调，表示取消此key下的所有方法
    //如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
    if (!handler) {
        handlers && handlers.length = 0
    } else {
        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i] == handler) {
                // 从函数待用数组中移除订阅
                handlers.splice(i, 1)
            }
        }
    }
}
// 订阅后取消
EmiterEvent.prototype.once = function(key, handler) {
    function handleEmiter() {
        var args = Array.prototype.slice.call(arguments, 0)
        handler.apply(this, args)
        this.off(key, handleEmiter)
    }
    this.on(key, handleEmiter)
}

var emiterEvent = new EmiterEvent()
```

### 改造log.js中的ajax

```javascript
function sendLogInfo(data) {
    $.ajax({
        url: path,
        method: 'post',
        type: 'json',
        async: false,
        data: {
            ...data
        },
        success: function(res) {
            setTimeout(function() {
                // 发布日志发送成功通知
                try {
                    emiterEvent.emit('sendDataSuccess', true)
                } catch(e) {}        
            }, 300)
        },
    })
} 

window.onload = function() {
    sendLogInfo(data)
}
window.onbeforeunload = function() {
    sendLogInfo(data)
}
```

改造B页面中的跳转代码

```javascript
    function handleSitchPage(flag) {
        // if (flag) {
        //     window.href = 'http://www.baidu.com/c'
        // }
        // 是将五轮上报成功失败还是成功，都会执行跳转，所以logs中的emiterEvent.emit('sendDataSuccess', true)应该放在complete中更适合
        window.href = 'http://www.baidu.com/c'
    }
    emiterEvent.on('sendDataSuccess', handleSitchPage)
```

如此即可满足上报服务器之后再跳转页面了
