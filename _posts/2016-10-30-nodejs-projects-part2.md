---
layout: post
title: NodeJs项目实战之实时聊天室(二)
author: beyondouyuan
date: 2016-10-30
categories: blog
tags: [NodeJs]
node: node
description: 卷絮风头寒欲尽，坠粉飘香，日日红成阵。新酒又添残酒困，今春不减前春恨。

---

### 写在前面 ###

WebSocket.io是一种协议，可用于实时数据传输。

### socket.io ### 

进入[socket.io官网](http://socket.io/get-started/chat/)，根据官网的教程来做个小小的demo看看咯。

首先创建一个名为chat_exampel的项目工程文件夹，执行*npm init*命令，初始化一个package.json配置文件，并输入一些信息。

在chat_exampel根目录下载依赖包express：

    chat_exampel>npm install express --save

紧接着创建一个index.js作为入口文件：

    var app = require('express')();
    var http = require('http').Server(app);

    app.get('/', function(req, res){
      res.send('<h1>Hello world</h1>');
    });

    http.listen(5000, function(){
      console.log('listening on *:5000');
    });


随后启动这个应用：

    chat_exampel>node index.js

当应用启动后窗口将输出如下内容：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_13.png" align="center"></p>
</center>

那么在浏览器中访问[localhost:5000](localhost:5000):

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_14.png" align="center"></p>
</center>

万恶的Hello,World!不！是无所不能的Hello,World!


为了随后的测试方便，我不想每一次测试都要去重复输入node index.js来重启服务器，所以我们可以使用supervisor来启动index.js服务器，这样当我们的应用发生变动时，无需重启服务器，浏览器也会自动刷新：

    chat_exampel>supervisor index.js

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_15.png" align="center"></p>
</center>

仅仅用服务器来send出一条信息也未免太过无趣了，何不输出一个页面？

创建一个index.html页面，结构如下：

    <!DOCTYPE html>
    <html lang="zh_CN">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Examples</title>
        <meta name="description" content="">
        <meta name="keywords" content="">
        <link href="" rel="stylesheet">
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font: 13px Helvetica, Arial;
        }

        form {
            background: #000;
            padding: 3px;
            position: fixed;
            bottom: 0;
            width: 100%;
        }

        form input {
            border: 0;
            padding: 10px;
            width: 90%;
            margin-right: .5%;
        }

        form button {
            width: 9%;
            background: rgb(130, 224, 255);
            border: none;
            padding: 10px;
        }

        #messages {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }

        #messages li {
            padding: 5px 10px;
        }

        #messages li:nth-child(odd) {
            background: #eee;
        }
        </style>
    </head>

    <body>
        <ul id="messages"></ul>
        <form action="">
            <input id="m" autocomplete="off" />
            <button>Send</button>
        </form>
    </body>

    </html>

这个时候先不要纠结于是否解耦之类的了。我们要将这个页面发送出去，那么当然要把index.js中的路由做相应的修改了：

    app.get('/', function(req, res){
      res.sendFile(__dirname + '/index.html');// 这个是绝对路径
        // res.sendFile(__dirname + '/index.html');可以改为如下：
        // res.sendfile('/index.html');不过要小心大小写哦，这个写法是与路由的相对路径
    });


无需手动重启服务器，supervisor会为我们自动重启服务器，我们只需要刷新一下浏览器即可：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_16.png" align="center"></p>
</center>

没有加什么样式，不过淡妆浓抹总相宜，还是很好看的...


我们把socket.io加入进来：

    chat_exampel>npm install --save socket.io

socket.io本身的依赖项比较多，下载起来会稍微花点时间...zzz


### socket.io事件与方法 ###

1.on()方法：对事件进行注册

2.emit()方法 信息传输

3.connection事件(建立连接)，disconnect事件(断开连接)，自定义事件


以上，虽然我们发送了一个带有对话框的页面，但是此时去无法在对话框中实现发送对话，因为我们根本就没有处理扯个表单，那么我们来实现对这个的表单处理。

要实现对话功能，我们首先要建立一个基于用户创建连接的方法。

在服务器中实现，在index.js中引入socket.io

    var io = require('socket.io')(http);


    // 注册一个connection事件，
    io.on('connection', function(socket){
      console.log('a user connected');
    });


创建服务器的逻辑后，转到客户端(也即index.html)在客户端建立socket.io的连接，加入以下内容：

    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
    </script>

为了不阻塞，我们一般向普通的js文件一样放在body底部。


启动一下服务器，刷新浏览器：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_17.png" align="center"></p>
</center>


cmd输出的信息正如我们服务器中预计的一样*a user connected*!

也就是说我们的客户端成功连接到了服务器！

已知，当一个用户上线时，服务器会提示有一个用户上线了，那么，求问，当一个用户下线后，服务器会提示什么信息？

    io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });


注册一个断开连接的监听事件，当用户下线时提示用户断开连接。为什么这个断开事件要写在一个连接事件内部呢？废话吗，如果都没用一个用户进行登录连接，哪来的用户下线？


我们刷新一下浏览器，当我们刷新浏览器时，其实是先把原来的连接断开，再重新建立一个新的连接：


<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_18.png" align="center"></p>
</center>


对！就是这样！


那么，我们想处理这个表单时，就应该建立自定义事件来处理表单：


    <!-- 路径为相对路径 -->
    <script src="/socket.io/socket.io.js"></script>
    <script src="http://code.jquery.com/jquery-1.11.1.js"></script>
    <script>
    // 连接socket服务器
    var socket = io();
    // 客户端表单处理
    $('form').submit(function() {
        // 将从客户端表单中获取到的信息传输给socket，然后再在服务器中接受此处传输过去的信息内容
        socket.emit('chat message', $('#m').val());
        // 清理表单中的信息
        $('#m').val('');
        // 不刷新表单
        return false;
    });
    </script>



服务器端加入以下代码：

    // 在服务器中接受自客户端传输过来的信息
    io.on('connection', function(socket){
      socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });
    });

刷新一下浏览器，并在表单中输入"测试"，紧接着点击按钮发送，回到cmd中查看：
<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_19.png" align="center"></p>
</center>


这说明我们服务器端也成功接收了来自客户端的信息数据，只是他仅仅被打印在cmd窗口而已。


其实我们更像看到的是，服务器接收到客户端发送的信息后，做出响应，这个响应就是把接收到的数据在发送到各个客户端，并在该客户端上显示出来：

    // 在服务器中接受自客户端传输过来的信息
    io.on('connection', function(socket){
      socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        // 做出响应，把说接收到的信息再次发送到客户端去：
        io.emit('chat message', msg);
      });
    });


从服务器端转回到客户端后，那么客户端得有相应操作来接受服务器返回的数据：


    <script>
    // 连接socket服务器
    var socket = io();
    // 客户端表单处理
    $('form').submit(function() {
        // 将从客户端表单中获取到的信息传输给socket，然后再在服务器中接受此处传输过去的信息内容
        socket.emit('chat message', $('#m').val());
        // 清理表单中的信息
        $('#m').val('');
        // 不刷新表单
        return false;
    });
    // 接收服务器端返回的信息，并插入到#messages列表中
    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });
    </script>


刷新下浏览器，输入内容，点击发送按钮：

2333!


<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_20.png" align="center"></p>
</center>


我们打开两个浏览器，同时访问我们的应用[localhost:5000](localhost:5000)，在其中一个浏览器1输入信息*2333*，我们发现另一个浏览器2也会收到这条信息，当我们在浏览器2中输入*666*时，我们发现浏览器1中也收到了这条信息！这说明服务器是把收到的来自任何一个客户端的信息同时发送到了每一个客户端中，我们实现了群聊功能。

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_21.png" align="center"></p>
</center>

我们，是同志了！
