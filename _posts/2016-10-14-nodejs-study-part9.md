---
layout: post
title: NodeJs初成长(一)之nodejs入门(2)
author: beyondouyuan
date: 2016-10-14
categories: blog
tags: [NodeJs,nodejs入门]
node: node
description: 天若有情天亦老，此情说便说不了。说不了，一声唤起，又惊春晓。
---

###  写在前面 ###

原本以为十一应该可以完成node入门系列，然而，想多了，忙起来真是什么都可以不管不顾，不过，十一之后上班七天的第一个终于来了，那么，继续启程！

接着第一篇[NodeJs初成长(一)之nodejs入门(1)](https://beyondouyuan.github.io/blog/2016/09/30/nodejs-study-part1/)往下。


上一篇完成的server.js，代码如下：

    // server.js  @version $1.0$
    var http = require('http');

    http.createServer(function(request, response) {
        response.writeHead(200, { "content-Type": "text/plain" });
        response.write("Hello,Server World!");
        response.end();
    }).listen(8888);


我们分析一下这个HTTP服务器。

第一行*var http = require('http');*代码请求(require)NodeJS自带的pttp模块，并且将其赋值个本地http变量。

之后调用http模块提供的函数:createSever()，该函数返回一个对象，该对象有一个叫做listen()的方法，此方法有一个数值参数，制定该HTTP服务器监听的端口号。

考验同志们的JavaScript水平的时候到了！createSever()中有一个参数，该参数为一个匿名函数，也就是说，在这里我们通过函数来进行传参。

>
>
JavaScript中，函数和其他变量一样都是可以被传递的。
>

### 函数传递 ###

我们来复习下JavaScript函数的传参的知识：

举个板栗，哦不！举个例子：

    function say(word){
        console.log(word);
    }

    function exeucte(someFunction,value){
        someFunction(value);
    }


    exeucte(say,'hello');

    // -------->>>>> hello

我们预定义的say函数作为一个参数传递给了exeucte函数，这里返回的不是say的返回值，而是say本身！

这样一来，say就变成了exeucte中的本地变量someFunction，exeucte可以通过调用someFunction()(带括号的形式)来使用say函数。

>
>
函数名带括号与不带括号的区别：带括号则是函数的执行结果，也就是得到该函数返回值，不带括号则是得到函数本身，而不是该函数已经执行完毕后得到的结果，不带括号相当于就是一个指针指向该函数，在需要时在执行这个函数。
>

我们可以把一个代表函数自身的函数名作为变量传递，但不一定非得这样“先定义，在传递”，我们甚至可以直接在另一个函数的括号中直接定义并传递这个函数：

    function execute(someFunction,value){
        someFunction(value);
    };

    execute(function(word){
        console.log(word)
    },"hello");


这样不经起名字就可以直接把一个函数传递给另一个函数了，这个没有名字的函数我们称之为匿名函数。


>
>
在JavaScript中，一个函数可以作为另一个函数接收一个参数。我们可以先定义一个函数，然后传递，也可以在传递参数的地方直接定义函数。
>


### 函数传递如何让HTTP服务器工作 ###

啊哈，钢铁是这么炼成的。

    // server.js  @version $2.0$
    var http = require('http');
    function onRequest(request,response){
        response.writeHead(200,{'Content-Type':"text/plain"});
        response.write("Hello,Node World!");
        response.end();
    }
    http.createServer(onRequest).listen(8888);


NodeJS是事件驱动的。

当我们调用createServer方法时，当然不只是想要一个监听端口的服务器，我们还想要他在服务器收到一个HTTP请求时做点别的。

但这却是异步的，请求任何时候都有可能到达，而我们的服务器却是在一个单线程中。在NodeJS程序中，当一个新的请求到达8888端口是，我们该如何控制流程呢？

没错，NodeJS事件驱动的设计该登场了。

此处我们创建了服务器(http)，并且向创建它的方法(createServer)传递了一个函数(onRequest)，无论何时服务器(http)收到一个请求，这个函数(onRequest)就会被调用。

我们并不知道这件事情(即请求request)什么时候放生，但是我们现在现在有一个处理请求的地方：他就是我们传递过去的那个函数(onRequest)，至于他是匿名函数还是预定义的函数则是无关要紧。


这就是传说中的*回调*了。我们给某个方法(createServer)传递了一个函数(onRequest)，这个方法在有相应的事件(request)发生时调用这个函数(onRequest)来进行回调。


怎样证明在创建完服务器之后，即使没有HTTP请求进来，我们的回调函数也没有被调用的情况下，代码继续邮箱呢？

    //server.js  @version $3.0$
    /*------------------------------------------*
     *当运行node server.js时，http服务器启动，命令行马上输出Server has started
     *当向服务器发送请求时(在浏览器中访问http://localhost:8888/)时，回调函数触发，
     *Request received才会在命令行中打印
     *------------------------------------------*/

    var http = require('http');

    function onRequest(request, response) {
        console.log('Request received');// 回调函数触发(被调用)时打印
        response.writeHead(200, { 'Content-Type': "text/plain" });
        response.write("Hello,Node World!");
        response.end();
    }
    http.createServer(onRequest).listen(8888);
    // 仅仅启动了HTTP服务器即打印，而无请求进来时的测试
    console.log('Server has started');

注意，在onRequest(即我们的回调函数)触发的地方，使用了console.log()输出了一段文本(console.log('Request received'))，在HTTP服务器开始工作之后，也输出了一段文本(console.log('Server has started');)，运行node server.js来测试一下：

命令行窗口会马上输出Server has started(也就是说我们执行node server.js)时就是启动了我们创建的http服务器。此时我们并未打开浏览器访问[http://localhost:8888/](http://localhost:8888/)，命令行窗口中也仅输出Server has started，如下图所示：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_1.png" align="center"></p>
</center>

是时候了！我们打开浏览器访问[http://localhost:8888/](http://localhost:8888/)。
看到了什么，浏览器页面上的内容正是我们的回调函数写的内容"Hello,Node World!"，在
看我们的命令行窗口，如图所示：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_2.png" align="center"></p>
</center>

窗口中输出了Request received！额，我这里是因为我刷新了三次，所以输出了三条。
这说明了什么？说明，请求发生了(访问localhost:8888)，请求发生后回调函数被触发了(命令行窗口输出信息，浏览器输出响应内容)，回调函数对请求作出了回应，也就是说回调函数就是此处的请求处理程序。


### 服务器如何处理请求 ###


请求发生后，回调函数对请求作出了回应，也就是说回调函数就是此处的请求处理程序。

#### 回调函数 ####

当回调启动，onRequest()函数被触发，此时有两个参数被传入，request和response
。
他们是对象，可以使用它们的方法来处理HTTP请求的细节，并且响应请求(比如向发送请求的浏览器发回一些东西)。

>
>
对象由属性和方法组成，挂载在对象上的函数即为该对象的方法。
>

so！我们的onRequest函数中的代码是：当收到请求时，使用response.writeHead()函数发送一个HTTP状态200和HTTP头的内容类型(content-type)，使用response.write()函数在HTTP相应请求主体发送文本"Hello,Node World!"。

最后调用response.end()完成响应。到目前为止，我们暂且不关心请求的细节，所以也就没有使用到request对象。
