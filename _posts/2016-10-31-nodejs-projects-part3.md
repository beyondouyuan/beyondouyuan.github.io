---
layout: post
title: NodeJs项目实战之实时聊天室(三)
author: beyondouyuan
date: 2016-10-31
categories: blog
tags: [NodeJs]
node: node
description: 淡妆多态，更滴滴频回盼睐。便认得琴心先许，欲绾合欢双带。记画堂风月逢迎，轻颦浅笑娇无奈。向睡鸭炉边，翔鸾屏里，羞把香罗暗解。

---

### 写在前面 ###

当我们一开始接触静态的html页面时，我们会把所有的内容都插入在html页面中，后来，我们逐渐的学会了分离，但是这还是不够，于是，我们使用了模板诸如template和jade之类等等等等，我们只需要设计好模板，然后通过JavaScript等技术的语法把我们的技术插入进来，这样会使得我们的应用更加分离，不但实现HTML/CSS/JavaScript等的分离，也可以把一大部分的静态数据从html中解耦出去。

### Jade ### 

为什么使用模板，很简单，它可以让我们的代码更加简洁，更利于维护，并且但它与JavaScript特别是NodeJS配合起来使用时具有高效率，express中优先集成了jade，所以，我们这个项目中就选择使用jade模板来生成html页面文件。


### 如何使用jade ###

既然jade基于nodejs，那么我们就可以通过npm install jade -g把它下载下来。


### 一.搭建工程 ### 

目前来说，前端的UI界面的实现对于我们来说已经不足一提，那么UI的实现就不到此为止，接下来，开始搭建工程。

一般的，若我们不借助任何框架，创建工程项目时，第一个命令都是mkdir workName，先创建根目录，然后再一个一个结构层次的去构建，这未免太浪费时间了。现在我们借助了express，完全不必如此了！直接执行如下命令，express将会为我们搭建好一个工程：

    express chat_demo


cmd窗口提示我们创建了哪些文件以及怎样启动这个应用，这个在之前熟悉express时已经有学习过，在此也不必再次多说了。
<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_22.png" align="center"></p>
</center>

再看看我们的工程目录：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_23.png" align="center"></p>
</center>


厉害，以前我们需要考虑将css文件、js文件以及图片等文件夹放在那里等等东西，现在我们完全无需手动去做这些花时间的事情，交给框架，我们的时间应该放在真正的业务逻辑代码上。


搭建工程步骤：

1.在cmd窗口运行：

    express chat_demo

工程创建完成后，有两行提示，
1).install dependencies:(下载依赖项)

>cd chat_demo && npm install (进入到工程目录chat_demo，然后执行npm install下载依赖项)

2.下载package,json配置中的依赖项：

    chat_demo>npm install

当这行命令执行完成后，我们会发现我们的工程有了node_modules目录，也就是说我们需要的依赖项都下载下来了，但是这个依赖项还没有我们需要的socket.io，所以我们去喜爱在socket.io依赖项

3.下载socket.io依赖项到当前工程

    chat_demo>npm install socket.io --save


下载完成后，我们的package.json依赖项信息中也会有socket.io的信息。

我们的应用需要什么呢？需要静态客户端的js，静态资源放在public文件夹，那么js文件里所应当也就是放置在该目录下的javascript文件夹中了。
我们把客户端的js命名为client.js。

4.创建客户端client.js
    public/
     -javascript/
      -client.js

应用需要服务器来启动，那么创建一个客户端js文件，该文件就放在应用的根目录。
我们把服务器js命名为server.js:

    chat_demo/
     bin/
     public/
     view/
     app.js
     server.js
     package.json


ok!

动手，首先来写server.js。
server.js中需要到socket.io，所以我们在server.js中引入socket.io：
1.server.js中引入socket.io

// server.js
var io = require('socket.io')();

5.// 创建io的connection连接事件

io.on('connection',function (socket) {
    console.log('有一个用户登录了！');
});

2.在server.js中创建端口监听器
// 在使用socket.io的应用中，使用io来监听服务器端口
// 创建监听器

exports.listen =function (server) {
    io.listen(server);
};

为使客户端与服务器端联系起来，在./bin/www中需要引入server.js

4.在www中应用服务器，使服务端与客户端联系起来
// www
require('../server').listen(server);


6.在客户端建立连接

// client.js
// 在客户端建立连接

var socket = io();


7.在views/目录下的layout.jade中引入客户端js以及socket.io以完成jade编辑为标准的html格式输出：


doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    script(src="/socket.io/socket.io.js")
    script(src="/javascripts/client.js")
  body
    block content


加入监听supervisor:

    chat_demo>npm install supervisor -g


这样当我们的文件有改动的时候程序会自动刷新


启动服务器：

    supervisor ./bin/www

在浏览器中访问[localhost:3000](localhost:3000)

没问题，成功，我们到index.jade中将p welcome #title改为
p 聊天室 #title

修改后，我们无需重启服务器，应用会自动刷新；

测试成功。


在server.js添加离线事件:

    io.on('connection',function (socket) {
        console.log('有一个用户登录了！');
        // io是对于整个服务器而言，而用户下线这是针对某个客户端，客户端使用socket而不是io
        socket.on('disconnect',function(){
            console.log('用户下线了');
        });
    });

我们直接刷新浏览器，此时，会先是用户下线提示，然后再重新上线：
<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_24.png" align="center"></p>
</center>
