---
layout: post
title: JavaScript封装库(2)之链式调用
author: beyondouyuan
date: 2016-10-11
categories: blog
tags: [JavaScript,JavaScript库]
javascript: javascript
description: 雨恨云愁，江南依旧称佳丽。水村渔市，一缕孤烟细。　天际征鸿，遥认行如缀。平生事，此时凝睇，谁会凭栏意？
---


### 写在前面 ###

像jquery一样链式调用将便于各类操作并提高工作效率。

#### 准备 ###

创建三个文件demo.html、demo.js和base.js以用于测试。


demo.html结构如下：

	<!DOCTYPE html>
	<html>

	<head>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	    <title>链式调用</title>
	    <meta name="description" content="">
	    <meta name="keywords" content="">
	    <link href="" rel="stylesheet">
	    <script type="text/javascript" src="scripts/base2.js"></script>
	    <script type="text/javascript" src="scripts/demo2.js"></script>
	</head>

	<body>
	    <div id="box">box</div>
	    <p>段落</p>
	    <p>段落</p>
	    <p>段落</p>
	</body>

	</html>


demo2.js保留[JavaScript封装库(1)](http:beyondouyuan.github.io)中demo.js的部分内容，结构如下：


	window.onload = function() {
	    alert(Base.getID('box').innerHTML);
	}



base.js中已经已有Base对象，

首先进行测试，demo.js改为如下：

	window.onload = function() {
	    alert(getID('box'));
	}


测试id为box的类型：

此时浏览器的弹出窗口为：

[object HTMLDivElement]
这是一个HTMLDivElement对象，

若是想链式调用，那么应该是如下：


	window.onload = function(){
	 	Base.getID('box').css('color','red').css('backgroundColor','black').html('更改了的文本...').click(function(){
	 		alert('a');
		});
	}

当然此时到浏览器刷新时肯定是不能得到我们想要的效果的。
浏览器会爆出错误：
Uncaught TypeError: Base.getID(...).css is not a function。
这不是一个函数。

为何呢？因为HTMLDivElement对象根本就没有.css()这个方法。要想使用这个方法，即必须为该对象添加这样的方法，而HTMLDivElement对象是一个原声的对象，我们不直接操作这个对象。
>
不是你的对象不要动 ---------------------《JavaScript最佳实践》
>

所以，若想让div#box使用这个css()方法，那么我们就使div#box返回一个我们自己的对象，那么在此处，css()方法挂载在我们定义Base对象上，所以应该在Base.getID('box')后将其返回为Base对象，如此即可使用Base上的css()方法。


/**
* 对象由属性和方法组成，方法就是该对象内定义的函数
* 即该方法挂载在这个对象上，
* 只有这个对象自身或者这个对象的实例才能调用该方法
* 其他任意一个操作或者函数若想调用某个对象的某方法
* 则必须在操作或者函数的最后返回一个值，
* 且这个值就是这个操作结束后想要调用含有所想调用的摸个方法的对象
* 如：
	function fn1(){
		// do something
		return obj;
	}

	var obj = {}
	obj.prototype.fn2 = function(){
		// do something...
	}
	fn1.fn2()

* 以上以var obj = {}对象式定义的方式只是一个比方，实际上
* obj应该是使用函数式定义一个类(或者说是构造函数)来实现
*
*/



### 分析 ###

	Base.getID('box').css('color','red').css('backgroundColor','black').html('更改了的文本...').click(function(){
		alert('a');
	 });

1.若要实现以上的功能，那么我们就必须知道Base是什么Base是一个基础库的核心对象，也就是说Bases是一个对象Base.getID('box')返回的是一个divElement对象，
 此divElement对象没有css方法，

2.那么我们将Base.getID('box')的返回改成Base即可，则Base.getID('box')的返回将是Base对象而不是divElement对象，此时只需要在Base对象上添加需要使用的想css()等方法即可。

3.Base对象的方法当然是只有是Base对象才能使用，所以若是我们定义了一个Base对象，而又给这个对象添加有css等方法那么只要Base.getID('box')的返回值是Base对象，
那么Base.getID('box')就可以使用css方法此时Base.getID('box').css()才不会报错，其实际上相当于：
Base.css()


4.若是Base.getID('box').css('color','red')返回的也是Base对象，则其无论是多少次调用，链式有多长，返回的总是Base对象，因而可以一直链式调用下去那么自然就可以使用链式调用继续使用Base对象的其他方法总而言之，只要你的操作或者函数方法总是返回Base对象，那么你就可以永无止境d的连续以链式调用的方式不停调用Base对象的方法因为无论如何，对象肯定可以调用自身所包含的方法.若是对象不能调用自身的方法，那，还有枉法吗？？？？？？？

5.在Base对象添加一个css方法，html方法，click方法。这些方法都是属于Base对象的方法，所以只有Base对象可以使用这些方法。而其他任何操作(或者说函数)最终返回的是Base对象，那么该操作或者函数就可以使用Base的方法。所以我们设计的Base对象应该看起来至少像这样：

 	var Base = {}
	Base.prototype.getID = function(id){
		//....
		return Base;
	},

	Base.prototype.css = function(css){
		//....
		return Base;
	},
	Base.prototype.click = function(id){
		//....
		return Base;
	}

如此一来，当我们调用这些方法是实际上像是这样的:

	Base.getID('box').css(// do something)
	那么实际上也就是相当于
	Base.css(// do something)

	Base.getID('box').css(/ do something ).click(// do somthing)实际上也是相当于
	Base.click(// do somthing)

也就是说我们做到了链式调用！


链式调用：
如jquery使用链式一行就为元素连续设置多个样式(颜色，字体)等。

	$().getID('box').css('color','red').html('标题').click(function(){
		alert('a');
	});

使用链式调用快速方便设置节点的属性。

要实现链式调用，则需要将var Base={}对象改写，因为这种对象式的写法无法在他的原型中添加方法，因而需要使用函数式对象写法，那么对base.js进行改写，因为：

	function Base(){
			this.getID = function(id){
				return document.getElementById(id);
		};
	}

这种方式返回的仍然是divElement对象，所以是不符合的。则：

base.js的第一次改写：

	function Base(){
		// 创建一个数组，用于保存获取的节点和节点数组
		// id返回节点，其他方式返回数组

		this.elements = [];
		this.getID = function(id){
			this.elements.push(document.getElementById(id));
			return this;// this就是Base对象本身
		};

		this.getTagName = function(tag){
			this.elements.push(document.getElementsByTagName(tag));
			return this;
		};
	}


	// 由于Base内部已经写了一个获取节点的方法
	// 所以其他的需要链式调用的方法为了与获取节点的方法有所区分
	// 故把其他Base的方法写道Base函数外面
	// 当直接在Base函数外面写时，不能使用this，因为此时的this不再指向Base
	/*
	 this.css = function(){
	 	//...
	 }
	*/

	// 将会报错，this指向全局而不是Base

	// 也不能直接如下：
	/*
	 Base.css = function(){
	 	//...
	 }
	*/
	// 同样会报错，
	// 故要为某个对象(函数也是对象)添加方法，
	// 则应该是在他的原型上添加(写在对象外面时候)


	Base.prototype.css = function(attr,val){
		// this指向Base，
		this.elements[0].style[attr] = val; //此时未遍历，只处理第一个
		return this;
	}

	Base.prototype.html = function(str){
		this.elements[0].innerHTML = str;
		return this;
	}
	Base.prototype.clcik = function(fn){
		this.elements[0].onclick = fn;
		return this;
	}

demo.js改写如下：

	window.onload = function(){
	 	var base = new Base()
	 	alert(base.getTagName('p').elements.length); //3
	 	base.getTagName('p').css('color','blue');
	}

此时运行，会发生什么呢？

打开浏览器，刷新，咦？居然只有第一个P颜色变了，而其他段落颜色没有改变！

这是为何呢？

因为document.getElementsByTagName(tag)返回的将是一个数组，而此时

	Base.prototype.css = function(attr,val){
		this.elements[0].style[attr] = val;
		return this;
	}

该方法只处理了用来存放取得元素的elements数组中的第一个成员而已，若想每一个成员都被处理到，则需遍历：

	this.getTagName = function(tag){
		// 需要进行逐个赋值
		var tags = document.getElementsByTagName(tag);
		for(var i = 0;i < tags.length; i++){
			this.elements.push(tags[i]);
		}
		return this;
	};

且：

	Base.prototype.css = function(attr,val){
		for(var i = 0;i < this.elements.length;i++){
			this.elements[i].style[attr] = val;
		}
		return this;
	}

那么base.js改写如下：


	function Base(){
		this.elements = [];
		this.getID = function(id){
			this.elements.push(document.getElementById(id));
			return this;// this就是Base对象本身
		};

		this.getTagName = function(tag){
			var tags = document.getElementsByTagName(tag);
			for(var i = 0;i < tags.length; i++){
				this.elements.push(tags[i]);
			}
			return this;
		};
	}


	Base.prototype.css = function(attr,val){
		for(var i = 0;i < this.elements.length;i++){
			this.elements[i].style[attr] = val;
		}
		return this;
	}

	Base.prototype.html = function(str){
		for(var i =0;i<this.elements.length;i++){
			this.elements[i].innerHTML = str;
		}
		return this;
	}
	Base.prototype.clcik = function(fn){
		for(var i =0;i<this.elements.length;i++){
			this.elements[i].onclick = fn;
		}
		return this;
	}


而再次在demo.js中测试，

demo.js：


	window.onload = function(){
	 	var base = new Base()
	 	base.getID('box').css('color','red').css('backgroundColor','black');
	 	alert(base.getTagName('p').elements.length);
	 	base.getTagName('p').css('color','blue').css('backgroundColor','green');
	}


我们同时调用几个方法，你会发现一个神奇的现象:
div#box的颜色和背景颜色居然和p的一样，被绿了！
而且，alert(base.getTagName('p').elements.length);的结果不是3而是4！

天！发生了什么？

按理论上讲，我们想要实现的效果应该是Base.getID('box')和Base.getTagName('p')处理不同的元素，且互不相干，但现在的情况确是在后面的语句将前面的语句覆盖掉了。
这说明base.getID('box')和base.getTagName('p')使用的是同一个Base对象的实例，所以他们才会互相影响，若想得到我们想要的各自互不相干的处理方式，实现起来也很简单：

base.getID('box')和base.getTagName('p')不是用同一个实例，而是各自使用专门的实例即可。

那么base.js改写如下：

// 每次调用$()new出一个Base对象，
// 这样就不会是使用同一个Base对象而是后面覆盖前面了


	var $ = function(){
		return new Base();
	}

	function Base(){

		this.elements = [];
		this.getID = function(id){
			this.elements.push(document.getElementById(id));
			return this;// this就是Base对象本身
		};

		this.getTagName = function(tag){
			var tags = document.getElementsByTagName(tag);
			for(var i = 0;i < tags.length; i++){
				this.elements.push(tags[i]);
			}
			return this;
		};
	}


	Base.prototype.css = function(attr,val){
		for(var i = 0;i < this.elements.length;i++){
			// 循环到的每一个对应值都做处理
			this.elements[i].style[attr] = val;
		}
		return this;
	}

	Base.prototype.html = function(str){
		for(var i =0;i<this.elements.length;i++){
			this.elements[i].innerHTML = str;
		}
		return this;
	}
	Base.prototype.clcik = function(fn){
		for(var i =0;i<this.elements.length;i++){
			this.elements[i].onclick = fn;
		}
		return this;
	}

demo.js修改如下：


	window.onload = function(){
		$().getID('box').css('color','red').css('backgroundColor','black');

		$().getTagName('p').css('color','blue');
	}

// 此方法每次使用$()将会创建一个新的Base实例，不会出现覆盖：
// 完美收官