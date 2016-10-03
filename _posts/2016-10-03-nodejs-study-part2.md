---
layout: post
title: NodeJs初成长(二)
author: beyondouyuan
date: 2016-10-03
categories: blog
tags: [学习,前端,NodeJs]
node: node
description: 莫倚倾国貌，嫁娶个，有情郎。彼此当年少，莫负好时光
---

###  安装和配置NodeJs ###

 &&1  在windows上安装NodeJs


>
在Windows上安装NodeJs十分方便，你只需要访问http://nodejs.org，点击Download链接，然后选择Windows Installer，下载安装包。下载完成后打开安装包，点击Next即可自动完成安装。
>

 &&2  测试NodeJs是否已成功安装

打开windows的cmd窗口并输入node，出现如下图所示

<center>
<p><img src="https://beyondouyuan.github.io/img/node_check.png" align="center"></p>
</center>

即进入node交互模式，则安装成功

通过这种方式安装的NodeJs还自动附带了npm，

Node包管理器(npm)
是一个由NodeJs官方提供的第三方包管理工具，就像PHP的Pear、Python的PyPI 一样。npm是一个完全由JavaScript实现的命令行工具，通过Node.js执行，因此严格来讲它不属于Node.js的一部分。
在最初的版本中，我们需要在安装完 Node.js以后手动安装npm。但从Node.js 0.6开始，npm已包含在发行包中了，我们在 Windows、Mac 上安装包和源代码包时会自动同时安装npm。


 &&2  如何运行NodeJs

打开终端，键入node进入命令交互模式，可以输入一条代码语句后立即执行并显示结果，例如:

<center>
<p><img src="https://beyondouyuan.github.io/img/node_run.png" align="center"></p>
</center>

如果要运行一大段代码的话，可以先写一个JS文件再运行。例如有以
下hello.js文件。其内容如下

	function hello(){
		console.log('Hello,World!')；
	}
	hello();


保存好文件后，油终端进入到该文件所在目录，然后执行node hello.js即可。
