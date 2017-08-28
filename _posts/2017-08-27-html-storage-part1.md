---
layout: post
title: HTML5之SessionStorage和LocalStorage
author: beyondouyuan
date: 2017-08-27
categories: blog
tags: [JavaScript]
javascript: javascript
description: 一寸柔肠情几许？薄衾孤枕，梦回人静。侵晓潇潇雨。
---

### 写在前面

在HTML之前，主要的缓存是依靠Cookie，Cookie一般用于服务器与客户端之间的缓存读取，且一般应用于小规模的缓存处理，在一定程度上也加大了服务器的压力，HTML5定稿后，客户端的缓存处理方案也就应运而生。

SessionStorage和LocalStorage则是HTML提供的客户端本地存储主要的API。

### SessionStorage


一般Web应用中都会使用的会话session，以此作一些数据的存储，比如存储登陆会话信息。HTML5提供的SessionStorage与此相似，SessionStorage一般用于一次session中，窗口关闭则session被销毁。

### SessionStorage的应用

在之前的React项目中，小小的应用了一下SessionStorage来存储登陆验证信息。

首先客户端用户发起登陆请求：

    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                post('http://localhost:3000/login', values)
                    .then((res) => {
                        if(res) {
                            message.success('登陆成功')
                            this.context.router.push('/');
                        } else {
                            message.error('登陆失败，账号或者密码错误')
                        }
                    })
            }
        })
    }

post方法是封装的一个request模块的方法：

    import { hashHistory } from 'react-router'


    export default function request(method, url, body) {
        method = method.toUpperCase();

        if (method === 'GET') {
            // fetch的GET不允许有body，参数只能放在url中
            body = undefined;
        } else {
            // 序列化请求体
            body = body && JSON.stringify(body);
            // 以上相当于
            // if (body) {
            //     json.stringify(body);
            // }
        }

        return fetch(url, {
            // 请求方法
            method,
            // 公共头部信息
            // fetch如ajax一样，若是post方法，发送htttp请求时，根据协议则需要设置请求头报文信息
            // 请求头内部需要设置access_token字段
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem('access_token') || '' // 从sessionStorage中获取access token
            },
            // 请求体
            body
        })
            .then((res) => {
                if(res.status === 401) {
                    // 路由跳转至登陆页面
                    hashHistory.push('/login');
                    // 标记为未认证
                    // return Promise.reject('Unauthorized.');
                } else {
                    // 获取头部的access_token字段
                    const token = res.headers.get('access-token');
                    if (token) {
                        // 设置token存储到sessionStorage中
                        sessionStorage.setItem('access_token', token);
                    }
                    return res.json();
                }
            })
    }

    // 配置不同请求方法的fetch
    export const get = url => request('GET', url);
    export const post = (url, body) => request('POST', url, body);
    export const put = (url, body) => request('PUT', url, body);
    export const del = (url, body) => request('DELETE', url, body);

如上代码，发起请求的操作的请求头：

    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Token': sessionStorage.getItem('access_token') || '' // 从sessionStorage中获取access token
    },

设置了Access-Token字段发送到服务器。

服务器登陆处理代码：

    server.post('/login', function(req, res, next) {
        res.header('Access-Control-Expose-Headers', 'access-token');
        const { account, password } = req.body;
        if (account === 'admin' && password === '123456') {
            res.header('access-token', Date.now());
            res.json(true);
        } else {
            res.json(false);
        }
    });

服务器登陆Action在登陆成功后，响应头部返回的信息包括一个access-token字段。

登陆请求成功，响应代码如下：

    .then((res) => {
        if(res.status === 401) {
             // 路由跳转至登陆页面
            hashHistory.push('/login');
            // 标记为未认证
            // return Promise.reject('Unauthorized.');
            } else {
                // 获取头部的access_token字段
                const token = res.headers.get('access-token');
                if (token) {
                    // 设置token存储到sessionStorage中
                    sessionStorage.setItem('access_token', token);
                }
            return res.json();
        }
    })

请求成佛难过后，获取响应头的access-token字段信息，并通过sessionStorage设置一个access_token字段在session中，作为验证的标示。在之后所有需要验证身份的请求中，请求头发送从sessionStorage中获取的验证标示，服务器获取请求头验证标示。以此，实现token身份验证。


### LocalStorage

LocalStorage和SessionStorage几乎具有一致的API，与SessionStorage作为一次session数据存储所不同的是，LocalStorage是客户端的一种永久存储方式，若不主动删除，则永久存在。

使用LocalStorage是一种很好的数据缓存处理方法，让应用摆脱cookie的包袱，你爽我也爽。

在一个这样的应用场景中：

页面有一个侧边栏，侧边栏的下拉菜单的使用场景大体如此，点击或有展开折叠的功能，这个很简单，直接给dom绑定事件进行操作即可，或者是，创建一个flag标示，作为下拉列表展开折叠的状态标示，监听事件然后操作flag标示即可，这也不难。那么现在产品改需求了：用户一不小心刷新了页面，刚刚辛辛苦苦打开了十几个下拉菜单全部折叠了^_^，我们要更友好的用户体验，用户刷新页面打开的下拉列表保持原有状态。怎么处理呢？知识点，flag保存在LocalStorage中。

再一个简单的例子，新建storage.js文件：

    var obj = {
        "name": "欧元",
        "age": 18,
        "size": 150,
        "city": "广州",
        "job": {
            "zone": "珠江新城",
            "work": "web"
        }
    };
    obj = JSON.stringify(obj)
    var name = "欧元";

    // 直接传递字符串无需做任何转换
    localStorage.setItem('name', name)
    // setItem(key, value)接收键值对
    // 存储对象或者JSON对象需要首先使用JSON.stringify将该对象转化为字符串
    // 当获取改对象时调用JOSN.parse将字符串转换对象
    localStorage.setItem('userInfo', obj);

新建storage2.js文件：

    window.onload = () => {
        var container = document.getElementById('container');
        // 获取对象，由于存储之前已经将对象调用JSON.stringify将其转换为字符串
        // 获取数据后应该调用JSON.parse方法将数据再次转换为对象
        var userInfo = localStorage.getItem('userInfo');
        // container.innerHTML = userInfo;
        console.log(JSON.parse(userInfo));
        // 直接传递过来的字符串类型的值无需做任何转换
        var name = localStorage.getItem('name');
        console.log(name)
    }


HTML结构如下：

    <div class="storage-container" id="container"></div>
    <script src="scripts/storage.js"></script>
    <script src="scripts/storage2.js"></script>


如此，像一些请求的数据就可以存储起来共用也可作为处理数据缓存的很好方案。

在注释中也顺便解释了一下localStorage中传递与获取JSON对象的方法。

localStorage为前端开发者提供了十分简便的客户端数据存储方案，很好的解决了一些长期困扰weber的问题，吾等福音也！


