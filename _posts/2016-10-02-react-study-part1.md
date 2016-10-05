---
layout: post
title: React初成长
author: beyondouyuan
date: 2016-10-02
categories: blog
tags: [前端,React]
react: react
description: 船动湖光滟滟秋，贪看年少信舡流。无端隔水抛莲子，遥被人知半日羞。
---

###  写在前面 ###

当前前端一场火热，而关于前端的讨论的话题也是火爆异常，前后端分离、全栈工程师、模块化、组件化biubiubiu！停！React就是应组件化之运而生的。

以上。

### 快速开始 ###

>
JSFiddle
>

开始学习React最简单的方式是使用如下JSFiddle的Hello World例子：

- [React JSFiddle](http://jsfiddle.net/reactjs/69z2wepo/)

- [React JSFiddle without JSX](http://jsfiddle.net/reactjs/5vjqabv3/)


>
入门教程包(Starter Kit)
>

- [开始先下载入门教程包](http://facebook.github.io/react/downloads/react-0.13.1.zip)

下载安装包后解压文件到项目文件夹(此处项目文件夹为reactstudy/react-0.13.1)。

进入项目根目录，创建一个helloworld.html文件，并写入如下代码：

	<!DOCTYPE html>
	<html>

	<head>
	    <script src="build/react.js"></script>
	    <script src="build/JSXTransformer.js"></script>
	</head>

	<body>
	    <div id="example"></div>
	    <script type="text/jsx">
	        React.render(
	        <h1>Hello, world!</h1>, document.getElementById('example') );
	    </script>
	</body>

	</html>

直接在浏览器中打开helloworld.html文件，即可看到效果，如下图：

<center>
<p><img src="https://beyondouyuan.github.io/img/react_1.png" align="center"></p>
</center>


在JavaScript代码里写着XML格式的代码称为JSX；

- [JSX语法](http://facebook.github.io/react/do
cs/jsx-in-depth.html)

为了把JSX转成标准的JavaScript，我们用

> <script type="text/jsx">

标签包裹着含有JSX的代码，然后引入JSXTransformer.js 库来实现在浏览器里的代码转换。



### 分离文件 ###

React JSX代码文件可以写在另外的文件里，新建一个src目录，在src下新建文件helloworld.js：

	React.render(
	<h1>Hello, world!</h1>,
	document.getElementById('example')
	);

然后在helloworld.html中引用该文件

	script type="text/jsx" src="src/helloworld.js"></script>

则此时的helloworld.html文件应该变为如下：

	<!DOCTYPE html>
	<html>

	<head>
	    <script src="build/react.js"></script>
	</head>

	<body>
	    <div id="example"></div>
	    <script src="src/helloworld.js"></script>
	</body>

	</html>

即我们不再将html和js耦合在一个页面中，而是实现了文件分离。

当然，此时在浏览器中打开helloworld.html文件，页面上将是一片空白，什么都没有！要想看到文件分离后的结果，我们还需要进行离线转换。

### 离线转换 ###

先安装命令行工具(依赖- [npm (http://npmjs.org/)](npm (http://npmjs.org/)));

	npm install -g react-tools


安装成功后，将helloworld.js文件转换为标准的JavaScript：

从控制台进入reactstudy/react-0.13.1目录

	jsx --watch src/build/


运行成功后，控制台将会输出如下信息

	built Module("helloworld")
	["helloworld"]

如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/react_2.png" align="center"></p>
</center>

执行这一步后，打开项目中的build目录，将看到build目录下有一个名为helloworld.js的文件！如下：

<center>
<p><img src="https://beyondouyuan.github.io/img/react_3.png" align="center"></p>
</center>

这说明文件分离已经生效。再次在浏览器中打开helloworld.html则可以看到效果。


恭喜你，欢迎来到React的世界。