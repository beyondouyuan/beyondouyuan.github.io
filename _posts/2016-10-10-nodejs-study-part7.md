---
layout: post
title: NodeJs初成长(二)之七天学会nodejs(6)
author: beyondouyuan
date: 2016-10-10
categories: blog
tags: [NodeJs,七天学会nodejs]
node: node
description: 休相问，怕相问，相问还添恨。春水满塘生，鸂鷘还相趁。昨夜雨霏霏，临明寒一阵。偏忆戍楼人，久绝边庭信。
---


### 写在前面 ###

事件机制和异步IO是NodeJS的最大特点，其对于开发者并不是透明的，开发者要按异步方式编写代码才能用上NodeJS这个吊吊的特点。

### 回调 ###

在代码中，异步编程最直接的体现就是回调。异步编程依托于回调来实现，但是，使用了回调也不一定是程序异步化了哦：


	function heavyCompute(n,callback){
		var count =0,
		i,j;
		for(i = n;i > 0;--i){
			for(j=n;j>0;--i){
				count +=1;
			}
		}
		callback(count);
	}

	heavyCompute(10000,function(count){
		console.log(count);
	});

	console.log('Hello');

	--------------------------------------console-----------------------------------

	100000000
	Hello


以上：
回调函数仍然先于后续代码执行，JS本身是*单线程*运行的，其不可能再一段代码末段还未结束时去运行别的代码，因此也就不存在异步执行的概念。

但是若某个函数做的事情是创建一个别的线程或者进程，并与JS主线程并行地做某些事，并在事情做完后通知JS主线程，则有所不同：


	setTimeout(function(){
		console.log('World');
	},1000);

	console.log('Hello');

	----------------------------------console-----------------------------

	Hello
	World



以上：

回调函数后于后续代码执行，如上所言，JS本身是单线程的，无法异步执行，因此可以认为setTimeout这类JS规范之外的有运行环境提供的特殊函数做的事情是创建一个平行线程后立即返回，让JS主进程可以接着执行后续代码，并在收到平行进程的通知后再执行回调函数。

>
JS本身是单线程的，这决定了JS在执行一段代码之前无法执行包括回调函数在内的别的代码。也就是说，即是平行线程完成工作了，通知JS主线程执行回调函数了，回调函数也要等到JS主线程空闲才可以开始执行。
>


	function heavyCompute(n){
		var count = 0,
		i,j;

		for(i=n;i>0;--i){
			for(j=n;j>0;--i){
				count +=1;
			}
		}
	}

	var t = new Date();

	setTimeout(function(){
		console.log(new Date - t);
	},1000);


	heavyCompute(10000);

-------------------------------console------------------------------
8520



上例：

本应在1秒后被调用的回调函数因为JS主线程忙于运行其他代码，实际执行时间被大幅延迟。


### 代码设计模式 ###


####  函数返回值 ####


使用一个函数的输出作为另一个函数的输入时常见的需求，同步方式下一班如下：

	var output = fn1(fn2('input'));
	// do somethin


而在异步方式下，由于函数执行结果不是通过返回值，而是通过回调函数传递：


	fn2('input',function(output2){
		fn1(output2,function(output1){
			//do somethin
		});
	});


#### 遍历数组 ####


在遍历数组是，使用某个函数一次对数据成员做一些处理，如是同步执行，则一般如下：

	var len = arr.length,
	i=0;

	for(;i<len;++i){
		arr[i] = sync(arr[i]);
	}

	// 数组所有成员均被遍历


若是异步执行，以上代码就无法保证循环结束后所有数组成员都处理完毕了，若数组成员必须一个接一个的串行处理，则一般如下：

	(function next(i,len,callback){
		if(i < len){
			async(arr[i],function(value){
				arr[i] = value;
				next(i+1,len,callback);
			});
		}	else{
				callback();
		}
	}(0,arr.length,function(){
		//所有数组成员均被遍历
	}));


以上：
异步函数执行一次并返回执行结果后才传入下一个数据成员并开始下一轮执行，知道所有数组成员均被处理完毕后，通过回调的当时出发后续代码的执行。

若是数组成员可以并行处理，但后续代码仍然需要所有数组成员处理完毕后才可执行，则一般如下：


	(function(i,len,count,callback){
		for(;i < len; ++i){
			(function(i){
				async(arr[i],function(value){
					arr[i] = value;
					if(++count === len){
						callback();
					}
				});
			}(i));	//此处倒像是JS常用闭包方(或者更确却的硕士计数器变量)式存储循环中的值以便在循环结束后还可以拿到每一次的循环之而不是拿到循环结束后的最后一个值
		}
	}(0,arr.length,0,function(){
		// 数组所有成员均被遍历
	}));


#### 异常处理 ####


JS自身提供异常捕捉和处理机制————try..catch...，其只能用于同步执行的代码：

	function sync(fn){
		return fn();
	}
	try{
		sync(null);
		//do something
	} catch(err){
		console.log('Erro: %s',err.message);
	}

----------------------------------console--------------------------------------

Erro:object is not a function

以上：
异常会沿着代码执行路径一直冒泡，知道遇到第一个try语句时被捕获住，但由于异步函数会打断代码执行路径，异步函数执行过程中以及执行之后产生的异常冒泡到执行路径被打断的位置时，若一直没有遇到try语句，就作为一个全局异常抛出：


	function async(fn,callback){
		// Code execution path breaks here//执行路径打断处
		setTimeout(function(){
		callback(fn());
		},0);
	}

	try {
		async(null,function(data){
			//do something
		});
	} catch(err) {
		console.log('Erro:%s',err.message);
	}

--------------------------console-----------------------------------

	/home/user/test.js:4
			callback(fn());
					  ^
	TypeError:object is not a function

		at null._onTimeout(/home/user/test.js:4:13)
		at Timer.listOnTimeout[as ontimeout](timers.js:110:15)

因为代码执行路径被打断，需要在异常冒泡到断点之前用try语句把异常捕获住，并通过回调函数传递被捕获的异常：

	function async(fn,callback) {
		// Code execution path breaks here.
		setTimeout(function() {
			try {
				callback(null,fn());
			} catch(err) {
				callback(err);
			}
		},0);
	}

	async(null,function(err,data) {
		if (err){
			console.log('Error: %s',err.message);
		} else {
			// Do something.
		}
	});

-- Console ------------------------------
Error: object is not a function


以上：
异常再次被捕获住，在NodeJS中，几乎所有的异步API都按照以上方式设计。


有了异常处理方式后，我们接着可以想一想一般我们是怎么写代码的。基本上，我们的代码都是做一些事情，然后调用一个函数，然后再做一些事情，然后再调用一个函数，如此循环。如果我们写的是同步代码，只需要在代码入口点写一个try语句就能捕获所有冒泡上来的异常：

	function main() {
		// Do something.
		syncA();
		// Do something.
		syncB();
		// Do something.
		syncC();
	}
	try {
		main();
	} catch (err) {
		// Deal with exception.
	}



但是，若是写的是异步代码，就有趣了。由于每次异步函数调用都会打断代码执行路径，只能通过回调函数来传递异常，于是我们就需要在每个回调函数里判断是否有异常发生，于是只用三次异步函数调用：

	function main(callback) {
	    // Do something.
	    asyncA(function(err, data) {
	        if (err) {
	            callback(err);
	        } else {
	            // Do something
	            asyncB(function(err, data) {
	                if (err) {
	                    callback(err);
	                } else {
	                    // Do something
	                    asyncC(function(err, data) {
	                        if (err) {
	                            callback(err);
	                        } else {
	                            // Do something
	                            callback(null);
	                        }
	                    });
	                }
	            });
	        }
	    });
	}
	main(function(err) {
	    if (err) {
	        // Deal with exception.
	    }
	});



可以看到，回调函数已经让代码变得复杂了，而异步方式下对异常的处理更加
剧了代码的复杂度。如果NodeJS的最大卖点最后变成这个样子，那就没人愿意
用NodeJS了，因此接下来会介绍NodeJS提供的一些解决方案：


#### 域(Domain) ####

[官方文档](http://nodejs.org/api/domain.html)

有如grails下的domain类，用于业务代码


NodeJS提供了domain模块，可以简化异步代码的异常处理。
>
简单的讲，一个域就是一个JS运行环境，在一个运行环境中，如果一个异常没有被捕获，将作为一个全局异常被抛出。NodeJS通过process对象提供了捕获全局异常的方法。
>

示例代码如下：


	process.on('uncaughtException', function(err) {
	    console.log('Error: %s', err.message);
	});
	setTimeout(function(fn) {
	    fn();
	});
	---------------------------------------Console---------------------------------------
	Error: undefined is not a
	function



虽然全局异常有个地方可以捕获了，但是对于大多数异常，我们希望尽早捕获，并根据结果决定代码的执行路径。我们用以下HTTP服务器代码作为例子：



	function async(request, callback) {
	    // Do something.
	    asyncA(request, function(err, data) {
	        if (err) {
	            callback(err);
	        } else {
	            // Do something
	            asyncB(request, function(err, data) {
	                if (err) {
	                    callback(err);
	                } else {
	                    // Do something
	                    asyncC(request, function(err, data) {
	                        if (err) {
	                            callback(err);
	                        } else {
	                            // Do something
	                            callback(null, data);
	                        }
	                    });
	                }
	            });
	        }
	    });
	}
	http.createServer(function(request, response) {
	    async(request, function(err, data) {
	        if (err) {
	            response.writeHead(500);
	            response.end();
	        } else {
	            response.writeHead(200);
	            response.end(data);
	        }
	    });
	});



以上代码将请求对象交给异步函数处理后，再根据处理结果返回响应。


为了让代码好看点，我们可以在每处理一个请求时，使用domain模块创建一个子域（JS子运行环境）。在子域内运行的代码可以随意抛出异常，而这些异常可以通过子域对象的error事件统一捕获。于是以上代码可以做如下改造：


	function async(request, callback) {
	    // Do something.
	    asyncA(request, function(data) {
	        // Do something
	        asyncB(request, function(data) {
	            // Do something
	            asyncC(request, function(data) {
	                // Do something
	                callback(data);
	            });
	        });
	    });
	}
	http.createServer(function(request, response) {
	    var d = domain.create();
	    d.on('error', function() {
	        response.writeHead(500);
	        response.end();
	    });
	    d.run(function() {
	        async(request, function(data) {
	            response.writeHead(200);
	            response.end(data);
	        });
	    });
	});



以上：
使用.create方法创建了一个子域对象，并通过.run方法进入需要在子域中运行的代码的入口点。而位于子域中的异步函数回调函数由于不再需要捕获异常。


#### 陷阱 ####


无论是通过process对象的uncaughtException事件捕获到全局异常，还是通过子域对象的error事件捕获到了子域异常，在NodeJS官方文档里都强烈建议处理完异常后立即重启程序，而不是让程序继续运行。按照官方文档的说法，发生异常后的程序处于一个不确定的运行状态，如果不立即退出的话，程序可能会发生严重内存泄漏，也可能表现得很奇怪。


JS本身的throw..try..catch异常处理机制并不会导致内存泄漏，也不会让程序的执行结果出乎意料，但NodeJS并不是存粹的JS。NodeJS里大量的API内部是用C/C++实现的，因此NodeJS程序的运行过程中，代码执行路径穿梭于JS引擎内部和外部，而JS的异常抛出机制可能会打断正常的代码执行流程，导致C/C++部分的代码表现异常，进而导致内存泄漏等问题。


#### 小结 ####

1. 不掌握异步编程就不算学会NodeJS。

2. 异步编程依托于回调来实现，而使用回调不一定就是异步编程。

3. 异步编程下的函数间数据传递、数组遍历和异常处理与同步编程有很大差别。

4. 使用domain模块简化异步代码的异常处理，并小心陷阱。


-----------------------------------------------------------------


						下一站 天后！


-----------------------------------------------------------------