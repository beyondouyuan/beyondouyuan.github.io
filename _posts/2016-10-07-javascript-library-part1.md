---
layout: post
title: JavaScript封装库(1)
author: beyondouyuan
date: 2016-10-07
categories: blog
tags: [JavaScript]
javascript: javascript
description: 夜夜相思更漏残，伤心明月凭阑干，想君思我锦衾寒。咫尺画堂深似海，忆来惟把旧书看，几时携手入长安？
---


### 写在前面 ###


在前端开发中我们常常有一些需要重复使用的代码，如实现某些特效的jJavaScript代码(动画轮播、鼠标事件等等)，为了减少书写重复代码，我们常常把一些重复使用的JavaScript代码封装起来，形成一个基本库(base library)，以便后期需要时直接调用，而无需在每一个用到的地方重复书写代码(就如我们常用的Jquery库一样)。

### 理解JavaScript库 ###


每个项目为了提高开发效率，创建一个库用于保存大量重复的JavaScript代码。


>
什么是JavaScript库？简单明了地讲，就是把各种常用的代码片段，组织起来放在一个js文件里，组成一个包，这个包就是JavaScript库。比如Jquery、Prototype等。
>

### 创建基础库 ###

首先来进行准备工作，创建一个项目文件夹[文件名随个人]，我的项目名称是oylibrary，在项目文件内新建一个demo.html文件，同时创建一个scripts目录，其下创建一个base.js文件，那么你的目录结构应该是想这样子的：

<center>
<p><img src="https://beyondouyuan.github.io/img/lib_1.png" align="center"></p>
</center>

dome.html文件的内容也很简单，他仅是用于测试的：

	<!DOCTYPE html>
	<html>

	<head>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	    <title>基础库</title>
	    <script type="text/javascript" src="scripts/base.js"></script>
	</head>

	<body>
	    <div id="box">id</div>
	    <input type="radio" name="sex" value="男" checked="checked" />
	    <p>段落</p>

	    <script type="text/javascript">
	    	// 测试

	    	window.onload = function () {
	    	 	// 通过id获取元素
	    	 	alert(document.getElementById('box').innerHTML);
	    	 	// 通过name获取元素
	    	 	// document.getElementsByName('sex')得到[object Nodelist](数组形式)
	    	 	// 想从arry中获得值，就必须得指定该元素的位置！
	    		alert(document.getElementsByName('sex')[0].value);
	    	 	// 通过元素标签名获取元素
	    	 	alert(document.getElementsByTagName('p')[0].innerHTML);
	    	}

	    </script>
	</body>

	</html>


打开浏览器测试可得到，页面依次弹出三次，分别得到我们想要的结构。ok，下面来开始第一个封装(获取元素节点)。


通常地来说，封装函数时一般有以下原则：

封装函数原则一：方法尽量简短，尽可能具有语意性。

首先以函数式封装函数：

	function getID(id){
		return document.getElementById(id);
	}

当然我们还可以像jquery一样使用一个符号作为方法名：

	function $(id){
		return document.getElementById(id);
	}


>
函数真正威力体现在，我们可以把不同的数据传递给他们，而他们将使用实际传递给他们的参数去完成预定的操作。传递的数据即为参数(argument)。
----------------------来自JavaScript+DOM编程艺术：
>

ok！来进行第一次测试，将demo中的js部分用刚刚封装的方法进行替换

	window.onload = function(){
	   	alert(getID('box').innerHTML);
	}

页面弹出id！证明我们的封装已经可用！enjoy it!

封装代码时还可以使用对象式封装，整个库可以是一个对象：

	// 对象式封装，整个库可以是一个对象
	var Base = {
		$:function(id){
			return document.getElementById(id);
		},
		$$:function(name){
			return document.getElementsByName(name);
		},
		$$$:function(tag){
			return document.getElementsByTagName(tag);
		}
	};


再行在demo中测试：

	window.onload = function(){
	   	alert(Base.$('box').innerHTML);
	    // Base.$$(name)得到的是数组，要得到具体某个值，则需知名该元素位置，否则报错
	    alert(Base.$$('sex')[0].value);
	    alert(Base.$$$('p')[0].innerHTML);
	}

页面上同样依次弹出三个我们想要的窗口，很酷！

但是，有没有觉得哪里不对呢？额，三个月后我们再次使用我们自己的库时，$('box')？是个什么鬼？额，我觉得应该像是借鉴了jquery选择器的方式，那他应该是个通过元素id选择元素的方法吧。那这个*$$('sex')*、*$$$('p')*呢？What the hell????


所以，我们不能一味求快，额，男人不能说快，我们不能一味求简短，还需要适当的语意化，那么再把Base对象稍加修改：

	window.onload = function(){
	    alert(Base.getID('box').innerHTML);
	    alert(Base.getName('sex')[0].value);
	    alert(Base.getTagName('p')[0].innerHTML);
	}


再次测试，perfect!
