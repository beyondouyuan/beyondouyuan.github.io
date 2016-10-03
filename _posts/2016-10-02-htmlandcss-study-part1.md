---
layout: post
title: Css的那些事儿(一)基础篇(1)
author: beyondouyuan
date: 2016-10-03
categories: blog
tags: [前端,css]
htmlcss: htmlcss
description: 去年今日落花时，伊前又见依。淡匀双脸浅匀眉，青衫透玉肌。才会面，便相思，相思无尽期。这回相见好相知，相知已是迟。
---


###  去年今日落花时，花落知多少 ###

 &&1  css正传

学习css(层叠样式表)最好的方法就是不断地做，不断地想，不断地实战。大多的理论知识最终只能是指向谈兵。

 &&2 网页美容师

北方有佳人，绝世而独立。
一顾倾人城，再顾倾人国。
宁不知倾城与倾国，佳人难再得。

css(Cascading Style Sheets)由w3c的css工作组创建和维护，无需编辑，增强控制网页样式并允许将样式信息与网页内容分离，实现网页美化，故css被称为网页美容师。

 &&3  css基本结构

- 选择符(selecter):向浏览器声明该样式将匹配于页面中的那些对象，如tag选择器，class选择器，id选择器，当然也可使用选择符组合。

- 声明：告诉浏览器怎样去渲染页面中与选择符匹配的对象，由属性与属性值组成，冒号像个，分号结束。

- 属性(property)：属性主要以一个单词形式出现，且都是css约定而不是自定义的，除一些浏览器私有属性外。

- 属性值：属性值将根据属性而改变形式，包括数值和单位，以及一些关键字。

则css结构一般如下：

1.声明紧跟着选择符，并被花括号包含着。

2.每个声明的属性跟属性值之间使用冒号隔开，分号结束。

3.花括号及分号前后的空格可选

4.属性值名称过程并带有空格，则必须将属性值使用引号包含，如"sans serif"。


 &&4 css注释

任何产品都带有说明书，任何代码都不可缺少必要的注释
注释不单单只是对代码进行注释，还可用于文件版本以及版权进行声明

css注释语句：
/*注释语句*/

 &&5 css简写

颜色缩写：
- 十六进制 #RRGGBB --> p {color:#ff00ff;}

- RGB函数值 rgb(r,g,b)[r,g,b数值在0~255之间] --> p{color:125,0,12;}

- 颜色名称 red、green。


单位值缩写：

css单位值的省略主要体现在当数值为0时，无论是什么形式的单位都可以省略，如width:0px --> width:0;height:0% --> height:0;

 &&6 内外补丁简写

内补丁padding以及外补丁margin属性均有四个属性，记忆口诀 --> 从左到右，上右下左。
即padding-top、padding-right、padding-bottom、padding-left，
将其简写，就是把四个属性和槟城一个padding和margin即可

- property:value1;表示四个边都是一个值value1。

- property:value1 value2;往来循环对应上右下左，top和bottom值均为value1，left和right值均为value2。

- property:value1 value2 value3;top值为value1，right和left均为value2，bottom值为value3，

- property:value1,value2,value3,value4，top值为value1，right值为value2，bottom值为value3，left值为value4。


 &&7 border简写

边框属性较为复杂，一般由border-width、border-style、border-color三组属性组成，如：

	div {
		border-width:1px;
		border-style:solid;
		border-color:#aaa;
	}

合并为一个属性：

	div{
		boder:1px solide #aaa;
	}

只需要记得boder属性基本语法是border-width || border-style || border-color

边框具有4个方向的属性，即：

	border-top、border-right、border-bottom、border-left。

在css中定义的样式，具有上右下左4个方向的属性，一般情况都是按顺时针的方向进行记忆。

边框的这4个方向属性不具备简写条件，如当你想实现四个边框宽度不一样时，不可做一下简写：
	div {
		border:1px 2px 3px 4px;
	}
而只能写成：
	div {
		border-width:1px 2px 3px 4px;
	}

|
|
^

但却可以在border-width、border-style、border-color中体现，如：

	div {
		border-width:1px; /*定义边框4个方向宽度都为1px*/
		border-style:solid dashed double; /*定义上边框为实现，左右边框为虚线，下边框为双线边框*/
		border-color:#aaa #000;/*定义上下边框为红色，左右边框为黑色*/
	}


 &&8 背景简写

	background:background-color || background-image || background-repeat || background-attachment || background-position。

当然定义北京并不需要将所有属性都用上，浏览器会将为定义的相关背景属性用其默认值来表现，个属性默认值如下：

	background-color:transparent;
	background-image:none;
	background-repeat:repeat;
	background-attachment:scroll;
	background-position:0% 0%;

 &&9 字体简写

	body {
		font-style:italic; /*定义字体为斜体*/
		font-variant:small-caps; /*定义字体为小型大写字母[针对英文]*/
		font-weight:bold; /*定义字重(加粗)*/
		font-size:14px; /*定义字体大小为12px*/
		font-height:140%; /*定义字体行高*/
		font-family:"Lucida Grande",sans-serif; /*定义字体名称*/
	}

字体简写与背景属性并不完全一致，
	font:font-style || font-variant || font-weight || font-size || line-height || font-family

	body {font:italic small-caps bold 14px/140% "Lucida Grande",sans-serif;}

字体大小及行高之间不是以空格隔开，而是以斜杠/分割；

 &&10 列表简写

有序列表(ol)以及无序列表(ul)：
属性设置中list-style属性必不可少，且list-style属性是复合属性，该属性有list-image(列表项li标记的图片)、list-style-position(作为对象的列表项li标记的定位)以及list-style-type(对象的列表项所使用的预设标记)。

语法为：

	list-style:list-style-image || list-style-position || list-style-type


如：
	li{
		list-style-type:square;/*列表项预定设为实心方块*/
		list-style-position:inside; /*项目标记放置在文本以内，且还要文本根据标记对齐*/
		list-style-image:url(images.jpg);/*使用图片覆盖预设标记*/
	}

简写为

	li{
		list-style:url(images.jpg) inside square;
	}

三个属性并不完全需要，可选则省略，省略部分由默认值代替。

