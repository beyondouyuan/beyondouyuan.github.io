---
layout: post
title: 原生JavaScript实现JSONP跨域
author: beyondouyuan
date: 2017-08-06
categories: blog
tags: [JavaScript]
javascript: javascript
description: 依依似与骚人语。当年不肯嫁春风，无端却被秋风误。

---

### 写在前面 ###

我们常常使用到Ajax与后端实现异步数据交互，Jquery对
Ajax和JSONP实现的跨域做了很好的封装，但有时候，我们并不需要Jquery，那么用原生实现Ajax以及JSONP的跨域就很有必要了。


### JSONP原理

JSONP即JSON + Padding实现跨域请求方式，简单粗暴点的理解，JSONP就是通过动态船舰script标签，通过script标签的src绕过浏览器的同源策略的限制实现跨域，通过src属性发送请求到服务器，服务器返回js代码，网页端接收响应，然后直接执行代码，其就相当于是通过scriptyingyong外部文件一样。

### JDON组成

JSON由两部分组成，回调函数和数据，回调函数一般由网页端控制，作为参数法网服务器，服务器把该函数和数据拼接成字符串再返回。

如网页创建一个script标签，并给其src属性赋值为http:www.url/json/api/?callback=posts，此时网页端就发起一个请求，服务器将需要返回的数据拼好作为该回调函数(posts)的参数传入，服务器返回的数据类型类似为'posts({"name":"ouyuan","title":"my title"})'。网页端接收了响应值，因为请求是script，所以相当于直接调用了posts方法，并且传入了参数。

### 函数封装

    function jsonp(options) {
        options = options || {};
        if (!options.url || !options.callback) {
            throw new Error('请传入合法参数');
        }

        // 创建script标签，并加入到页面中
        // 返回的回调函数名，加入随机参数避免缓存
        var callbackName = ('jsonp_' + Math.random()).replace('.', '');
        // 获取head标签
        var head = document.getElementsByTagName('head')[0];
        // 填充回调函数名
        options.data[options.callback] = callbackName;
        // 格式化参数
        var paramas = formatParams(options.data);
        // 创建script标签
        var script = document.createElement('script');
        // 插入script标签的head
        head.appendChild(script);

        // 创建JSONP回调函数
        // window[callbackName]的形式，可是的回调函数可被全局调用
        window[callbackName] = function(json) {
            // script标签的哦src属性只在第一次设置时起作用，即script标签标签是无法重用的，故每次创建回调函数，即每次设置script标签是需要将前一个script以及其src移除
            head.removeChild(script);
            clearTimeout(script.timer);
            window[callbackName] = null;
            options.success && options.success(json);
        };

        // 发送请求

        script.src = options.url + '?' + paramas;
        // 超时处理
        if (options.timeout) {
            script.timer = setTimeout(function() {
                window[callbackName] = null;
                head.removeChild(script);
                options.fail && options.fail(message, '请求超时');
            }, timeout);
        }
    }




    //格式化参数
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[i]));
        }
        return arr.join('&');
    }













































