---
layout: post
title: NodeJs初成长(一)之nodejs入门(6)
author: beyondouyuan
date: 2016-10-18
categories: blog
tags: [NodeJs,nodejs入门]
node: node
description: 韶华不为少年留。恨悠悠，几时休，飞絮落花时候，一登楼。便做春江都是泪，流不尽，许多愁。

---

### 写在前面 ###

多看不懂，多说无用，程序总要动手才写的出，语言练习才会熟悉，开发靠项目。废话不多说，直接上代码！

按此前小目标：用户选择一个文件，上传该文件，然后再浏览器中看到上传的文件。

诸葛亮下来战书，约我等明日决战！如何对敌？如何对敌？如何对敌？

&&1 功能实现：

1.处理POST请求(非文件上传)。

2.使用NodeJS文件上传外部模块。


### 处理POST请求 ###

考虑一下一个简单的需求例子的实现：我们现实一个文本区(textarea)供用户输入内容，然后通过POST请求提交给服务器。最后，服务器接收到请求，通过处理程序将输入的内容展示到浏览器中。

在我们的小目标应用中，/start请求处理程序用于生成带文本区的表单，则对requestHandlers.js做些修改，代码如下：

    // handle.js  @version $7.0$

    function start(response){
        // 处理程序start()被调用
        console.log("Request handler 'start' was called!");
        var body = '<html>'+
            '<head>'+
            '<meta http-equiv="Content-Type" content="text/html '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>'+
            '<form action="/upload" method="post">'+
            '<textarea name="text" rows="20" cols="60"></textarea>'+
            '<input type="submit" value="提交" />'+
            '</form>'+
            '</body>'+
            '</html>';
            response.writeHead(200,{'Content-Type':'text/html'});
            response.write(body);
            response.end();
    }


    function upload(response){
        // 上传趋利程序被调用
            console.log("Request handler 'upload' was called!");
            response.writeHead(200,{'Content-Type':'text/plain'});
            response.write("Hello,World");
            response.end();
    }
    exports.start = start;
    exports.upload = upload;


马上启动服务器并访问[http:localhost:8888/start](http:localhost:8888/start)看看到底发生了什么。

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_7.png" align="center"></p>
</center>


没有眼花！我们看到了一位美女！表单就是美女！美人如玉！


>
>
当然，在handle.js  @version $7.0$中我们将视觉元素(所谓V端)直接放在了请求处理程序中显得不太高明，其实大可以使用MVC之类的模式进行解耦，当然，实际上MVC到现在为止都已经显得有点low了！实际上我们可以使用更加潮流的Redux和RxJS。
>


POST请求是“重量型”——用户可能会输入大量的内容。使用阻塞的方式处理大量数据的请求必然会导致用户操作的阻塞，这是非常不明智也不友好的，所以，我们将采用非阻塞方式处理POST请求。


为了使整个过程非阻塞，NodeJS会将POST数据拆分成很多小的数据块，然后通过触发特定的事件，将这些小数据块传递给回调函数。这些特定的事件有data事件(表示新的小数据块到达了)以及end事件(表示所有数据都已经接收完毕)。


我们需要告诉NodeJS当这些事件触发的时候，回调哪些函数。那么，怎样高数NodeJS？

在request对象上注册监听器(listener)即可实现，request对象每次接收到HTTP请求时，都会把该对象传递给onRequest回调函数。

如下：

    request.addListener('data',function(chunk){
        // called when a new chunk of data was received(当接收到一个新的小数据块时调用)
    });

    request.addListenr('end',function(){
        // called when all chunks of data have been received(当接收完所有数据调用)
    });


那么问题来了，这部分的逻辑往哪儿写咧？我们现在只是在服务器中获取到了request对象——我们并没有像之前response对象那样，把request对象传递给请求路由和请求处理程序。


一般来说，获取所有来自请求的数据，再将这些数据给应用层处理，应该是HTTP服务器需要做的事情。因此，我们此处直接在服务器中处理POST数据，然后将最终的数据传递给请求理由和请求处理程序。让他们来进行进一步的处理。

实现思路：将data和end事件的回调函数直接放置服务器中，在data事件回调中收集所有的POST数据，当接收到所有数据，触发end事件后，其回调函数调用请求路由，并将数据传递给他(路由)，然后，请求路由再将该数据传递给请求处理程序。


等不及了！嗷嗷嗷！！！！！

修改server.js，代码如下：


    // server.js  @version $8.0$
    // 注册监听事件

    var http = require('http');
    var url = require('url');

    function start(route,handle) {
        function onRequest(request, response) {
            var postData ="";
            var pathname = url.parse(request.url).pathname;
            // 打印请求路径
            console.log('Request for ' + pathname + ' received!');
            request.setEncoding('utf8');
            // 注册"data"事件监听器，用于收集每次接收到的新数据块，并将其赋值给postData变量
            request.addListener('data', function(postDataChunk){
                postData += postDataChunk;
                console.log("received POST data chunk '" + postDataChunk +"'.");
            });
            // 将请求路由的调用移到end事件处理程序，以确保它只会当所有数据收集完毕才触发，并且只触发一次。
            // 将POST数据传递给请求路由，再经请求路由传递给请求处理程序
            request.addListener('end', function(){
                route(handle,pathname,response,postData);
            });
        }

        http.createServer(onRequest).listen(8888);
        console.log('Server has start!');
    }
    // 导出函数
    exports.start = start;


酷！酷！酷！酷！酷！

但是还不够！再酷点！

我们要让世界知道我们的存在！在/upload页面展示用户输入的内容！

要实现这个功能，我们需要将postData传递给请求处理程序，修改router.js，代码如下：


    // router.js  @version $5.0$
    // 作为中转站一样，接收来自服务器的postData数据并将其继续传递给请求处理程序

    function route(handle,pathname,response,postData){
        console.log("About to route a request for " + pathname);
        if (typeof handle[pathname] == 'function') {
            return handle[pathname](response,postData);
        } else {
            console.log("No request handle found for " + pathname);
            response.writeHead(404,{'Content-Type':'text/plain'})
            response.write("404 Not Found");
            response.end();
        }
    }

    // 导出模块
    exports.route = route;


然后，在requestHandlers.js中，将数据包含在upload请求的响应中，代码如下：

    // handle.js  @version $8.0$
    // 接收经请求路由中专实际是由服务器传过来的数据

    function start(response,postData){
        // 处理程序start()被调用
        console.log("Request handler 'start' was called!");
        var body = '<html>'+
            '<head>'+
            '<meta http-equiv="Content-Type" content="text/plain '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>'+
            '<form action="/upload" method="post">'+
            '<textarea name="text" rows="20" cols="60"></textarea>'+
            '<input type="submit" value="提交" />'+
            '</form>'+
            '</body>'+
            '</html>';
            response.writeHead(200,{'Content-Type':'text/html'});
            response.write(body);
            response.end();
    }

    function upload(response,postData){
        // 上传趋利程序被调用
            console.log("Request handler 'upload' was called!");
            response.writeHead(200,{'Content-Type':'text/plain'});
            response.write("You're sent the text:" + /*postData*/
            response.write('你发送了：' + postData));
            response.end();
    }

    // 将函数作为模块的方法导出
    exports.start = start;
    exports.upload = upload;



o了！此时我们可以接收POST数据并在请求处理程序中处理该数据了。测试一下：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_8.png" align="center"></p>
</center>


额！！！What The Hell!

服务器传递过来的数据包含有很多信息，实际上我们只对text字段有兴趣。稍加修改，引入querystring模块可实现：


    // handle.js  @version $9.0$

    var querystring = require('querystring');

    function start(response,postData){
        // 处理程序start()被调用
        console.log("Request handler 'start' was called!");
        var body = '<html>'+
            '<head>'+
            '<meta http-equiv="Content-Type" content="text/html '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>'+
            '<form action="/upload" method="post">'+
            '<textarea name="text" rows="20" cols="60"></textarea>'+
            '<input type="submit" value="提交" />'+
            '</form>'+
            '</body>'+
            '</html>';
            response.writeHead(200,{'Content-Type':'text/html'});
            response.write(body);
            response.end();
    }

    function upload(response,postData){
        // 上传趋利程序被调用
            console.log("Request handler 'upload' was called!");
            response.writeHead(200,{'Content-Type':'text/plain'});
            response.write("You're sent the text:" + /*postData*/
            querystring.parse(postData).text);
            response.end();
    }

    // 将函数作为模块的方法导出
    exports.start = start;
    exports.upload = upload


<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_9.png" align="center"></p>
</center>

perfec!这才是我们渴求的力量！
