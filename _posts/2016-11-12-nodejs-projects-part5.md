---
layout: post
title: NodeJs项目实战之实时聊天室(五)
author: beyondouyuan
date: 2016-11-12
categories: blog
tags: [NodeJs]
node: node
description: 离恨多，相见少，何处醉迷三岛？漏清宫树子规啼，愁锁闭窗春晓。

---

### 写在前面 ###

天下英雄我辈出，无论撸代码还是写博客笔记，没有持续三个小时都不好意思说实在学习，所以，接着喽！

结构中，server.js为服务器端处理文件。
client.js为当前用户客户端，为发起者。
chat.js为其他用户客户端，为接收者。

### 单飞与群P ### 


在启动应用进入到聊天界面时，首先需要弹出一个对话框用于设置用户名称：

1.弹出添加用户窗口


    // client.js
    // 弹出对话框
    $(function(){
        // 弹出添加用户窗口
        $('#myModal').modal({
            //backdrop: 'static',
            keyboard: false
        });
    });

2.注册添加用户处理程序

    $(function(){
        // 弹出添加用户窗口
        $('#myModal').modal({
            //backdrop: 'static',
            keyboard: false
        });

        // 添加用户ID处理程序
        // login
        $('#btn-setName').click(function(){
            var name = $('#username').val();
            // 判断用户ID是否为空或者是否已经存在
            // 若输入的用户名ID为空或者用户列表中已经存在一样的用户名，则弹出提示
            if(checkUser(name)){
                $('#username').val('');
                alert('Nickname already exists or can not be empty!');
            }else{
                // 否则执行添加用户处理程序
                var imgList = ["/images/1.jpg","/images/2.jpg","/images/3.jpg","/images/4.jpg","/images/5.jpg"];
                var randomNum = Math.floor(Math.random()*5);
                // random user
                // 随机设置用户的头像，头像图片从imgList从随机取出
                var img = imgList[randomNum];
                // package user
                // 打包用户信息
                var dataObj = {
                    name:name,
                    img:img
                };
                // send user info to server
                // 将该用户所设置的信息发送到服务器
                socket.emit('login',dataObj);
                //hide login modal
                // 隐藏设置用户名称对话框
                $('#myModal').modal('hide');
                // 清空用户信息
                $('#username').val('');
                // 聊天窗口获取焦点
                $('#msg').focus();
            }
        });
    });

    // 封装函数
    // check is the username exist.
    // 判断列表中是否存在已经设置了的用户ID
    function checkUser(name){
        var haveName = false;
        $(".user-content").children('ul').children('li').each(function(){
            if(name == $(this).find('span').text()){
                haveName = true;
            }
        });
        return haveName;
    }

添加用户名称时首先需要进行验证，包括非空验证，以及该名称已经被占用(即用户列表中是否已经存在)。当验证合格时，执行处理程序，为用户设置头像，头像的图片来自我们目前默认提供的图片，每个用户的头像随机从已有的图片地址列表从获取。将所设置的用户信息打包为dataObj对象，并有socket对象发送至服务器。


我们的client.js(客户端中)有这样的代码：

    socket.emit('login',dataObj);

我们向服务器发送了一个login事件，该事件将我们已经打包好的用户信息对象传输过去，这个dataObj就是我们的用户信息，他有两个属性name和img。客户端发送了信息，那么服务器端对应就会有一个程序来处理此客户端事件。

那么在server.js中添加如下代码：

    'use strict';
    // 引入socket.io
    var io = require('socket.io')();
    // 使用io则是面向所有用户(客户端)，废话，服务器当然是面对所有客户端了
    // 创建io的连接事件
    // 用户列表格式，用户信息为一个对象。
    /* userList
    format:{
        {
            name:"",
            img:"",
            socketId:""
        }
    }
    */
    // 用户列表(数据对象，用户存储客户端传输过来的用户对象信息)
    var userList = [];

    io.on('connection',function (socket) {

        // login function
        // 接收客户端提交的登录事件(login)
        socket.on('login',function(user){
            // user就是客户端传过来的dataObj对象
            // 为每个用户设置一个id，这个id是服务器分配的唯一标识，永不重复
            user.id = socket.id;
            // 将客户端传输过来的(设置的)用户存储到userList对象
            userList.push(user);
            // socketList.push(socket);
            // send the userlist to all client
            // 将用户列表传输到每一个客户端，以显示出在线的用户
            io.emit('userList',userList);
            // send the client information to client
            // 向当前连接的客户端发送信息，并未向所有用户进行广播
            // 也就是说将当前用户(也即是刚刚向服务器发送请求的用户)的信息发回给自身，提示给当前用户的欢迎信息
            socket.emit('userInfo',user);
            // 注意，userList和userInfo事件传输的都是对象
            // loginInfo传输的是字符串
            // send login info to all.
            // 向所有客户端发送该用户上线的信息
            socket.broadcast.emit('loginInfo',user.name+"上线了。");
        });


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


我们首先定义了一个数据用于接收客户端传输过来的用户信息：

var userList = [];


注意：这些事件都必须是在用户连接服务器时才会处理，也就是说这个socket.on('login',function(user)事件必然是在io.on('connection')中。

userList格式如format注释块所示，多了的一个id属性是由客户端分配的一个唯一标识，用于与其他用户做区别。

login处理程序中，首相就是给该用户设置了一个id属性，它是唯一的。

    socket.on('login',function(user)){
        // do someThing
    }

这段代码中的匿名函数从的user参数所接收的就是从客户端传输过来的dataObj用户信息对象。
将所接收到的dataObj(此时已被user接收)填充到userList数组中存储。处理从客户端发来的信息的部分其实已经完成。但是，服务器不但要处理从客户端发来的信息，同时也要将服务器或者数据库中的信息发到每一个客户端中。

所以我们在处理完这个客户端(每一个用户就是一个socket对象)对象时，从服务器向客户端发送信息，首先要做的是使用io广播式的方式向每一个客户端派发一个userList事件，这个userList事件把用户列表(即userList数组)都发送了出去，这样会使得每一个客户端都接收到这个用户列表，并在UI的用户列表中显示出来。同时我们还需要使用socket对象向当前连着的客户端发送一个用户信息，随后该用户通过调用broadcast向其他客户端发送自己的上线。

> 注意，userList和userInfo事件传输的都是对象
> loginInfo传输的是字符串

就像刚才我们在客户端中注册了一个login事件，服务器就需要有一个对应的处理程序来处理客户端发送的请求事件，那么我们此时在服务器中注册了三个事件，那么客户端也需要有对应的三个处理程序来处理对应的事件。


    // chat.js

    'use strict';


    var socket = io();

    // 使用socket，表明是当前用户(客户端)
    // 接收服务器发来的信息

    // 接收来自服务器的上线通知
    socket.on("onLine",function (message) {
        showMsg(0);
    });
    // 接收来自服务器的下线通知
    socket.on("offLine",function (message) {
        showMsg(1);
    });



    // when user login or logout,system notice

    // 接收来自服务器的上线通知
    socket.on('loginInfo',function(msg){
        addMsgFromSys(msg);
        Messenger().post({
            message: msg,
            showCloseButton: true
        });
    });

    // add user in ui

    // 接收来自服务器的用户列表并将之添加到用户列表UI中
    socket.on('userList',function(userList){
        // modify user count 修改用户数量
        // modifyUserCount(userList.length);
      addUser(userList);
    });

    // client review user information after login
    // 将当前用户的信息显示回到当前客户端，提示给当前用户的欢迎信息
    socket.on('userInfo',function(userObj){
      // should be use cookie or session
        userSelf = userObj;
      $('#spanuser').text('欢迎您！ '+userObj.name);
    });


首先看addUser(userList)，该函数用于将服务器端发来的用户列表渲染至UI之中，他是在client.js中定义的

在client.js的checkUser()函数后添加如下代码：

    // add user in UI
    // 将服务器传送过来的用户列表userList渲染到UI界面之中
    // 在chat.js中被调用
    // userList是一个数组，因此需要循环遍历，将每一个数组元素遍历出来，并插入列表
    function addUser(userList){
        var parentUl = $('.user-content').children('ul');
        var cloneLi = parentUl.children('li:first').clone();
        parentUl.html('');
        parentUl.append(cloneLi);
        for(var i in userList){
            var cloneLi = parentUl.children('li:first').clone();
            cloneLi.children('a').attr('href',"javascript:showSetMsgToOne('"+userList[i].name+"','"+userList[i].id+"');");
            cloneLi.children('a').children('img').attr('src',userList[i].img);
            cloneLi.children('a').children('span').text(userList[i].name);
            cloneLi.show();
            parentUl.append(cloneLi);
        }
    }


参数userList用于接收服务器传送过来的用户列表userList并渲染到UI界面之中。
userList是一个数组，因此需要循环遍历，将每一个数组元素遍历出来，并插入列表


在每一个li中的a标签都绑定了一个js事件showSetMsgToOne，他是用于单聊的

    // client.js：

    function showSetMsgToOne(name,id){
        $('#setMsgToOne').modal();
        $('#myModalLabel1').text("Send to "+name);
        toOneId = id;
    }


### 群P ### 

实现群聊，也就是说将某用户发送的信息经过服务器派发到除了这个发出信息外的所有的其他用户。

    // server.js
    // send to all
    socket.on('toAll',function(msgObj){
        /*
            format:{
                from:{
                    name:"",
                    img:"",
                    id:""
                },
                msg:""
            }
        */
        socket.broadcast.emit('toAll',msgObj);
    });


既然服务器端有了这个发送群聊的请求事件处理程序，那么客户端也就该有相应的请求事件。


在client.js的login请求后添加如下代码：

    // send to all
    // 发送群聊信息请求
    $('#sendMsg').click(function(){
        var msg = $('#msg').val();
        if(msg==''){
          alert('Please enter the message content!');
          return;
        }
        var from = userSelf;
        var msgObj = {
          from:from,
          msg:msg
        };
        socket.emit('toAll',msgObj);
        addMsgFromUser(msgObj,true);
        $('#msg').val('');
    });

当前用户发起群聊后，其他客户端也会有相应的群聊事件：

    // chat.js
    // review message from toAll
    // 接收来自其他客户端经由服务器发送过来的群聊信息
    socket.on('toAll',function(msgObj){
        // 将接收到的信息显示在聊天窗口中
        addMsgFromUser(msgObj,false);
    });

当用户发送信息时，需要将所发送的信息在聊天窗口显示出来，那么addMsgFromUser()就是做这个活的函数了：

    // client.js
    // add message in UI
    // 将用户发送的信息在聊天窗口显示出来
    function addMsgFromUser(msgObj,isSelf){
        var msgType = isSelf?"message-reply":"message-receive";
        var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
        msgHtml.addClass(msgType);
        msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
        msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
        msgHtml.children('.message-info').children('.message-content-box').children('.message-content').text(msgObj.msg);
        $('.msg-content').append(msgHtml);
        //滚动条一直在最底
        $(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
    }

发起端和接收端用户都调用了addMsgFromUser()来将聊天信息显示在聊天窗口中。

器参数isSelf代表是发起者，控制用于控制信息样式，以与接收者区分开来
。
此时测试一下，我们的信息其实已经可以发送了：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_28.png" align="center"></p>
</center>


note:刚刚还发生了个低级错误，把数组userSelf写成了userSelft^-^!于是，信息发送失败
。

### 单聊 ###

群聊已过单相思！

在server.js中添加单聊处理程序，代码如下：

    // server.js
    // send to one
    // 服务器端单聊处理程序
    socket.on('toOne',function(msgObj){
        /*
            format:{
                from:{
                    name:"",
                    img:"",
                    id:""
                },
                to:"",  //socketid
                msg:""
            }
        */
        // var toSocket = _.findWhere(socketList,{id:msgObj.to});
        // 单聊时根据唯一标识id查询用户
        // 从我们所有的用户中查询出msgObj.to的用户的id然后就行发送
        var toSocket = _.findWhere(io.sockets.sockets,{id:msgObj.to});
        console.log(toSocket);
        // 只有目标用户会接收到这条响应派发事件
        toSocket.emit('toOne', msgObj);
    });


单聊时，从我们所有的用户中查询出msgObj.to的用户的id然后就行发送给目标用户。

在客户端client.js中添加单聊请求：

    // client.js
    // send to one
    // 发送单聊请求
    $('#btn_toOne').click(function(){
        var msg = $('#input_msgToOne').val();
        if(msg==''){
          alert('Please enter the message content!');
          return;
        }
        var msgObj = {
            from:userSelf,
            to:toOneId,
            msg:msg
        };
        socket.emit('toOne',msgObj);
        $('#setMsgToOne').modal('hide');
        $('#input_msgToOne').val('');
    });


在其他的客户端接收经由服务器派发的单聊响应：

    // chat.js
    // review message from toOne
    // 接收来自其他客户端经由服务器发送过来的单聊信息
    socket.on('toOne',function(msgObj){
      Messenger().post({
        message: "<a href=\"javascript:showSetMsgToOne(\'"+msgObj.from.name+"\',\'"+msgObj.from.id+"\');\">"+msgObj.from.name + " send to you a message:"+ msgObj.msg+"</a>",
        showCloseButton: true
      });
    });

单聊仅会在右下角弹出提示框。

到现在为止，我们还只是处理了普通的信息发送，一般的，IM应用还需要处理图片发送。

### 发送图片 ### 

要实现图片处理，这需要文件流处理模块，即fileReader模块。我们需要在应用中引入这个模块。

我们需在app.js中引入：

    var fs = require('fs');
    var index = require('./routes/index');

    var acceccLogFile = fs.createWriteStream('accecc.log',{flags:'a'});

处理图片文件使用input标签，而我们可能选择单张图片，也可能是多张图片，所以，从该input标签得到的图片是一个数组，处理数组文件使用文件流来处理。


首先，客户端发情发送图片的请求：

在client.js添加如下代码：

    //send image to all
    $('#sendImage').change(function(){
        if(this.files.length != 0){
            var file = this.files[0];
            // 教程中不使用var来定义reader，在我使用过程会报错
            var reader = new FileReader();
            if(!reader){
                alert("!your browser doesn\'t support fileReader");
                return;
            }
            reader.onload = function(e){
                //console.log(e.target.result);
                var msgObj = {
                    from:userSelf,
                    img:e.target.result
                };
                socket.emit('sendImageToALL',msgObj);
                addImgFromUser(msgObj,true);
            };
            reader.readAsDataURL(file);
        }
    });

e.target.result会将图片保存为base64的格式。我们需要将base64格式的图片也很简单，src指向base64字符串即可。

教程中不使用var来定义reader，在我使用过程会报错为未定义，所以加了var来声明。
同时调用addImgFromUser()函数，将发送的图片在聊天窗口展示出来：

    // client.js
    // add images in UI
    // 将发送的图片显示在聊天窗口
    function addImgFromUser(msgObj,isSelf){
        var msgType = isSelf?"message-reply":"message-receive";
        var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
        msgHtml.addClass(msgType);
        msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
        msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
        msgHtml.children('.message-info').children('.message-content-box').children('.message-content').html("<img src='"+msgObj.img+"'>");
        $('.msg-content').append(msgHtml);
        //滚动条一直在最底
        $(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
    }

客户端发送请求红，服务器端应有对应的请求处理程序，那么在server.js中添加群聊发送图片请求的处理程序：

    // sendImageToALL
    // 群聊发送图片处理请求程序
    socket.on('sendImageToALL',function(msgObj){
        /*
            format:{
                from:{
                    name:"",
                    img:"",
                    id:""
                },
                img:""
            }
        */
        // 由服务器作为中转，将图片信息发送到除了自己以外的每一个客户端
        socket.broadcast.emit('sendImageToALL',msgObj);
    })


也就是说，此应用中，我们的server.js相当于是数据中转站。

既然服务器端已经有了请求处理程序并作出响应，那么客户端当然也就有一个事件去接收来自服务器端的响应了，在chat.js中添加如下代码：

    // server.js
    // 接收服务器传过来的群聊图片，并渲染到聊天窗口
    socket.on('sendImageToALL',function(msgObj){
      addImgFromUser(msgObj,false);
    });

打开应用，试试看：


<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_29.png" align="center"></p>
</center>

基本的功能都已经实现，若是还想把应用做的更好些，那么，再一边看文档一边google一边思索咯。


这一系列学习中，我们并不在意前段UI以及DOM操作等等，我们主要关注的是NodeJS以及与之相关的Express框架以及socket.io。使用express快速搭建应用的工程目录，可以省去很多文件配置的的时间精力，可以将大部分的时间放在真正的业务逻辑代码中。UI部分借助jade以及bootcss、soc.js等等快速完成。

这个系列暂时到此，之后可能会继续。

其实前段时间未借助github上朋友搭建好的静态博客时，就想着用NodeJS做个博客来玩玩的，不过却因为公司事多，回来再慢慢折腾的话我怕把自己的笔记都不知道扔哪里去了，索性再缓缓。

从十一月初一直到昨天都没有写下什么东西，除了是公司比较忙之外，其实自己还是在公司下班休息之余一直在玩ReactJS，一边玩一边在demo项目的README.md中做学习笔录，本想是用云盘备份回来然后把笔记搬到github的博客上，不过，云盘都是要死翘翘了。所以一直都没有搬回来，所以打算下一段时间整理之前的ReactJS的学习笔记，完了后再继续NodeJS学习，以及之前一年以来做下的不少工作学习笔记也需要整理。今天颈椎有点不舒服。所以，这篇写完，下午到晚上都不会再写东西了。


<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_30.png" align="center"></p>
</center>
