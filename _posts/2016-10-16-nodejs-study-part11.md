---
layout: post
title: NodeJs初成长(一)之nodejs入门(4)
author: beyondouyuan
date: 2016-10-16
categories: blog
tags: [NodeJs,nodejs入门]
node: node
description: 锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。沧海月明珠有泪，蓝田日暖玉生烟。此情可待成追忆？只是当时已惘然。

---

###  写在前面 ###

 &&1 函数式编程

将函数作为参数传递并不仅仅出于技术上的考量，对于软件设计来说，这其实是个哲学问题，想想看：在index文件中，我们可以将router对象传递过去([NodeJs初成长(一)之nodejs入门(3)](https://beyondouyuan.github.io/blog/2016/10/15/nodejs-study-part10/)中的server.start(router.route);)，服务器随后可以调用这个对象的route函数(route(pathname);)。

就像这样，我们传递一个东西，然后服务器利用这个东西完成了一些事情(此时的route函数暂时是输出请求的URL路径)。

嘿路由，能帮我把这个路由一下么？

但是服务器其实并不需要这样的东西，他只需要把事情做完即可，其实为了把事情做完，你根本不需要东西，你需要的是动作。也就是说，你不需要名词，你需要动词。


### 路由给真正的请求处理程序 ###

我们在[NodeJs初成长(一)之nodejs入门(3)](https://beyondouyuan.github.io/blog/2016/10/15/nodejs-study-part10/)中将路由以及在路由中做的事情传递给了服务器，实际上我们并不在路由或者服务器里做具体的*业务逻辑*实现，服务器和路由只做逻辑上的实现，具体的*业务逻辑*实现是由真正的请求处理程序来做。


现在我们的HTTP服务器和请求路由模块已经如我们所愿，可以通过函数传递实现互相交流，好戏才即将开始。


路由，顾名思义，是指我们要针对不同的URL有不同的处理方式。例如处理/start的*业务逻辑*就应该和处理/upload的不同。

在现在的实现下，路由过程会在路由模块中“结束”，并且路由模块并不是真正针对请求“采取行动”(即所谓的请求业务处理)的模块，针对请求采取行动的是“请求处理程序”。。

>
>
我们需要将业务和逻辑解耦开来。----------《JavaScript最佳实践》
>

这里我们暂时把作为路由目标的函数称为请求处理程序。请求处理程序不就绪，路由就没有任何意义了。


我们在JavaScript的dom操作中有这样的函数：

    function doClick($id){
        $id.click(function(){
            $id.css('color','red');
        });
    }

我们可以简单的把以上函数做这样的分析，click()是$id触发的某个事件(启动服务器，事件驱动)，click()中的匿名函数就是请求处理函数(采取行动处理实际的业务即改变颜色是该匿名函数在做而不是click()在做)。doClick函数其实就相当于路由，将不同的请求($id)传递给click()函数，那么click()就相当于是服务器了。当然这个看上去很牵强，但是是我个人的理解的概括了。

以上看上去还是不大分的开来，我们可以稍微改一下代码：

    function doClick($id){
        $id.click(function(){
            callback($(this));
        });
    }

    function callback($id){
        $id.css('color','red');
    }

    windows.onload = function(){
        doClick('#id');
    }

有点像了吧？

主文件index中启动服务器sercer.start(router.route)-->windows.onload = function(),

click()触发事件(启动服务器)，callback()采取行动处理业务。

话归正题，我们接着为应用添加新的部件，所以我们需要加入新的模块(应用由多个部件组成，启动应用则需启动组成应用的各个模块)。

创建requestHandler模块(直觉的翻译就是请求处理啦)，并对于每一个请求处理程序添加一个占位用函数，随后将这些函数作为模块的方法导出：

    function start(){
        console.log("Request handler 'start' was called");
    }

    function upload(){
        console.log("Request handler 'upload' was called");   
    }

    exports.start = start;
    exports.upload = upload;

这样我们既可以把请求处理程序和路由模块连接起来，让路由“右路可选”。

>
>
一个文件可以是只有一个模块，也可以有多个模块，一个模块可以是只有一个函数或者方法，也可以是由多个子模块组成。
>

以上代码可知，我们的处理程序模块包含了两个处理程序方法，每个方法处理不同的请求响应，虽然此时他们仅仅只是个占位函数...

这里我们得做个决定：是将requestHandlers模块硬编码到路由中使用还是添加一点依赖注入？虽然与其他模式一样，依赖注入不应该仅仅为使用而使用，但目下，使用依赖注入可以让路由和请求处理程序之间的耦合更加松散(解耦)，因此也能让路由的重用度更高。

所以这个决定一点也不艰难。

这意味着我们得将请求处理程序从服务器传递到路由中，但感觉好像更加离谱了，我们一路将这对请求处理程序从我们的主文件传递到服务器中，再将之从服务器中传递到路由。

那么我们该怎样更优雅的传递这些请求处理程序呢？虽然目前我们只有2个处理程序，到了实际应用中，请求处理程序可能会有成千上万个，难道每次有一个新的URL或者请求处理时，都要为了在路由里完成请求到处理程序的映射而反复折腾，那不如选择狗带呢！除此外，在路由中写下一大堆的if request == x them call handler y，那也太丑了。我们需要优雅。

再想想，在以往JavaScript中，有一大堆东西，每个都要映射到一个字符串(即请求的URL)上？似乎关联数组(associative arry)能完美胜任，哎哟，不错哦！

虽然JavaScript没有真正的关联数组，但是管你带甲百万，吾有上将——对象！


>
>
在C++或C#中，当我们谈到对象，指的是类或者结构体的实例。对象根据他们实例化的模板(就是所谓的类)，会拥有不同的属性和方法。但在JavaScript里对象不是这个概念。在 JavaScript中，对象就是一个键/值对的集合—— 你可以把JavaScript的对象想象成一个键为字符串类型的字典。
>

但若是JavaScript的对象仅仅是键/值对，他又怎会拥有方法？图样，JavaScript对象的值可以是字符串、数字或者...函数！

回到代码，现在我们已经确定将一系列请求处理程序通过一个对象来传递，并且需要松散耦合的方式将这个对象注入到route()函数中。

那么先将这个对象引入到主文件index.js中：

    // 扩展index.js
    // index.js  @version $3.0$
    var server = require('./server');
    var router = require('./router');
    var requestHandlers = require('./requestHandlers');

    // 创建一个空对象
    // 通过该对象传递处理程序
    // 将不同的url[对象中的属性]映射到相同的请求处理程序上

    var handle = {}
    // 将处理程序模块的方法传入到对象中以便后期调用
    handle["/"] = requestHandlers.start;
    handle["/start"] = requestHandlers.start;
    handle["/upload"] = requestHandlers.upload;
    // 调用服务器模块中的功能
    // 功能已被导出在start()函数中
    // 故调用start()函数也即是调用服务器的功能
    server.start(router.route,handle);


正如所见，将不同的URL映射到相同的请求处理程序上是很容易的：只要在对象中添加一个键为"/"的属性，对应requestHandlers.start即可，这样我们就可以干净简洁地配置/start和/的请求都交由start这一处理程序处理。

完成了对象定义后，我们将它作为额外的参数传递给服务器，为此将server.js代码修改如下：

    // server.js  @version $5.0$
    // 更改扩展start()函数，接收对象映射
    var http = require('http');
    var url = require('url');

    function start(route,handle) {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            // 打印请求路径
            console.log('Request for ' + pathname + ' received!');
            // 调用路由模块
            // 将请求的url传参给route方法
            route(handle,pathname);
            response.writeHead(200, { 'content-Type': 'text/plain' });
            response.write('Hello,NosdJs World!');
            response.end();
        }

        http.createServer(onRequest).listen(8888);
        console.log('Server has start!');
    }
    // 导出函数
    exports.start = start;


如此处理后，我们就在start()函数里添加了handle参数，并且将handle对象作为第一个参数传递给了route()回调函数。

这样子我们通过将请求处理程序添加到一个对象中，然后通过传递这个对象作为参数，而无需每次都把每一个处理程序逐个传递，就实现了我们的优雅传递。

当然，router.js也要做相应的修改代码才可，如下：

    // router.js  @version $2.0$
    // 扩展1路由模块

    function route(handle,pathname){
        console.log("About to route a request for " + pathname);
        if (typeof handle[pathname] == 'function') {
            handle[pathname]();
        } else {
            console.log("No request handle found for " + pathname);
        }
    }

    // 导出模块
    exports.route = route;


通过以上代码，我们首先检查给定的路径对应的请求处理程序是否存在，若存在，直接调用相应的函数。我们可以用从关联数组中获取元素的一样方式从传递的对象(即handle)中获取请求处理程序(这些请求处理程序即使handle对象中的元素成员)。

有了这些代码，我们就可以把服务器、路由和请求处理程序联系在一起了。现在我们在浏览器中访问[http://localhost:8888/start](http://localhost:8888/start)，一下日志可以说明系统调用了正确的请求处理程序：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_6.png" align="center"></p>
</center>

是的，你没看错，只要998！只要998！只要998！
命令行依次输出了4条日志：

    Server has start!

    Request for /start received!

    About to route a request for /start

    Request handler 'start' was called


并且，当我们在浏览器中打开的是[http://localhost:8888/](http://localhost:8888/)时，得到的结果也是一模一样的，因为我们在handle对象中对handle["/"] = requestHandlers.start;和handle["/start"] = requestHandlers.start;的赋值是相同的。
