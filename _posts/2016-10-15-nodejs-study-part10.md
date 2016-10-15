---
layout: post
title: NodeJs初成长(一)之nodejs入门(3)
author: beyondouyuan
date: 2016-10-15
categories: blog
tags: [NodeJs,nodejs入门]
node: node
description: 客来何有？草草三杯酒。一醉万缘空，莫贪伊、金印如斗。病翁老矣，谁共赋归来？芟垅麦，网溪鱼，未落他人后。
---

###  写在前面 ###

以前在javaScript中，我们会提使用命名空间，后来，命名空间落后了，我们开始向模块化冲锋。NodeJS就是JavaScript模块化的一个极好的诠释。


那么接着[NodeJs初成长(一)之nodejs入门(2)](https://beyondouyuan.github.io/blog/2016/10/14/nodejs-study-part9/)继续。


### 服务器模块 ###

到目前为止，在server.js文件中有一个基础的HTTP服务器代码，之前已提到过，一般以index.js作为主文件去调用应用的其他模块(如server.js中的HTTP服务器模块)来引号和启动应用。

那么怎样把server.js变成一个真正的NodeJS模块并可以被主文件index.js使用呢？
其实，在这之前我们就已经在代码中使用了模块了：

    var http = require('http');
    ...
    http.createServer(...);

NodeJS中自带了一个叫做"http"的模块，我们在我们的代码中请求他，并且把返回值付给一个本地变量，这样，本地变量就变成了一个拥有所有http模块所提供的共有方法的对象。

我们已懂得使用NodeJS内部模块，那就来学习下怎样创建并使用自己的模块吧。

>
>
把某段代码变成模块意味着需要把我们希望提供起功能的部分导出到请求这个模块的脚本。
>

现在我们的HTTP服务器需要导出的功能很简单，因为请求服务器模块的脚本(index.js)仅仅是需要启动服务器而已。

我们把我们的服务器脚本放到一个叫做start的函数里，然后导出这个函数：

    //server.js  @version $4.0$

    /*------------------------------------------*
     *将某段代码变成模块：
     *则需要将提供其功能的部分导出到请求这个模块的脚本
     *------------------------------------------*/

    // 将服务器脚本放入到函数中，然后导出该函数

    var http = require('http');

    function start() {
        function onRequest(request, response) {
            // 回调函数触发(被调用)时打印
            console.log('Request received!');
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.write('Hello,World!');
            response.end();
        }

        http.createServer(onRequest).listen(8888);
        console.log('Server has start!');
    }
    // 导出函数
    exports.start = start;


这之后，就可以创建主文件index.js并在其中启动HTTP，虽然服务器代码还在server.js中。

创建index.js，并写入一下内容：

    // index.js  @version $1.0$
    // 请求服务器模块
    // 调用模块并赋值给本地变量，则模块(server.js)中已导出的函数(start)即可被该本地变量使用

    var server = require('./server');
    server.start();

到命令行窗口执行index.js

    node index.js

命令行中输出的信息和我们之前直接运行server.js文件的时候是一模一样的，在浏览器中，是的，结果正如所料，依然和直接执行server.js文件时候是一样的，这也就是说，在index.js文件中我们通过：

    var server = require('./server');
    server.start();

取得了server.js模块中的代码(功能)。这就是说，现在开始我们可以把我们的应用的不同部分放入不同的文件里，并通过生成模块的方式将它们连接到一起。


到此为止了么？不，我们得做点好玩的事情。

目前我们仍然只拥有整个应用的最初部分，我们可以接收HTTP请求，但是我们还得做点别的————对于不同的URL请求，服务器有不同的反应。

对于一个非常简单的应用而言，可以直接在回调函数onRequest()中做此事。但是，我们不应该在程序代码写成硬编码写死，我们应该加入一些抽象的元素。

处理不同的HTTP请求在我们的代码中是一个不同的部分，叫做“路由选择”————那么，创建一个*路由*模块。

### 请求路由 ###

我们需要为路由提供请求的URL和其他需要的GET以及POST参数，随后路由需要根据这些参数来执行相应的代码(这里的“代码”指对应整个应用的第三部分：一系列在接收到请求时真正工作的处理程序)。


因此，我们需要查看HTTP请求，从HTTP请求中提取出请求的URL以及GET/POST参数。


我们所需要的所有参数都会包含在request对象中(终于轮到你，嘿嘿嘿)，该对象作为onRequest()回调函数的第一个参数传递，为了解析这些数据，我们还需要一些额外的NodeJS模块：url和querystring模块。


<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_3.png" align="center"></p>
</center>


我们将server.js修改一下，给onRequest()函数加上一些逻辑，用来找出浏览器请求的URL路径：


    //server.js  @version $5.0$
    var http = require('http');
    var url = require('url');

    function start() {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            // 打印请求路径
            console.log('Request for ' + pathname + ' received!');
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.write('Hello,World!');
            response.end();
        }

        http.createServer(onRequest).listen(8888);
        console.log('Server has started!');
    }
    // 导出函数
    exports.start = start;


运行index.js，然后在浏览器中刷新一下，回到命令行查看，我们会看到如下：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_4.png" align="center"></p>
</center>


HTTP服务器启动时，命令行首先打印出信息"Server has started!"，当我们刷新浏览器(也即是发起请求时)，命令行窗口打印出两条信息"Request for / received!"和"
Request for /favicon.ico received!"，第二条favicon.ico是浏览器默认的请求，我们不做理会，这两条信息中的斜杠"/"就是我们的pathname(http://localhost:8888是根目录，所以只有打印出一条斜杠)。


ok！我们的应用现在可以通过请求的URL路径来区别不同的请求了————这使得我们得以使用路由(目前还没动工)来将请求以URL路径为基准映射到处理程序上(此处回调函数onRequest()即是处理处理程序)。


在我们所要构建的应用中，这意味着来自/start和/upload的请求可以使用不同的代码来处理。

那么，开始编写路由了，创建一个新文件，名为router.js，添加一下内容：

    // 路由模块
    // router.js  @version $1.0$
    function route(pathname){
        console.log("About to route a request for " + pathname);
    }

    // 导出模块
    exports.route = route;


此时这段代码什么也没有做，在添加更多逻辑之前，首先看看如何把路由和服务器整合起来。

我们的服务器应当知道路由的存在并加以有效利用。我们当然可以通过硬编码的方式将这一依赖绑定到服务器上，但是，经验告诉我们，这样做会非常痛苦，因为之后稍有改动就是牵一发而动全身，因此我们将使用依赖注入的方式较松散地添加路由模块

>
> - [Martin Fowlers关于依赖注入的大作](http://itdocument.com/663560297/)
>
> - [JavaScript里的依赖注入](http://www.ituring.com.cn/article/68377)
> - [用javascript代码通俗的解释一下什么叫依赖注入？](https://www.zhihu.com/question/22463207)
> - [关于JavaScript依赖注入：你应该了解的那些事](http://www.html-js.com/article/A-day-to-learn-about-JavaScript-JavaScript-dependency-injection-you-should-know-that)
> - [理解JavaScript中的依赖注入](http://www.html-js.com/article/A-day-to-learn-JavaScript-understand-dependency-injection-in-JavaScript)
> 
>


首先，扩展一下服务器的start()函数，以便将路由函数若为参数传递过去：

    // 更改扩展start()函数
    // server.js  @version $5.0$

    var http = require('http');
    var url = require('url');

    function start(route) {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            // 打印请求路径
            console.log('Request for ' + pathname + ' received!');
            // 传递路由函数
            // 将请求的url传参给route方法
            route(pathname);
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.write('Hello,World!');
            response.end();
        }

        http.createServer(onRequest).listen(8888);
        console.log('Server has start!');
    }
    // 导出函数
    exports.start = start;

同时，相应地扩展index,js使得路由函数可以被注入到服务器：

    // 扩展index.js
    // index.js  @version $2.0$

    var server = require('./server');
    var router = require('./router');

    // 调用服务器模块中的功能
    // 功能已被导出在start()函数中
    // 故调用start()函数也即是调用服务器的功能
    // router.route与server.start()同理

    // 以函数传参的方式将路由函数注入到服务器
    server.start(router.route);


到这里，我们传递的函数(router.route)依旧什么也没有做。

若是此时启动应用(node index.js)，随后请求一个URL，你将会看到应用输出相应的信息，这表明HTTP服务器已经在使用路由模块了，并会将请求的路径传递给路由(route(pathname);由此传入)：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_5.png" align="center"></p>
</center>

上图，命令行窗口以此输出三条信息：

1.Server has start! ----->>>>启动服务器时输出(即server.start()启动时)

2.Request for / received! ----->>>>回调函数触发输出即(server.start()内的onRequest方法被触发)

3.About to route a request for / ----->>>>经服务器传递入router时输出(route(pathname);)。

顺序：index.js---->server.js---->>start()--->>>onRequest()---->>>>route()


1.启动index.js文件，由于index.js主文件调用了server.js模块的start对象，所以启动index.js也即是启动了server.js文件即启动了服务器(输出Server has start!)。

2.start对象被执行，按JavaScript代码从上至下执行顺讯运行，start对象内的方法onRequest()方法被执行(输出Request for / received!)。

3.ndex.js主文件调用了router.js模块的route对象，所以可以在index.js中调用start对象时将router.js的route对象传递给server.js的start对象(server.start(router.route))，route对象在onRequest()方法中按顺序被执行到，并且从onRequest()方法中把url传递给了route()对象(输出About to route a request for /)。


以上输出已经去掉了比较烦人的/favicon.ico请求相关的部分。
