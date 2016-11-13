---
layout: post
title: NodeJs项目实战之实时聊天室(四)
author: beyondouyuan
date: 2016-11-12
categories: blog
tags: [NodeJs]
node: node
description: 语已多，情未了。回首犹重逢，记得绿罗裙，处处怜芳草。

---

### 写在前面 ###

最近忙于公司的事情，好久没有动手写点什么了，感觉心里怪怪的，昨天又忙于吃狗粮，肚子有点不舒服，不过总算过去了。又是周末啦，继续node之路咯。

### 基础版 ### 

首先左手页面布局，我们的布局很简单，就是一个单页面的应用，使用jade模板已经bootstrap样式，实现布局。


layout.jade页面布局模板如下：

    doctype html
    html
      head
        title= title
        meta(name="viewport",content="width=device-width, initial-scale=1")
        link(rel='stylesheet', href='http://cdn.bootcss.com/bootstrap/3.2.0/css/bootstrap.min.css')
        link(rel='stylesheet', href='/stylesheets/main.css')
        script(src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js")
        script(src="http://cdn.bootcss.com/bootstrap/3.2.0/js/bootstrap.min.js")

      body
        block content

首页index布局如下：


    extends layout

    block content
        link(rel='stylesheet', href='/stylesheets/sco.message.css')
        link(rel='stylesheet', href='/stylesheets/message.css')


        .container
            .row
                .col-sm-3
                    .panel.panel-primary(style="margin-right:-10px;")
                        .panel-heading
                            span.glyphicon.glyphicon-user &nbsp;
                            span 在线成员
                        .panel-body
                            .msg-list-body.user-content
                                ul
                                    li(style="display:none;")
                                        a(href="#")
                                            img.img-thumbnail(src="/images/1.jpg")
                                            span

                        .panel-footer
                            .btn-group
                                button.btn.btn-primary(type="button")
                                    span.glyphicon.glyphicon-home
                                button.btn.btn-primary(type="button")
                                    span.glyphicon.glyphicon-user
                                button.btn.btn-primary(type="button")
                                    span.glyphicon.glyphicon-film
                                button.btn.btn-primary(type="button")
                                    span.glyphicon.glyphicon-music
                                button.btn.btn-primary(type="button")
                                    span.glyphicon.glyphicon-heart
                                button.btn.btn-primary(type="button")
                                    span.glyphicon.glyphicon-envelope
                .col-sm-9
                    .panel.panel-primary
                        .panel-heading
                            span.glyphicon.glyphicon-comment &nbsp;
                            span 聊天室
                            span#spanuser(style="float:right;")
                        .panel-body
                            .msg-list-body.msg-content

                        .panel-footer
                            .input-group
                                .input-group-addon
                                    a(href="#")
                                        img(src="/images/bq.png")
                                .input-group-addon(style="padding-bottom:0px;")
                                    label(style="position:relative;")
                                        img(src="/images/jt.jpg",title="send images",style="cursor:pointer;")
                                        input#sendImage(type="file",value="images",style="display:none;")
                                input.form-control#msg(type="text",placeholder="请输入聊天内容",onkeydown="javascript:keywordsMsg(event);")
                                span.input-group-btn
                                    button.btn.btn-primary#sendMsg(type="button") 发送/Send

        .modal.fade#myModal(tabindex="-1")
            .modal-dialog
                .modal-content
                    .modal-header
                        h4.modal-title#myModalLabel 请设置聊天昵称
                    .modal-body
                        .form-group
                            .input-group
                                .input-group-addon 昵称
                                input.form-control#username(type="text",value="李阳",onkeydown="javascript:keywordsName(event);")
                    .modal-footer
                        input.btn.btn-primary#btn-setName(type="button",value="应用昵称")

        .modal.fade#setMsgToOne(tabindex="-1")
            .modal-dialog
                .modal-content
                    .modal-header
                        h4.modal-title#myModalLabel1
                    .modal-body
                        input.form-control#input_msgToOne(type="text",onkeydown="javascript:keywordsName1(event);")

                    .modal-footer
                        input.btn.btn-primary#btn_toOne(type="button",value="发送/Send")
        //script(src="/socket.io/socket.io.js")
        //script(src='/javascripts/chat.js')
        //script(src='/javascripts/client.js')
        //script(src='/javascripts/sco.message.js')


到现在为止，我们只在乎页面布局，js等先一概不管。

使用jade时注意缩进，否则布局可能会出错哦。


此时打开我们的浏览器，页面已经出来喽：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_25.png" align="center"></p>
</center>


世间竟有这般美貌的女子！

万事俱备，只欠东风，界面已了，那么接下来就是处理信息内容的发送这些功能了。


额，等等，我们还需要一个页面通知，使用sco.message.js来通知用户登录信息，在index.jade中引用所需的js文件：

    script(src="/socket.io/socket.io.js")
    script(src='/javascripts/chat.js')
    script(src='/javascripts/client.js')
    script(src='/javascripts/sco.message.js')


首先，我们在服务器server.js中写下服务器在有用户上线时向客户端chat发送信息：

    // server.js
    // 引入socket.io
    var io = require('socket.io')();

    // 创建io的连接事件


    io.on('connection',function (socket) {
        console.log('有一个用户登录了！');
        // io是对于整个服务器而言，而用户下线这是针对某个客户端，客户端使用socket而不是io
        socket.on('disconnect',function(){
            console.log('用户下线了');
        });
        // 上线后服务器向客户端传输信息
        io.emit("onLine",'');
    });

    // 在使用socket.io的应用中，使用io来监听服务器端口
    // 创建监听器

    exports.listen =function (server) {
        io.listen(server);
    };

emit方法即为事件派发器，向客户端发送事件。既然服务器发送了信息，那么客户端也就该有个函数来接收服务器所发送的信息：

    // chat.js

    var socket = io();


    // 接收服务器发来的信息


    socket.on("onLine",function (message) {
        showMsg();
    });


showMsg()在client.js中定义：


    'use strict';

    // 展示内容
    function showMsg(message) {
         $.scojs_message('This is an info message', $.scojs_message.TYPE_OK);
    }


至于：

    $.scojs_message('This is an info message', $.scojs_message.TYPE_OK);

这就是我们引用的soc.messgae.js来提供了，他是bootstrap用户增强效果所提供的js文件。


此时刷新一下浏览器：


<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_26.png" align="center"></p>
</center>

而此时，若是我们使用两个浏览器同样的访问我们的聊天室，当我们刷新的时候，发现两个浏览器都会有通知，也就是说，我们会向所有在线的用户通知我自己上线了。

note:
>
>
我们使用socket.io时，需要注意，当我们派发够格事件，若是用io则是向所有客户端进行派发，若是使用socket则是向当前用户进行派发。
>

我们在服务器server.js中使用到了io.emit("onLine",'');方法进行派发事件，
此时我们只派发了用户上线事件，那么我们也可以派发下线事件：

    // server.js
    'use strict';
    // 引入socket.io
    var io = require('socket.io')();
    // 使用io则是面向所有用户(客户端)，废话，服务器当然是面对所有客户端了
    // 创建io的连接事件


    io.on('connection',function (socket) {
        console.log('有一个用户登录了！');
        // io是对于整个服务器而言，而用户下线这是针对某个客户端，客户端使用socket而不是io
        socket.on('disconnect',function(){
            // console.log()是在cmd中打印
            console.log('用户下线了');
            // 向客户端派发下线事件
            io.emit("offLine",'');
        });
        // 上线后服务器向客户端传输信息
        io.emit("onLine",'');
    });

    // 在使用socket.io的应用中，使用io来监听服务器端口
    // 创建监听器

    exports.listen =function (server) {
        io.listen(server);
    };


注意io.emit("offLine",'');的位置哦！

那么在客户端也写一个接收下线通知的函数：


    // chat.js
    // 接收来自服务器的上线通知
    socket.on("onLine",function (message) {
        showMsg(0);
    });
    // 接收来自服务器的下线通知
    socket.on("offLine",function (message) {
        showMsg(1);
    });


看到了不同了么，没错，showMsg()函数，我们出入了参数，以用于判断用户是下线还是上线，所以我们还需要修改一下showMsg()来接收参数并根据不同的参数判断是下线还是上线，以便发出不同的通知：

    // clinet.js
    // 展示内容
    function showMsg(type) {
        if(type == 0){
            $.scojs_message('This is an user online', $.scojs_message.TYPE_OK);
        }
        if (type == 1) {
            $.scojs_message('This is an user offline', $.scojs_message.TYPE_ERROR);
        }
    }


TYPE_OK和TYPE_ERROR是soc.messgae.js的样式。我们还是打开两个浏览器，刷新之：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_27.png" align="center"></p>
</center>

有如清水出芙蓉的感觉么！
