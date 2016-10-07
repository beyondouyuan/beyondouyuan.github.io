---
layout: post
title: JavaScript+DOM编程艺术(一)
author: beyondouyuan
date: 2016-10-02
categories: blog
tags: [JavaScript]
javascript: javascript
description: 牡丹含露真珠颗，美人折向庭前过，含笑问檀郎，花强妾貌强？　檀郎故相恼，须道花枝好。一面发娇嗔，碎挼花打人。
---

### 写在前面 ###

JavasSript DOM操作是前端开发中至关重要的一部分，几乎大部分的JavaScript是基于DOM展开的。

本系列将以《JavaScript DOM编程艺术第三版》为参考。

第一部分主要为复习JavaScript的一些主要的基础知识。

以上


### 什么是DOM ###

>
简单地说，DOM是一套对文档的内容进行抽象和概念化的方法。
>

 &&1 语法

用JavaScript或者任何一种其他程序设计语言编写出来的脚本都是由一系列指令构成的，这些指令称为语句(staterment)。

每条JavaScript语句以分号作为结束分隔：
	first staterment1;second staterment2;
或者：
	first staterment1;
	second staterment2;

 &&2 注释(comment)

注释语句在JavaScript程序中不会被执行，用于提供参考或者提示性信息。
注释语句还是非常有用的，它们可以让你把编写代码是的一些想法或者考虑记载下来供今后参考，还可以帮助你追踪有关代码的执行流程。
	// 单行注释语句
	/*
	多行注释语句
	*/
	当然也可以使用HTML风格的助兴，但是这只适用与单行注释
	<!-- javascript 单行注释-->
	(实际上在JavaScript使用HTML风格时可以不需要最后面的 -->)

 &&3 变量

会发生变化的东西被称为变量(variable)，把值存入变量的操作称为赋值(assignment)。

Javascript中的变量使用var关键字进行声明，由于JavaScript属于弱类型的语言，因此在声明变量时无需定义其类型：

	var a = "";

>
注意,JavaScript允许直接对变量进行赋值。
>

在对JavaScript变量进行声明时，最佳实践不是每次只声明一个对象，如下：
var a;var b;
最佳实践是像链式操作一样一次声明多个变量，每个变量之间以逗号分隔：

	var a,b,c,
	//或者在声明变量的同时为变量赋值：
	var a = 1,b = 3, c = 3;

JavaScript语法对字母大小写敏感。

JavaScript语法不允许变量的名字中包含空格或者标点符号($除外)。
JavaScript变量名允许包含字母、数字、美元符号$或下划线。

 &&4 数据类型

1.字符串

字符串由零个或者多个字符构成，字符包括数字、字母、标点符号和空格，字符串必须放在引号里，单双引号皆可。

2.数值

Javascript允许使用带小数点的数值且可以是任意位数，将数值赋值给变量时数字无需被引号包裹：

	var a = 1;
	var b = 1.222;

 &&4 布尔值

boolean类型只有两种可取值：true或者false，代表真或者假。
boolaen不可使用括号包裹，或者将不再是布尔类型，而是字符串。

 &&5 数组

字符串、数值和布尔值都属于离散数值(scalar)，如果某个变量是离散的，那么他任意时刻只能有一个值，若要变量存储一组数值，则需要使用数组(array)。

数组是由名字相同的多个值构成的一个集合，集合中的每个值都是这个数组的元素(element)。

JavaScript中，数组使用关键字Array声明，在声明数组的同时，还可以对该数组的元素个数，也即数组的长度(length)做出规定，不过通常情况下不会设定数组长度，因为可能我们无法预知数组最终会容乃多少元素。

向数组中添加元素的操作称为填充(populating)。在填充数组时，不仅需要给出新元素的值，还需要在数组中为新元素指定存放的位置，这个位置通过下标(index)给出。数组每个元素都有一个相应的下标，在语句中，下标值必须放在方括号内，如：
array[index] = element;

数组下标以0而不是1作为第一个值。

	var beatles = array();
	beatles[0] = "John";
	beatles[1] = "Paul";
	beatles[2] = "George";
	beatles[3] = "Ringo";

>
请注意，beatles数组的长度是4，但是他最后一个元素的小标确实3，因为数组下标是从0开始计数的。
>

当然若是想以上那样填充数组未免麻烦，使用更简单一点的方式，声明数组的同时便对它进行填充，各个元素之间使用逗号分隔即可：

	var beatles = Array("John","Paul","George","Ringo");

以上的数组声明方式会自动为每个元素分配一个从0开始的下标。如此便使得数组声明简单了许多。

但在实际开发当中，我们甚至不会明确的使用Array关键字来表明我们是在创建数据，事实上，只需要一对方括号把各个元素的初始值括起来就足以创建出我们想要的数组了：

	var beatles = ["John","Paul","George","Ringo"];

这更酷更拽是不是？

当然，数组元素不必非得是字符串，我们可以将布尔值放入其中，还可以是把一组数值存放到数组中：

	var years = [2010,2011,2012,2013,2014,2015];

甚至是可以把三种混合的数据类型放在一个数组中：

	var person = ['name',21,false];

数组元素还可以是变量：

	var name = 'Irving';

	person[0] = name;

这样数组person的第一个元素将被赋值为Irving；

数组元素的值还可以是另一个数组的元素：

	var person = ["ouyuan","oujunyuan","Irving"];
	// 声明一个空数组
	var people = [];

	people[0] = person;

现在people数组的第一个元素的值是另一个数组，要想获得那个数组里的某个元素的值，则需要更过的方括号：


people[0][0]的值是ouyuan，people[0][1]的值是oujunyuan。

 &&6 关联数组

beatles数组是一个数值数组的一个典型例子：每个元素的下标是一个数字，每增加一个元素，这个数字就依次增加1.第一个元素的下标是0，第二个元素下标是1，一次类推，最后一个元素的下标则是arry.lenght-1；

如果在填充数组时只给出了元素的值，这个数组就将是一个数值数组，他的各个元素的下标将被自动创建和刷新。

我们可以通过在填充数组时为每个新元素明确地给出下标的方式来改变这种默认的行为，在为新元素给出下标时，不必局限与整数数字。数组下标可以是字符串：

	var lennon = Array();

	lennon["name"]   = "John";
	lennon["age"]    = 1940;
	lennon["living"] = false;

lennon这样的数组被称为关联数组(associative array)；从某种意义上讲，完全可以把所有的数组都看作是关联数组，尽管数值数据的下标是由系统自动船舰的一些数值，但每个下标仍关联着一个特定的值，因此，数值数组完全可以被当作关联数组的一种特例来对待。

关联数组代替数值数组的做法意味着，我们可以通过个元素的名字而不是一个下标数字来引用它们，这可以极大地提高脚本可读性。


### 条件语句 ###

脚本真正的威力体现在特们可以根据人们给出的各种条件作出判断和决策，JAvaScript脚本需要使用天骄语句来做判断和决策

 &&1 if语句

在解释脚本时，浏览器依次执行脚本中的各条语句，而利用条件语句可以设置一个条件，只有满足了这一条件才能让更多的语句得到执行，而最常见的语句就是if语句：

	if(condition){
		staterment;
	}

条件必须放在if之后的圆括号中，条件的求值结果永远是一个布尔值，即只能是true或者false。花括号中的语句--不管他们有多少条，只有在给定条件的求值结果是true的情况下才会被执行。

if语句可以使用else来扩展，包括在else子句中的语句会在给定if圆括号中的条件值为false时被执行：

	if(1 > 2){
		alert("A U K M?");
	} else{
		alert("I'm fine!");
	}


### 循环语句 ###

if语句虽然可能是最重要、最常用的条件语句，但是他却不可以用来完成重复性的操作，在if语句中，包括在花括号里的代码块只能执行一次。若要反复多次执行同一段代码，则必须使用循环语句。

原理：只要给定条件仍能满足，包含在循环语句中的代码将会重复执行下去。一旦给定条件求值结果不再是true，循环将结束。

 &&1 while语句

	while(condition){
		staterment;
	}
	var i=1;
	while(i<11){
		alert(i);
		i++;
	}

分析：
只要条件猫组i<11，就重复执行i++；这一操作重复执行10次，alert()弹出10次，当循环语句执行完毕，i变为11；

 &&2 do...while

while花括号内的语句可能一次都不会执行，因为对循环控制条件的求值发生在每次循环开始之前，若是循环控制条件的首次求值结果为false，则代码一次也不会被执行

	do{
		staterment;
	} while(condition);

与while语句的区别：
对循环控制条件的求值发生在每次循环结束之后，因此，即使控制循环条件的首次求值结果是false，包含在花括号里的代码会至少被执行一次，

	var i =1;
	do{
		alert(i);
		i++;
	} while(i<11);

其结果与上一个while语句无异。alert()弹出10次，当循环语句执行完毕，i变为11；

	var i = 1;
	do{
		alert(i);
		i++;
	} while(i <1);

此do循环中，循环控制条件求值结果永远不为true，变量i的初始值是1，所以他在这里永远不会小于1，但是，do循环的循环控制条件出现在花括号之后，所以包含在这个do循环内部的代码还是执行了一次，也就是说，仍能看到一条alert()信息，

注意：
>
这些语句执行完毕后，变量i的值将是2而不是1——i++也执行了一次——虽然循环条件求值结果是false。
>


### for语句 ###

大名鼎鼎的for！
其与while很相像

	//初始条件
	initialize;
	while(condition){
		staterment;
		//改变条件
		increment;
	}


	for(initial condition;test condition;alter condition){
		staterment;
	}

for循环中，所有与循环有关的内容不都包含在for语句的圆括号中。

for循环最常用与对某个数组里的全体元素进行遍历处理，这往往需要用到数据的array.lenght属性，这一属性可以告知我们在给定的数组里的元素的个数。

	var beatles = ["John","Paul","Gerge","Ringo"];
	for(var i = 0; i < beatles.lenght; i++){
		alert(beatles[i]);
	}


### 函数 ###

若需要多次使用同一组语句，还可以把它们打包为一个函数。所谓函数(function)就是一组允许在代码里随时调用的语句，每个函数相当于一个短小的脚本。

	function shout(){
		var beatles = ["John","Paul","Gerge","Ringo"];
		for(var i = 0; i < beatles.lenght; i++){
			alert(beatles[i]);
		}
	}

若在几处地方需要做相同的事情：
定义一个数组beatles，循环遍历弹出数组每一个元素。

比如home页面需要做一次上面的事情，about页面同样需要做一次上面一样的事情，则通过函数这种方式可以将相同甚至是相似(逻辑相似，根据传入参数得到不同结果)的一段代码封装起来，然后在多处地方在需要使用这一相同的代码时，直接调用这个函数，即可实现代码重用，而不必在每一个需要做
>
	var beatles = ["John","Paul","Gerge","Ringo"];
	for(var i = 0; i < beatles.lenght; i++){
		alert(beatles[i]);
	}
>

这个同样的事情时又写一次，减少了代码量，也便于代码维护。不过函数真正威力体现在，我们可以把不同的数据传递给他们，而他们将使用实际传递给他们的参数去完成预定的操作。传递的数据即为参数(argument)。

>
当然了，封装函数的初始方法就像这里这个shout()函数一样，使用硬编码(常量)将一些写定写死(所谓定制化，所得到的结果将是相同的结果)传入实在，更高级的方式是将这个函数抽象出来，使用变量代替硬编码(常量)作为形参，然后在调用这个函数时候传入实参给形参，从而可以根据传入不同的参数得到不一样的结果。这在后续在做详细学习。
>
>
所谓抽象，即是隐藏具体实现过程，而只呈现逻辑实现，
>


如下：

	function alertName(name){
		alert(name);
	}

alertName(name)函数是一个封装了一条语句alert(name)；他是一个被抽象了的函数，实现逻辑是根据传入的name值alert()初name的值。传入不同的name值alert()弹出的结果将会不一样，如下调用函数：

	alertName("ouyuan"); --->> alert("ouyuan")

	alertName("oujunyuan"); --->> alert("oujunyuan");

再如下：

	function alertSomeName(){
		alert("ouyuan");
	}

调用函数：

	alertSomeName(); --->> alert("ouyuan");

alertSomeName()函数是一个定制化了的函数，其结果是固定的，永远都是弹出ouyuan，而不可能有其他结果。他是一个具体化了具体实现过程(不管三七二十一，我就是要输出帅哥ouyuan！)的函数。
而alertName(name)则是一个仅体现出逻辑的被抽象了的函数，显而易见，alertName(name)更为强大。


函数不仅能够以参数的形式接收数据，还可以返回数据。若是一个函数中不明确的使用return语句，则这个函数的返回值是undefined；

	function multiply(num1,num2){
		var total = num1 * num2;
		return total;
	}

	function covertToCelsius(temp){
		var result = temp -32;
		result = result/1.8;
		return result;
	}

函数的真正价值体现在，我们还可以把它们当作一种数据类型来使用，这意味着我们可以把一个函数的调用结果赋值给一个变量。

	var temp_fahrenheit = 95;
	var temp_celsius = covertToCelsius(temp_fahrenheit);
	alert(temp_celsius);

以上代码执行弹出35，这个数值由covertToCelsius函数返回。
以上，若是covertToCelsius函数中不使用return result语句，这该函数照常执行了result = result/1.8;
但是alert(temp_celsius)将是undefined；

对于一些函数我们并不需要返回的数据，如对导航条的a标签进行点击然后更改它的css样式，这个我们在点击函数中就无需使用return语句返回任何数值。

但是对于一些函数(需要获取某些数据提供给另一个函数使用时)则需要返回语句，否则将是undefined报错。

如有一个函数(fun1)需要获取导航a标签的id，然后在下一次或者另外一个地方改变他的id值，则我们就需要一个函数(fun2)在点击a标签是获取它的id值，并且返回给一个变量(result)，然后再把这个变量传递给fun1，如此即可。

### 变量作用域 ###

变量一般分为全局变量，局部变量。JavaScript没有块级语句，而只有作用域。

全局变量：可以在脚本中的任何位置被引用，其作用域是整个脚本。

局部变量：只存在与对他做出声明的那个函数的内部，整个函数的外部(以及其他函数)无法引用它，其作用域仅限于某个特定的函数。

函数内部可以引用全局变量。

如果在某个函数中使用var关键字声明了一个变量a，那么a将被视为局部变量，他只存在于这个函数上下文，反之，如果没有使用var关键字，即使是在函数之中，且全局中没有这个变量名(如a)，那么这个变量a也会被视为全局变量而不是局部变量。如果全局中有相同名字的变量，那么，后出现的会覆盖前面出现的那一个同名变量。


	function square(num){
		// 此处的total没有使用var声明，故其即是全局变量
		total = num * num;
		return total;
	}
	var total = 50;//全局变量
	var number = square(20);
	alert(total);

全局变量total变为了400。实际上我的本意是让square()函数值把它计算出来的平方返回给number(而不做其他任何的操作/修改)，但因为未在这个函数内部使用var关键字把它内部的total变量声明为局部变量，这个函数把同名全局变量total的变量值也改变了。

正确的方式如下：


	function square(num){
		// 此处的total使用var声明，故其是局部变量
		var total = num * num;
		return total;
	}
	var total = 50;//全局变量
	var number = square(20);
	alert(total);-->此处的total是全局变量。


### 对象 ###

对象(object)是JavaScript中极其重要的数据类型。

对象是自我包含的数据集合，包含在对象里的数据可以通过两种方式——属性(property)和方法(method)访问。

- 属性是隶属于某个特定对象的变量；

- 方法是只有某个特定对象才能调用的函数。

对象就是由一些彼此相关的属性和方法集合在一起而构成的一个数据实体(即对象是所有属性和方法的统称)。

JavaScript中，对象的属性和方法均使用“.”语法访问，

	Object.property;
	Object.method();

假设有一个名为Person的对象，该对象有name、age、mood等属性，并关联着一些walk()、sleep()之类的函数。

为了使用Person对象描述一个特定的人，需要创建一个Person对象的实例(instance)，实例是对象的具体表现，对象是抽象的统称，实例是个体(如，你我都是人，都可以使用Person对象来描述，但你我是两个不同的个体(实例)，不同的实例可能属性不同，如你我名字年龄不同，则你我对应着两个不同的对象，虽然都是Person对象，确实两个不同的实例)。

创建对象：

	var ouyuan = new Person;

以上创建出一个Person对象的实例ouyuan，有此实例后则可利用Person对象的属性来检索关于ouyuan的信息了：

	ouyuan.age;
	ouyuan.mood;

 &&1 内建对象

如数组即是一种JavaScript内建对象，当我们使用new关键字去初始化一个数据是，其实是创建一个Array对象的实例：

	var beatles = new Array();


 &&2 宿主对象

除了Array()、Date()等内建对象，JavaScript脚本中还有其他的一些与定义的对象，他们不是由JavaScript语言本身而是由他的运行环境(如浏览器)提供的，宿主对象主要包括Form、Image和Element。通过这些对象可以获得给定网页上的表单、图像和各种表单元素的信息。

Javascript+DOM编程艺术 第一章完结！

