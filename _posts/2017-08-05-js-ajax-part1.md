---
layout: post
title: 原生JavaScript实现Ajax
author: beyondouyuan
date: 2017-08-05
categories: blog
tags: [JavaScript]
javascript: javascript
description: 依依似与骚人语。当年不肯嫁春风，无端却被秋风误。

---

### 写在前面 ###

我们常常使用到Ajax与后端实现异步数据交互，Jquery对
Ajax和JSONP实现的跨域做了很好的封装，但有时候，我们并不需要Jquery，那么用原生实现Ajax以及JSONP的跨域就很有必要了。


### Ajax

Ajax是一种无需刷新的整个页面的数据请求方式，其技术核心是XMLHttpRequest对象。
Ajax请求过程：创建XMLHttpRequest对象，链接服务器，发送请求，接收响应数据。


### Ajax请求过程

1 创建
- 若要使用AJax，这需首先创建XMLHttpRequest对象
- 1 IE7级以上版本支持原生的XMLHttpRequest
- 2 IE6以及之前版本的浏览器需要使用微软的库来实现XMLHttpRequest对象

2 链接和发送
- 1 open()函数接收三个参数：请求方式，请求地址，是否异步请求
- 2 GET请求方式：通过URL参数将数据提交到服务器
- 3 POST请求方式：将需要发送的数据作为send()的参数提交到服务器
- 4 POST请求方式中，在提交数据前需要设置表单提交的内容类型
- 5 提交到服务器的参数必须经过 encodeURIComponent() 方法进行编码，实际上在参数列表”key=value”键值对的形式中，key 和 value 都需要进行编码，因为会包含特殊字符。每次请求的时候都会在参数列表中拼入一个 “v=xx” 的字符串，这样是为了拒绝缓存，每次都直接请求到服务器上。
- 6 encodeURI() ：用于整个 URI 的编码，不会对本身属于 URI 的特殊字符进行编码，如冒号、正斜杠、问号和井号；其对应的解码函数 decodeURI()；
- 7 encodeURIComponent() ：用于对 URI 中的某一部分进行编码，会对它发现的任何非标准字符进行编码；其对应的解码函数 decodeURIComponent()；

3 接收数据
- 接收到响应后，响应的数据自动填充XHR对象
- 1 responseText：响应返回的主题内容，为字符串类型
- 2 responseXML：若响应的内容为"text/xml"或"application/xml"，则使用该属性保存响应xml数据
- 3 status：http状态码
- 4 statusText：http状态码说明
- 5 XMLHttpRequest对象的readyState属性表示请求过程的当前活动阶段，值列表：
- 0-未初始化，即尚未调用open()方法
- 1-启动，调用了open()方法，为调用send()方法
- 2-发送，已经调用了send()方法，未收到响应
- 3-接收，已经接收到部分响应数据
- 4-完成，已经接收到全部响应数据
- 只要readyState的值发生变化，就调用readystatechange事件
- 在readystatechange事件中，首先判断是否已完成数据的接收，然后再判断服务器是否成功处理请求，
- xhr.status是状态码，状态码以2字头均为成功处理
- ajax是不能够跨域的哦！


### 调用示例

    window.onload = () => {
        // 调用示例
        ajax({
            url: "./TestXHR.aspx", //请求地址
            type: "POST", //请求方式
            data: { name: "super", age: 20 }, //请求参数
            dataType: "json",
            success: function(response, xml) {
                // 此处放成功后执行的代码
            },
            fail: function(status) {
                // 此处放失败后执行的代码
            }
        });
    }

### 封装函数

    function ajax(options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        options.dataType = options.dataType || 'json';

        let paramas = formatParams(options.data);

        // 1.创建XMLHttpRequest 并兼容IE

        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { // 兼容IE
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        // 3.接收响应数据
        xhr.onreadystatechange = function() {
            if (xhr.readyStatus == 4) {
                var status = xhr.status;
                // 请求成功
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }

        // 2.链接&&发送
        if (options.type == 'GET') {
            xhr.open('GET', options.url + '?' + paramas, true);
            xhr.send(null);
        } else if (options.type == 'POST') {
            xhr.open('POST', paramas, true);
            // 请求头信息
            // 表单提交时的内容类型
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            shr.send(paramas);
        }
    }


    // 格式化参数

    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
    }











