---
layout: post
title: NodeJs初成长(一)之nodejs入门(5)
author: beyondouyuan
date: 2016-10-16
categories: blog
tags: [NodeJs]
node: node
description: 桃杏依稀香暗度，谁在秋千，笑里轻轻语？一寸相思千万缕，人间没个安排处。

---

###  写在前面 ###

来了，爱了，为他写下了"Hello,World"，神了，作为一个程序员，写下"Hello,World"是至高无上的荣耀。但永远只是"Hello,World"未免太过无趣，总得更加刻骨铭心。


还要注意的是，此时浏览器发出请求后获得并显示的"Hello,World"信息仍然是来自server.js文件中的onRequest函数。


其实“处理请求”说白了就是“对请求作出响应”，因此，我们需要让请求处理程序能够像onRequest函数那样可以和浏览器进行“对话”。


### 让请求处理程序作出响应 ###

#### 不好的实现方式 ####

让请求处理程序通过onRequest函数直接返回(return())他们想要展示给用户的信息是一种非常不靠谱的实现方式。我们暂且就已这种方式去实现，看看为何说这是一种不好的实现方式。

让我们从使请求处理程序返回需要在浏览器中显示的信息开始。需要将requestHandlers.js修改为如下形式：

    // handle.js  @version $2.0$

    // 扩展处理程序模块
    function start(){
        // 处理程序start()被调用
        console.log("Request handler 'start' was called!");
        // 将信息返回给路由
        // 因为请求处理程序被作为参数传递给路由
        // 所以实际上处理程序的返回信息就是返回给接收了他的函数(路由)
        return "Hello,Start!";
    }

    function upload(){
        // 上传趋利程序被调用
            console.log("Request handler 'upload' was called!");
            return "Hello,Upload";
    }

    // 将函数作为模块的方法导出
    exports.start = start;
    exports.upload = upload;

同样的，请求路由需要将请求处理程序返回给他的信息返回给服务器，因此，需要将路由修改为如下形式：


    // router.js  @version $3.0$
    // 扩展2路由模块

    function route(handle,pathname){
        console.log("About to route a request for " + pathname);
        if (typeof handle[pathname] == 'function') {
            // 将请求处理程序返回的信息返回给路由(自己)的信息返回给服务器
            return handle[pathname]();
        } else {
            console.log("No request handle found for " + pathname);
            // 当请求无法路由时，返回一些错误提示信息
            return "404 Not found";
        }
    }

    // 导出模块
    exports.route = route;


最后，还需要对server.js进行重构，以使得他能够将请求处理程序通过路由返回的内容响应给浏览器，如下所示：

    // server.js  @version $6.0$
    // 更改扩展start()函数，接收返回信息
    var http = require('http');
    var url = require('url');

    function start(route,handle) {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            // 打印请求路径
            console.log('Request for ' + pathname + ' received!');
            // 调用路由模块
            // 将请求的url传参给route方法
            // route(handle,pathname);
            response.writeHead(200, { 'content-Type': 'text/plain' });
            var content = route(handle,pathname);
            response.write(content);
            response.end();
        }

        http.createServer(onRequest).listen(8888);
        console.log('Server has start!');
    }
    // 导出函数
    exports.start = start;


若此时我们运行重构后的应用，一般都会工作的很好，请求[http://localhost:8888/start](http://localhost:8888/start)浏览器会输出"Hello,Start"，请求[http://localhost:8888/upload](http://localhost:8888/upload)浏览器会输出"Hello,Upload"，请求[http://localhost:8888/bar](http://localhost:8888/bar)会输出"404 Not found"。


一切看起来都很ok哦，那么为什么还说他不是一种很好的实现方式呢？问题出在哪里了呢？

简单的说就是：当未来有请求处理程序需要进行非阻塞的操作的时候，我们的应用就“挂了”。

### 阻塞与非阻塞 ###

正如之前所提，当在请求处理程序中包括非阻塞操作时就会出现问题。

#### 阻塞操作 ####

当在请求处理程序中加入阻塞操作时会发生什么？


我们修改下start请求处理程序，我们让他等待10秒后再返回"Hello,Start"，在JavaScript中没有像sleep()这样的操作，没关系，小小的Hack来模拟实现即可。

修改requestHandlers.js，代码如下：


    // handle.js  @version $3.0$
    // 加入阻塞操作
    // 扩展处理程序模块

    function start(){
        // 处理程序start()被调用
        console.log("Request handler 'start' was called!");
        function sleep(milliSeconds){
            var startTime = new Date().getTime();
            while (new Date().getTime() < startTime + milliSeconds);
        }
        sleep(10000)

        return "Hello,Start!";
    }

    function upload(){
        // 上传趋利程序被调用
            console.log("Request handler 'upload' was called!");
            return "Hello,Upload";
    }

    // 将函数作为模块的方法导出
    // 当start()被调用时，NodeJS会等待10秒之后才会返回"Hello Start"。
    exports.start = start;
    // 当调用upload()会立刻返回
    exports.upload = upload;

    // 将函数作为模块的方法导出
    // 当start()被调用时，NodeJS会等待10秒之后才会返回"Hello Start"。
    exports.start = start;
    // 当调用upload()会立刻返回
    exports.upload = upload;


测试一下，为了看到效果，首先打开两个浏览器窗口或者标签页，在第一个窗口地址栏中输入[http:/localhost:8888/start](http:/localhost:8888/start)，慢慢！！只是让你输入而已，没有让你按下"Enter"按键，

在第二个浏览器窗口地址输入[http:/localhost:8888/upload](http:/localhost:8888/upload)，机智如你，也暂且不要按下"Enter"按键。

ok！好戏来了，在第一个窗口中("/start")按下回车，快速切换到第二个窗口中("/upload")按下快捷键。

注意，发生了什么：/start URL加载发了10秒，这和我们的预期一样，但是，/upload URL居然也花了10秒！What the hell!他的请求处理程序中并没有类似sleep()这样的操作啊！


Why!原因就是start()包含了阻塞操作，形象的说就是“他阻塞了所有其他的处理工作”，他是一块石头，把水管堵塞住了，那后面的水还怎么流？乖乖找水管工超级马里奥吧。

这显然是一个大问题，因为Node一向是这样标榜自己的：“在Node中除了代码，所有的一切都是并行执行的”。骗纸！

node当然没有骗我们！

NodeJS可以在不新增额外线程的情况下，依然可以对人物进行并行处理——NodeJS是单线程的。他通过事件轮询(event loop)来实现并行操作，对此，我们应该充分利用这一点——尽可能的避免阻塞操作，取而代之，多使用非阻塞操作。

要使用非阻塞操作，需要借助吊炸天的回调，通过将函数作为参数传递给其他需要花时间做处理的函数(比方说，休眠10秒，或者查询数据库，又或者是进行大量的计算)。


对于NodeJS来说，他是这样处理的：“嘿！probablyExpensiveFunction()”[这里指的就是需要花费时间处理的函数]，你继续处理你的事情，我(NodeJS线程)先不等你了，我继续去处理你后面的代码，请你提供一个callbackFunction()，等你处理完成之后我回去调用该回调函数的，谢谢。

>
>
大爷！我找马冬梅！请问楼上323是马冬梅家吗?马冬什么？马冬梅！马什么梅？马冬梅！什么东梅？行，大爷您继续凉快着吧！好咧！
>


得！那就用非阻塞操作吧！人总是会犯错的，先看看一种错误的非阻塞操作方式，我们拿start请求处理程序来“开刀”。修改代码如下：

    // handle.js  @version $4.0$
    // 测试非阻塞操作
    // 引入child_process，以实现非阻塞操作：exec()

    var exec = require('child_process').exec;

    function start(){
        // 处理程序start()被调用
        console.log("Request handler 'start' was called!");
        var content = 'empty';
        exec('ls-lah',function(error,stdout,stderr){
            content = stdout
        });
        return content;
    }

    function upload(){
        // 上传趋利程序被调用
            console.log("Request handler 'upload' was called!");
            return "Hello,Upload";
    }

    // 将函数作为模块的方法导出
    exports.start = start;
    exports.upload = upload;

exce()做了什么？他从NodeJS来执行一个shell命令。

以上例子中，我们用它来获取当前目录下所有的文件(ls-lah)，然后，当/star URL的时候将文件信息输出到浏览器中。

start()创建一个新的变量content(初始信息为'empty')，执行"ls-lah"命令，将结果赋值给content，最后将content返回。


启动浏览器，访问[http://localhost:8888/start](http://localhost:8888/start)。

啊噢，浏览器的内容只有"empty"！

没错，exec()在非阻塞这块发挥了神奇的作用，有了它，我们可以执行非常耗时的shell操作而无需迫使我们的应用停下来等待该shell操作。

然而，裤子都脱了，你就让我看这个？好，那接着看吧！

我们修正下这个问题，此过程我们同样看看为什么当前的这种方式不起作用。


问题就在于，为了进行非阻塞工作，exec()使用了回调函数。

在以上例子中，该回调函数就是作为第二个参数传递给exec()的匿名函数：

    function(error,stdout,stderr){
        content = stdout;
    }


我们发现宝藏了！哦，是发现了问题根源所在了：我们的代码是同步执行的，这就意味着在调用exec()之后，NodeJS会立即返回执行return content；这个时候，content依然是"empty"，因为传递给exec()的回调函数还未执行到——因为exec()的操作时异步的。


为了让效果更加明显，我们用一个更加耗时的"find/"命令。

然而，即使我们在请求处理程序中把"ls=lah"换成了"find/"，当在浏览器中打开/start URL时，依然能够立即获得HTTP响应——很显然，当exec()在后台执行时，NodeJS自身会继续执行后面的代码。并且我们这里假设传递给exec()的回调函数，只会在"find/"命令行执行完成之后才会被调用。

那究竟怎么才能将当前目录下的文件列表显示出来呢？

那就脱离苦海，离开这种不好的实现方式，以正确的姿势让请求处理程序对浏览器请求作出响应。


### 以非阻塞操作进行请求响应 ###


正确的方式——一般正确的方式通常并不简单哦！


管他带甲百万——吾有上将——函数传递。


到目前为止，我们的应用已经可以通过应用各层之间传递值的方式(请求处理程序->请求路由->>服务器)将请求处理程序返回的内容(请求处理程序最终要显示给用户的内容)传递给HTTP服务器。

现在，我们来点新花样：相对采用将内容传递给服务器的方式，这次采用将服务“传递”给内容的范式。从实践角度来说，就是将response对象(从服务器的回调函数onResquest()获取)通过请求路由(route)传递给请求处理程序(requestHandler模块内的方法)。随后，处理程序就可以采用该对象上的函数来对请求作出响应。


一步一个脚印，先从server.js开始：


    // server.js  @version $7.0$
    // 更改扩展start()函数，接收返回信息

    var http = require('http');
    var url = require('url');

    function start(route,handle) {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            // 打印请求路径
            console.log('Request for ' + pathname + ' received!');
            // 调用路由模块
            // 将请求的url传参给route方法
            // respone由route完成
            route(handle,pathname,response);
        }

        http.createServer(onRequest).listen(8888);
        console.log('Server has start!');
    }
    // 导出函数
    exports.start = start;


以上代码，相对此前从route()函数获取返回值的做法，这次我们将response对象作为第三个参数传递给route()函数，并且，将onRequest()处理程序中所有有关response的函数调用都去除(只作为传递者，而不对所接收的参数做响应处理)，我们希望这部分工作让route()函数来完成。

不在其位，不谋其政。

修改router.js，让route函数接收response对象并进行相应的处理，代码如下：

    // router.js  @version $4.0$
    // 扩展3路由模块
    // route()函数接收了response对象
    // 然而，他只是个中转站，他会将该对象最终传递给handle[pathname](即请求处理程序)
    // 当然，如果没有请求处理程序，那么他就自己上了！

    function route(handle,pathname,response){
        console.log("About to route a request for " + pathname);
        if (typeof handle[pathname] == 'function') {
            return handle[pathname](response);
        } else {
            console.log("No request handle found for " + pathname);
            response.writeHead(404,{'content-Type':'text/plain'})
            response.write("404 Not Found");
            response.end();
        }
    }

    // 导出模块
    exports.route = route;

同样的模式，相对此前从请求处理程序中获取返回值，这次取而代之的是接着传递response对象。

当没有对应的请求处理程序处理，直接返回"404"错误。

最后就是requestHandler.js了，被踢来踢去的response参数最终归宿就是对应的请求处理程序的，那么代码修改程序如下：

    // handle.js  @version $5.0$
    // 扩展处理程序模块
    // 请求处理程序从请求路由中接收请求参数，并对请求作出响应

    var exec = require('child_process').exec;

    function start(response){
        // 处理程序start()被调用
        console.log("Request handler 'start' was called!");
        exec('ls-lah',function(error,stdout,stderr){
            response.writeHead(200,{'content-Type':'text/plain'});
            response.write(stdout);
            response.end();
        })
    }

    function upload(response){
        // 上传趋利程序被调用
            console.log("Request handler 'upload' was called!");
            response.writeHead(200,{'content-Type':'text/plain'});
            response.write("Hello Upload");
            response.end();
    }

    // 将函数作为模块的方法导出
    exports.start = start;
    exports.upload = upload;
    // 请求处理程序需要接收response参数，以对请求作出直接的响应



start处理程序在exec()的匿名函数中做请求响应的操作(response.write()..)，而upload处理程序仍然是简单的回复"Hello World"，只是这次是使用response对象。

当我们再次启动node index.js，一起都会工作良好。

如果想要证明/start处理程序中耗时的操作不会阻塞对/upload请求作出立即响应的话，
可以将requestHandlers.js修改为如下形式：


    // handle.js  @version $6.0$
    var exec = require("child_process").exec;

    function start(response) {
        console.log("Request handler 'start' was called.");
        exec("find /", { timeout: 10000, maxBuffer: 20000 * 1024 },
            function(error, stdout, stderr) {
                response.writeHead(200, { "Content-Type": "text/plain" });
                response.write(stdout);
                response.end();
            });
    }

    function upload(response) {
        console.log("Request handler 'upload' was called.");
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write("Hello World");
        response.end();
    }
    exports.start = start;
    exports.upload = upload;


这样一来，当请求[http://localhost:8888/start](http://localhost:8888/start)的时候，会花10秒钟的时间才载入，而当请求[http://localhost:8888/upload](http://localhost:8888/upload)的时候，会立即响应，纵然这个时候/start响应还在处理中。

是的，毫无影响，洒洒水！
