---
layout: post
title: NodeJs初成长(一)之nodejs入门(1)
author: beyondouyuan
date: 2016-09-30
categories: blog
tags: [NodeJs,nodejs入门]
node: node
description: 杨家有女初长成，养在深闺人未识。天生丽质难自弃，一朝选在君王侧。回眸一笑百媚生，六宫粉黛无颜色。
---

###  写在前面 ###

筹谋NodeJs系列的学习已经许久了，也在网络上找了无数资源，收藏了无数的社区博客，下载了无数的PDF文档以及视频，有时候人总是奇怪的那么相像，没有的时候无从下手，选择太多时同样无从下手。今天终于下定决心了，就以《NodeJs入门》为基，也开展自己的NodeJs之旅。

以上。

### NodeJs与JavaScript ###

早期时，圈内人提起JavaScript时，首先的反应就是："哦，JavaScript啊，只是给前端页面添加一些诸如广告banner、动画以及各类页面交互的客户端脚本嘛！"

现在，一切都不一样了，前端大热，各类前端技术并喷，前端框架一月一小变，三月一大变。angularjs、reactjs等前端技术方兴未艾，更是将已经大热的前端又推向了另一个高度。而与其同时，大名鼎鼎的NodeJs更是以摧枯拉朽之势雄踞github等各类开发社区的榜首。以前的JavaScript多是基于浏览器端的技术，而现在NodeJs出现了，服务器端的JavaScript，很酷吧？

NodeJs事实上既是一个运行时环境，同时又是一个库。


### "Hello,World" ###

程序员的最骄傲的地方就是在自己的简历封面写上大大的Hello,World!，

废话不多说，马上开始第一个NodeJs应用："Hello,World"。

打开你最喜欢的编辑器，最帅的程序员和最美的程序媛都在使用sublime text！创建helloworld.js文件。文件里的代码功能很简单：输出"Hello,World!"。

	console.log("Hello,World!");

保存该文件，通过终端[我是在windows上，所以是在CMD上执行]进入到该文件目录，通过NodeJs执行

	node helloworld.js

若是一切正常，终端上将会输出*Hello,World!*

Hello,World测试完后的程序员就像是洗干净了的洁癖的人一样，来点刺激的！进入正题。


## 定一个小目标 ##



### 完整的NodeJs web应用 ###

首先定一个小目标，当然不是先挣他一个亿，而是一个实际的小应用：

1.用户可以通过浏览器使用我们的应用。

2.当用户请求http://domain/start时，可以看到一个欢迎页面。页面上有一个文件上传的表单。

3.用户可以选择一个图片并提交表单，随后文件将被上传到http://domain/upload，该页面完成上传后会把图片显示在页面上。


最美的风景在沿途

在完成这一目标过程中，不仅仅需要基础的代码而不管代码是否优雅。我们还要对此进行抽象，以寻找一种更适合构建更为复杂的NodeJs应用。

小tips

>
最近一直都在学习怎样把自己的代码封装得更加优雅，从《JavaScript DOM编程艺术》到《Javascript设计模式》，看了无数优美的例子，多多少少也学到了一点技巧，将自己从无数重复使用的代码中抽象、封装起来，以避免大量重复工作已经代码的臃肿丑陋。
>

### 应用不同模块分析 ###

磨刀不误砍柴工

首先分解一下这个应用，为了实现上文的小目标，需要实现哪些部分？

- 用户可以通过浏览器使用应用，并看到一个欢迎页面，所以需要提供web页面，因此需要一个*HTTP服务器*。

- 对于不同的请求，根据请求的URL，服务器需要给予不同的响应，因此需要一个*路由*，用于把请求对应到请求处理程序(request handler)。

- 当请求被服务器接收并通过路由传递之后，需要可以对其处理，因此需要最终的请求处理程序。

- 路由还应该能处理POST参数，并且把数据封装成更友好的格式传递给请求处理程序，因此需要请求数据处理功能。

- 应用不仅仅要处理URL对应的请求，还需要把内容显示出来，这意味着需要一些视图逻辑供请求处理程序使用，以便将内容发给用户的浏览器

- 最后，用户需要上传图片，所以需要上传处理功能来处理这些方面的细节。




来一个javascript常用例子：

	function clickListener(obj, fn) {
	    var val = $(obj).val;
	    $(obj).click(function() {
	        fn(val)
	    })
	};

	function clickHandle(objVal) {
	    alert(objVal);
	};
	clickListener("#obj1", clickHandle);



我们且不管传入的参数是什麽以及我们需要什么参数，根据一项代码的例子类比来理解一下这个NodeJs的处理过程。

用户使用浏览器输入URL(请求)[传入参数"#obj1"] --> 请求URL被服务器[clickListener]接收 --> 被服务器接收的URL通过路由(相当于中转)[clickHandle]传递 --> 路由传递的URL作为参数传递给请求处理程序[clickHandle(objVal)] --> 请求处理程序根据传入参数(URL)进行相应处理并返回结果 --> 将处理得到的结构返回给用户(响应)[alert(objVal)]。

----------------------------------------------------------------------------

		  /~~\
		  ----
		/^(..)^\	  zzz...
      	\,(..),/	zzz....
      	--------
          V~~V

----------------------------------------------------------------------------

由此，使用NodeJs实现小目标时，我们不仅仅在实现一个应用，同时还实现了整个HTTP服务器。事实上，我们的Web应用以及对应的Web服务器基本上是一样的。

听起来好像有一大堆活要做，但随后我们会逐渐意识到，对NodeJs来说这并不是什么麻烦的事。现在我们就来开始实现之路，先从第一个部分 -->HTTP 服务器着手。

## 构建应用的模块 ##


### 一个基础的HTTP服务器 ###

>
>
当我准备开始写我的第一个“真正的”NodeJs应用的时候，我不但不知道怎么写NodeJs代码，也不知道怎么组织这些代码。我应该把所有东西都放进一个文件里吗？网上有很多教程都会教你把所有的逻辑都放进一个用NodeJs写的基础HTTP服务器里。但是如果
我想加入更多的内容，同时还想保持代码的可读性呢？实际上，只要把不同功能的代码放入不同的模块中，保持代码分离还是
相当简单的。
>


>
>
这种方法允许你拥有一个干净的主文件(main file)，你可以用 NodeJs执行它；同时你可以拥有干净的模块，它们可以被主文件和其他的模块调用。
>

首先创建一个用于启动应用的主文件，和一个保存着HTTP服务器代码的模块。

一般的，将主文件叫做index.js或多或少是个标准格式，将服务器模块放进server.js的文件里则更好理解。

首先从服务器模块开始，在项目根目录下创建server.js文件，写需要的代码：

	// http服务器模块
	// 请求nodejs自带的http模块，并将其赋值给http变量
	// 调用http模块提供的函数:createServer()
	// createServer()接收一个参数，此时该参数为一个匿名函数
	// 该匿名函数接收两个参数，request为请求参数，response为响应参数
	// createServer()函数返回一个对象
	// 该返回的对象有一个listen()法，其参数指定该http服务器监听的端口号

	var http = require('http');

	http.createServer(function(request, response) {
	    response.writeHead(200, { "content-Type": "text/plain" });
	    response.write("Hello,Server World!");
	    response.end();
	}).listen(8888);

搞定！到此已完成了一个可以工作的HTTP服务器。为了证明这一点，
需要运行并且测试这段代码。首先，进入server.js所在目录，用Node.js执行你的脚本：

	node server.js

接下来，打开浏览器访问[http://localhost:8888/](http://localhost:8888/)，你会看到一个写着“Hello,Server World!”的网页。

效果图如下：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_server.png" align="center"></p>
</center>

很有趣，小目标已经实现第一步，挣了一个亿！
