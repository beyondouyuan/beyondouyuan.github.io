---
layout: post
title: NodeJs初成长(一)之nodejs入门(7)
author: beyondouyuan
date: 2016-10-20
categories: blog
tags: [NodeJs]
node: node
description: 相见争如不见，有情还似无情。笙歌散后酒微醒，深院月明人静。

---

### 写在前面 ###

我们的目标是？没有蛀牙？为了...为了...为了部落！

我们的最终目标是允许用户上传图片，并将图片在浏览器中显示出来
。

#### 安装模块 ####

我们还需要一些外部模块——node-fromidable模块，他对解析上传的文件数据做了抽象。

处理文件上传实际上就是处理POST数据——说起来容易做起来不简单，所以我们采用更加现成的方案。

首先使用NPM安装我们需要的模块——node-fromidable


该模块主要是将通过HTTP POST请求提交的表单，在NodeJS中可以被解析。我们要做的就是创建一个新的IncomingForm，他是对提交表单的抽象表示，之后，就可以用它解析request对象，获取表单中需要的字段。


先看看node-fromidable的官方例子：

    var formidable = require('formidable'),
        http = require('http'),
        sys = require('sys');
    http.createServer(function(req, res) {
        if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
            // parse a file upload
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                res.writeHead(200, { 'content-type': 'text/plain' });
                res.write('received upload:\n\n');
                res.end(sys.inspect({ fields: fields, files: files }));
            });
            return;
        }
        // show a file upload form
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(
            '<form action="/upload" enctype="multipart/form-data" ' +
            'method="post">' +
            '<input type="text" name="title"><br>' +
            '<input type="file" name="upload" multiple="multiple"><br>' +
            '<input type="submit" value="Upload">' +
            '</form>'
        );
    }).listen(8888);

将文件保存并执行后，我们将可以使用这段代码完成简单的表单提交功能。

为了实现我们的功能，则将上述代码应用到我们的应用中，另外，我们还需要考虑如何将上传文件的内容(保存在/tmp目录中)显示到浏览器供用户浏览。


对于保存在本地硬盘的文件，怎样才可以在浏览器中浏览？

显然，需要将该文件读取到我们的服务器中，使用fs模块。

添加showURL请求处理程序，该处理程序直接硬编码将文件/tmp/test.png内容显示到浏览器中。当然了，首先需要将该图片保存到此为止才可以。

修改requestHandlers.js内容，代码如下：

    // handle.js  @version $10.0$


    var querystring = require("querystring"),
        fs = require("fs");

    function start(response, postData) {
        console.log("Request handler 'start' was called.");
        var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" ' +
            'content="text/html; charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<form action="/upload" method="post">' +
            '<textarea name="text" rows="20" cols="60"></textarea>' +
            '<input type="submit" value="Submit text" />' +
            '</form>' +
            '</body>' +
            '</html>';
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(body);
        response.end();
    }

    function upload(response, postData) {
        console.log("Request handler 'upload' was called.");
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write("你发送了: " +
            querystring.parse(postData).text);
        response.end();
    }

    function show(response, postData) {
        console.log("Request handler 'show' was called.");
        fs.readFile("/tmp/test.png", "binary", function(error, file) {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(error + "\n");
                response.end();
            } else {
                response.writeHead(200, { "Content-Type": "image/png" });
                response.write(file, "binary");
                response.end();
            }
        });
    }
    exports.start = start;
    exports.upload = upload;
    exports.show = show;


将新的处理程序添加到index.js中的路由映射表中：

    // index.js  @version $4.0$
    var server = require("./server");
    var router = require("./router");
    var requestHandlers = require("./requestHandlers");
    var handle = {}
    handle["/"] = requestHandlers.start;
    handle["/start"] = requestHandlers.start;
    handle["/upload"] = requestHandlers.upload;
    handle["/show"] = requestHandlers.show;
    server.start(router.route, handle);


重启服务器之后，通过访问[http://localhost:8888/show](http://localhost:8888/show)，就可以看到保存在/tmp/test.png的图片了。


若是此时我们并没有/tmp/test.png这个文件，会发生什么呢？一看便知：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_10.png" align="center"></p>
</center>


报错，这个文件不存在！
*Error: ENOENT: no such file or directory, open 'F:\tmp\test.png'*
由于我的项目在硬盘地址是在F盘根目录下，这通过/tmp/test.png路径查找的路径也应该就是在f盘根目录。所以在f盘中创建一个tmp文件夹(也就是所这个tmp与我们的项目路径平级)，再在这个文件夹下拖入一个名为test.png的图片，再次刷新浏览器：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_11.png" align="center"></p>
</center>


没错！就是她就是她就是她！看到了我们预先存储的图片。


ok!这并没有什么了不起，而且，我们的工作也没有做完呢，接下来，需要做的就是：

- 在/start表单中添加一个文件上传元素
- 将node-formidable整合到upload请求处理程序中，用于将上传的图片保存至/tmp/test.png
- 将上传的图片内嵌到/uploadURL输出的HTML中

第一项很简单，仅仅是在HTML表单中添加一个multipart/form-data的编码类型以支持图片格式的数据上传，移除此签的文本区，添加一个文件上传组件，并将提交按钮进行相应修改即可，如下requestHandler.js代码所示：


    // handle.js  @version $11.0$

    var querystring = require("querystring"),
        fs = require("fs");

    function start(response, postData) {
        console.log("Request handler 'start' was called.");
        var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" ' +
            'content="text/html; charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<form action="/upload" enctype="multipart/form-data" ' +
            'method="post">' +
            '<input type="file" name="upload">' +
            '<input type="submit" value="Upload file" />' +
            '</form>' +
            '</body>' +
            '</html>';
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(body);
        response.end();
    }

    function upload(response, postData) {
        console.log("Request handler 'upload' was called.");
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write("你发送了： " +
            querystring.parse(postData).text);
        response.end();
    }

    function show(response, postData) {
        console.log("Request handler 'show' was called.");
        fs.readFile("/tmp/test.png", "binary", function(error, file) {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(error + "\n");
                response.end();
            } else {
                response.writeHead(200, { "Content-Type": "image/png" });
                response.write(file, "binary");
                response.end();
            }
        });
    }
    exports.start = start;
    exports.upload = upload;
    exports.show = show;

很好，接下来就稍微复杂些了。问题来了：我们需要在upload处理程序中对上传的文件进行处理，如此，我们就需要将request对象传递给node-formidable的form-parse函数。

但是，我们有的只是response对象和postData数组。看样子，我们只能不得不将request对象从服务器开始一路通过请求路由，再传递给请求处理程序。目前这样做确实可以满足我们的需求。

那么到这里，我们可以将postData从服务器以及请求处理程序中移除了——一方面，对于我们处理文件上传来说已经不需要了，另一方面——它甚至可能会引发这样一个问题：我们已经“消耗”了request对象中的数据。这意味着，对于form-parse来说，当他想要获取数据的时候就什么也获取不到了(NodeJS不会对数据做缓存)。

则，从server.js开始——移除postData的处理以及request.setEncoding(这部分node-formidable自身会处理)，转而采用将request对象传递给请求路由的方式：

    // server.js  @version $9.0$
    // 移除postData的处理
    // 交由请求路由传递request对象而不再需要postData理

    var http = require("http");
    var url = require("url");

    function start(route, handle) {
        function onRequest(request, response) {
            var pathname = url.parse(request.url).pathname;
            console.log("Request for " + pathname + " received.");
            route(handle, pathname, response, request);
        }
        http.createServer(onRequest).listen(8888);
        console.log("Server has started.");
    }
    exports.start = start;

接着便是修改router.js的代码——我们不再需要传递postData，而是传递request对象：

    // router.js  @version $6.0$
    // server.js中移除postData的处理
    // 请求路由将是传递request而不再是postData
    function route(handle, pathname, response, request) {
        console.log("About to route a request for " + pathname);
        if (typeof handle[pathname] === 'function') {
            handle[pathname](response, request);
        } else {
            console.log("No request handler found for " + pathname);
            response.writeHead(404, { "Content-Type": "text/html" });
            response.write("404 Not found");
            response.end();
        }
    }
    exports.route = route;



现在，request对象就可以在我们的upload请求处理程序中使用了。node-formidable会将上传的文件保存到本地/tmp目录中，而我们需要做的是确保该文件保存成/tmp/test.png。没错，我们保持简单，并假设只允许上传PNG图片。


fs.renameSync(path1,path2)该方法是同步执行的。 也就是说，如果该重命名的操作很耗时的话会阻塞。 这块我们先不考虑。

接下来，将处理文件上传以及重命名的操作放在一起，修改requestHandler.js如下：


    // handle.js  @version $12.0$
    // 将处理文件上传以及重命名的操作放在一起

    var querystring = require("querystring"),
        fs = require("fs"),
        formidable = require("formidable");

    function start(response) {
        console.log("Request handler 'start' was called.");
        var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; ' +
            'charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<form action="/upload" enctype="multipart/form-data" ' +
            'method="post">' +
            '<input type="file" name="upload" multiple="multiple">' +
            '<input type="submit" value="Upload file" />' +
            '</form>' +
            '</body>' +
            '</html>';
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(body);
        response.end();
    }

    function upload(response, request) {
        console.log("Request handler 'upload' was called.");
        var form = new formidable.IncomingForm();
        console.log("about to parse");
        form.parse(request, function(error, fields, files) {
            console.log("parsing done");
            fs.renameSync(files.upload.path, "/tmp/test.png");
            response.writeHead(200, { "Content-Type": "text/html" });
            response.write("收到图片:<br/>");
            response.write("<img src='/show' />");
            response.end();
        });
    }

    function show(response) {
        console.log("Request handler 'show' was called.");
        fs.readFile("/tmp/test.png", "binary", function(error, file) {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(error + "\n");
                response.end();
            } else {
                response.writeHead(200, { "Content-Type": "image/png" });
                response.write(file, "binary");
                response.end();
            }
        });
    }
    exports.start = start;
    exports.upload = upload;
    exports.show = show;



ok！重启服务器，我们应用所有的功能就可以使用了，选择一张图片，将其上传到服务器，然后浏览器会显示该图片：


<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_12.png" align="center"></p>
</center>

有意思！浏览器链接localhost被拒绝，换个浏览器同样打不开，查看控制台：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_13.png" align="center"></p>
</center>
应该是文件重命名出错，文件未能成功保存，到f:/tmp/下一看，确实没有test.png这个图片。

马上google一下，
社区上有人第一个说的是windows和linux路径不一样，建议修改为"[\\]"，改之，无效，

另一建议将fs.renameSync()改用fs.rename()，改之，浏览器正常跳转到upload页面，但是文件无法显示出来，同样f:/tmp/目录下没有test.png文件：


<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_14.png" align="center"></p>
</center>


命令行输出*cross-device link not permitted, rename *关键词没有改变多大，证明问题依然没有解决，继续查找解决方法：


stackoverflow上找到了一个问题[Node.JS fs.rename doesn't work](https://stackoverflow.com/questions/12196163/node-js-fs-rename-doesnt-work)
引入util模块
使用：
    var readStream = fs.createReadStream(files.upload.path);
    var writeStream = fs.createWriteStream("/tmp/test.png");
    util.pump(readStream, writeStream, function() {
        fs.unlinkSync(files.upload.path);
    });

替代：fs.renameSync(files.upload.path, "/tmp/test.png");

刷新浏览器，上传文件，跳转-->终于出来了！
<center>
<p><img src="https://beyondouyuan.github.io/img/node_r_s_15.png" align="center"></p>
</center>


Yes！we did!
