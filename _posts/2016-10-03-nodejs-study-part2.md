---
layout: post
title: NodeJs初成长(二)之七天学会nodejs(1)
author: beyondouyuan
date: 2016-10-03
categories: blog
tags: [学习,前端,NodeJs,七天学会nodejs]
node: node
description: 杨家有女初长成，养在深闺人未识。天生丽质难自弃，一朝选在君王侧。回眸一笑百媚生，六宫粉黛无颜色。
---

###  写在前面 ###


又是一年国庆时，又是七天神宅日。
世事洞明皆学问，人情练达即文章。

很久之前就想要在博客上写下自己在学习以及工作中的点点滴滴，终于在这个节日里静下心来写点东西了。

那便趁着这奈何天，伤怀日，寂寥时，试遣愚衷。因此上，记下这美人如玉的《七天学会NodeJs》学习笔记来。

谨以此记开启node征程

##  第一天 认识NodeJs ##

 &&1  什么是NodeJs

>
NodeJs是一个基于Google V8引擎建立的一个平台，用于方便搭建快速、易于扩展的网络应用。
>

JS是脚本语言，脚本语言都需要一个解析器才能运行。对于写在HTML页面里的JS，浏览器充当了解析器的角色。而对于需要独立运行的JS，NodeJS就是一个解析器。

 &&2  安装NodeJs

在Windows上安装NodeJs十分方便，你只需要访问http://nodejs.org，点击Download链接，然后选择Windows Installer，下载安装包。下载完成后打开安装包，点击Next即可自动完成安装。

通过这种方式安装的NodeJs还自动附带了npm，

- [Node包管理器(npm)]
是一个由NodeJs官方提供的第三方包管理工具，就像PHP的Pear、Python的PyPI一样(额，其实由于自己身并不是计算机语言科班出身，所以实际上对于语言很多东西了解并不多，此处权当学习啦)。npm是一个完全由JavaScript实现的命令行工具，通过Node.js执行，因此严格来讲它不属于Node.js的一部分。

 &&3  测试NodeJs是否已成功安装

安装NodeJs后需添加系统变量后才可在CMD中使用node交互环境

首先在CMD窗口中输入path，查看node.exe是否已在PATH变量中。
若node.exe不再PATH环境变量中，则需手动添加到环境变量。
右键计算机 --> 属性 --> 环境变量 --> PATH --> 编辑，然后将node.exe路径添加至环境变量。

确保node.exe在环境变量中后，打开windows的CMD窗口并输入node，出现如下图所示

<center>
<p><img src="https://beyondouyuan.github.io/img/node_check.png" align="center"></p>
</center>

即进入node交互模式，则安装成功。


 &&4  如何运行NodeJs

打开终端，输入node进入命令交互模式，可以输入一条代码语句后立即执行并显示结果，例如:

<center>
<p><img src="https://beyondouyuan.github.io/img/node_run.png" align="center"></p>
</center>

如果要运行一大段代码的话，可以先写一个JS文件再运行。例如有以
下hello.js文件。其内容如下

	function hello(){
		console.log('Hello,World!')；
	}
	hello();


保存好文件后，有终端进入到该文件所在目录，然后执行node hello.js即可。


### 模块 ###

编写稍大一点的程序时一般都会将代码模块化。在NodeJS中，一般将代码合理拆分到不同的JS文件中，每一个文件就是一个模块，而文件路径就是模块名。在编写每个模块时，都有require、exports、module三个预先定义好的变量可供使用。

 &&1 require

require函数用于在当前模块中加载和使用别的模块，传入一个模块名，返回一个模块导出对象。模块名可使用相对路径(以./开头)，或者是绝对路径(以/或C: 之类的盘符开头)。另外，模块名中的.js扩展名可以省略。如下所示：

	var foo1 = require('./foo');
	var foo2 = require('./foo.js');
	var foo3 = require('/home/user/foo');
	var foo4 = require('/home/user/foo.js');
	// foo1至foo4中保存的是同一个模块的导出对象

	//另外，可以使用以下方式加载和使用一个JSON文件
	var data = require('./data.json');

所谓模块的导出对象即是：

>
每一个模块为外部提供的接口以便为外部调用其模块内部的代码。
>


在其中一个文件中创建叫做service的服务器模块
如下：
	// 创建一个服务器模块
	// 将服务器脚本放入到函数中，然后导出该函数

	var http = require('http');
	var url = require('url');

	function start() {
	    function onRequest(request, response) {
	        // 回调函数触发(被调用)时打印
	        console.log('Request received!');
	        var pathname = url.pause(request.url).pathname;
	        // 打印请求路径
	        console.log('Request for ' + pathname + ' received!');
	        response.writeHead(200, { 'content-Type': 'text/plain' });
	        response.write('Hello,NosdJs World!');
	        response.end();
	    }

	    http.createServer(onRequest).listen(8888);
	    console.log('Server has start!');
	}
	// 导出函数
	exports.start = start;

在另一个名为index的模块中调用start模块，如下

	// 请求服务器模块
	// 调用模块并赋值给本地变量，则模块中已导出的函数即可被该本地变量使用
	var server = require('./server');

	function() {
		// state
	}


 &&2 exports

exports对象是当前模块的导出对象，用于导出模块的共有公有方法和属性，别的模块中通过require函数调用当前模块时得到的就是当前模块的exports对象


如上例子所示，server模块中有一个公有方法start，在当前模块(server模块)被导出为名为start的exports对象【通俗点的理解即是将start方法赋值给名为start的exprots对象】，

当在index模块中通过require函数调用server模块时，所得到的即是server中名为start的exports对象，这个export对象的值[包括索性和方法]就是server模块start方法[函数]的内容本身。

通过exports以及require即可实现逻辑程序与业务代码的高度分离(常说的解耦)，从而得到具有高度可维护特性的代码，便于开发以及维护。



 &&3 module

通过module对象可以访问到当前模块的一些相关信息，但最多的用途是替换当前模块的导出对象。例如模块导出对象默认是一个普通对象，若想改成一个函数的话，则可以使用以下方式

	module.exports = function(){
		console.log('Hello,World!)
	}

以上代码，模块默认导出对象被替换为一个函数。



### 模块初始化 ###

一个模块中的js代码仅在模块第一次被调用时执行一次，并在执行过程中初始化模块的导出对象，之后缓存起来的导出对象被重复利用。如下:

在index模块中调用server模块，server仅在$1处执行一次，然后初始化server中导出的start对象，start对象被缓存在本地变量server中可被重复利用[使用var关键词定义的变量称为本地变量，其命名一般不是必须与导入模块名称一致，但一般为了规范通常命名与其导入的模块名相同]

$1 var server = require('./server')


  &&1 主模块

通过命令行参数传递给NOdeJs以启动程序的模块被称为主模块。主模块负责调度组成整个程序的其他模块，以完成工作。例如通过以下命令启动程序

	node main.js

main.js就是主模块

[如通常的静态html页面以index.html为主页一样，以静态html页面引用css样式为例，创建一个名为main.css的样式表，然后在main.css中使用import('commen.css')]。
如下：

	/*main.css样式表*/
	import('reset.css');
	import('commen.css');
	import('base.css');

则此时在index.html中只需要引入main.css即相当于引入了所有的css样式表

此main.css则相当于主模块，其余引入的样式表相当于其他模块，通过main.css调度其他的模块完成css渲染工作。

 - [完整示例]

目录如下

 - /home/user/hello
    - util/
        counter.js
    - main.js

counter,js内容如下：

	var i =0;

	function count(){
		return ++i;
	}

	exports.count = count;

该模块内部定义了一个私有变量i，并在exports对象导出了一个共有方法count，

	var counter1 = require('./util/counter');
	var counter2 = require('./util/counter');

	console.log(counter1.count());
	console.log(counter2.count());
	console.log(counter2.count());

运行该程序结果如下：

	$ node main.js
	1
	2
	3

可以看到，counter.js并没有因为被require了两次而被初始化了两次。

>
由以上结果分析：
>
>//第一次使用require('./util/counter')调用counter模块，counter被缓存在主模块中
var counter1 = require('./util/counter');
console.log(counter1.count());
>
>
当第一次执行完成后，count()中的变量i变成了1；
var counter2 = require('./util/counter');
console.log(counter2.count());
>
>
在模块中再次使用require('./util/counter')调用counter模块时，并不是再次初始化counter模块，而是重复使用缓存在住模块中的counter模块[i值已经变为1]
>
>
故第一个执行console.log(counter2.count());的值为2；
第二次执行console.log(counter2.count());的值为3，因为其调用的counter对象依然是缓存的[且i值已经变为2]的counter模块
>


### 小结 ###

1.NodeJs是一个js脚本解析器，任何操作系统下安装NodeJs本质上都是把NodeJs执行程序复制到一个目录，然后保证该目录在PATH环境变量下，以便终端下可以使用node命令。

2.终端下直接输入node命令可进入命令交互模式，可用于测试一些js代码片段，如正则表达式代码。

3.NodeJs使用CMD模块系统，住模块作为程序入口点，所有模块在执行过程中只初始化一次。