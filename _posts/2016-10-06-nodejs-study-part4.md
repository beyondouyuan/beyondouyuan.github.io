---
layout: post
title: NodeJs初成长(二)之七天学会nodejs(3)
author: beyondouyuan
date: 2016-10-06
categories: blog
tags: [前端,NodeJs,七天学会nodejs]
node: node
description: 美酒清若空，邀月笑西风。年华逝水一杯中，霜鬓映残红。十杯始味浓，故地与君同。江湖一入去匆匆，青陌忆短篷。莫欺少年穷，他朝鱼化龙。功名快意三百盅，马放南山松。谅我不羁李太白，一饮千杯醉不还。纵横天地间，何曾拜曹蛮！
---

###  写在前面 ###

昨夜夜半，枕上分明梦见。语多时，依旧桃花面，频低柳叶眉。半羞还半喜，欲去又依依。觉来知是梦，不胜悲。莫道夜深销魂时，把酒邀月撸代码！

撸完代码之后已是无眠，那边酌小酒，更blog！


##  第三天 文件操作 ##


前端变得神奇不是NodeJS能做网络编程，而是NodeJS能够操作文件。

### 开门红 ###

NodeJs提供了基本的文件操作API，以下以文件拷贝程序为例。该程序需要能够接受源文件路径和目标路径两个参数。


### 小文件拷贝 ###

使用NodeJS内置模块fs简单实现这个程序：

	var fs = require('fs');

	function copy(src,dst){
		fs.writeFileSyns(dst,fs.readFileSync(src));
	}

	function main(argv){
		copy(argv[0], argv[1]);
	}

	main(process.argv.slice(2));



以上程序使用fs.readFileSync从源文件读取文件内容，并使用fs.writeFileSync将文件内容写入目标路径(src为源文件路径，dst为目标路径)。

>
process是一个全局变量，可通过process.argv获得命令行参数。由于argv[0]固定等于NodeJS执行程序的绝对路径，argv[1]固定等于主模块的绝对路径，因此第一个命令行参数从argv[2]开始。
>

### 大文件拷贝 ###

当需要一次性把所有文件内容都读取到内存中后再一次性写入磁盘时，以上例子不足胜任，内存将会爆仓。对于大文件，只能读一点写一点，知道拷贝完成(像流水一样，所以Java等语言中有文件流[inputStream]的处理方式)。将程序做修改如下：

	var fs = require('fs');

	function copy(src,dst){
		fs.createReadStream(src).pipe(fs.createWriteStream(dst));
	}

	function main(argv){
		copy(argv[0],argv[1]);
	}

	main(process.argv.slice(2));


以上程序使用fs.createReadStream创建了一个源文件的只读数据流，并使用fs.createWriteStream创建了一个目标文件的只写数据流，并且使用pipe方法把两个数据流链接起来。连接起来后发生的事情，就像是水管从一个捅流向另一个捅。



## API走马观花 ##

### Buffer(数据块) ###

- [官方文档](http://nodejs.org/api/buffer.html)

JS语言自身只有字符串数据类型，没有二进制数据类型，NodeJS提供了一个与String对等的全局构造函数Buffer以提供对二进制数据的操作，除了可以读取文件得到Buffer的实例外，还可以直接构造，例如：

	var bin = new Buffer([0x68, 0x65, 0x6c, 0x6f]);

Buffer与字符串相似，除了可以使用.lenght属性得到字节长度外，还可以使用[index]方式读取指定位置的字节：

	bin[0] //=> 0x68;

Buffer与字符串能互相转化，例如可以使用指定编码将二进制数据转化为字符串：

	var str = bin.toString('utf-8');// => "hello"

或者反过来，将字符串转换为指定编码下的二进制数据：

	var bin = new Buffer('hello','uft-8'); // => <Buffer 68 65 6c 6f>

Buffer与字符串有个重要的区别，字符串是只读的，并且对字符串的任何修改得到的都是一个新的字符串，原字符串保持不变。而buffer，更像是可以做指针操作的C语言数组：

	bin[0] = 0x48;

而.slice()方法也不是返回一个新的Buffer，而更像是返回了指向原Buffer中间的某个位置的指针：

	[0x68, 0x65, 0x6c, 0x6f]
	  |			   |
	 bin		 bin.slice(2)


因此对.slice()方法返回的Buffer的修改会作用域原Buffer：

	var bin = new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
	var sub = bin.slice(2);

	sub[0] = 0x65;

	console.log(bin); // => < Buffer 68 65 65 6c 6f >

所以，当想要拷贝一份Buffer，得首先船舰一个新的Buffer，并通过.copy()方法把原Buffer中的数据复制过去。这类似与申请一块新的内存，并把已有内存中的数据复制过去：

	var bin = new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
	var dup = new Buffer(bin.lenght);

	bin.copy(dup);
	dup[0] = 0x48;

	console.log(bin) // => < Buffer 68 65 6c 6c 6f >
	console.log(dup) // => < Buffer 48 65 65 6c 6f >


### 数据流 ###

- [官方文档](http://nodejs.org/api/stream.html)

当内存无法一次装下需要处理的数据时，或者一边读取以便处理更加高效时，则需要使用数据流。NodeJS通过各种Stream来提供对数据流的操作，以上边大文件考位程序为例，为数据来源创建一个只读数据流：

	var rs = fs.createReadStream(pathName);
	rs.on('data',function(chunk){
		doSomething(chunk);
	});

	rs.on('end',function(){
		cleanUp();
	});


>
Stream基于事件机制工作，所有的Stream的实例都继承与NodeJS提供的[EventEmiter](https://nodejs.org/api/events.html)
>

上边的代码中data事件会源源不断地被触发，不管doSomething()函数是否处理得过来。代码可以继续如下修改，以解决这个问题：

	var rs = fs.createReadStream(src);

	rs.on('data',function(chunk){
		rs.pause();
		doSomething(chunk,function(){
		rs.resume();
		});
	});

	rs.on('end',function(){
		cleanUp();
	});


以上代码会给doSomething()函数加上回调，因此可以在处理数据前暂停数据读取，并且在处理数据后继续读取数据。

创建一个只写数据流：


	var rs = fs.createReadStream(src);
	var ws = fs.createWriteStream(dst);

	rs.on('data',function(chunk){
		ws.write(chunk);
	});

	rs.on('end',function(){
		ws.end();
	});


以上代码依然存在一个问题：若是写入输入跟不上读取熟读，只写数据流内部的缓存会爆仓。解决：

根据.write()方法的返回值来判断传入数据是写入目标了，还是临时放在了缓存里，并根据drain事件来判断只写数据流何时已将缓存中的数据写入目标，可以传入下一个待写数据了：

	var rs = fs.createReadStream(src);
	var ws = fs.createWriteStream(dst);

	rs.on('data',function(chunk){
		if(ws.write(chunk) === false){
			rs.pause();
		}
	});

	rs.on('end',function(){
		ws.write();
	});

	ws.on('drain',function(){
		rs.resume();
	});


以上代码实现了数据从只读数据流到只写数据流的搬运，并包括了防爆仓控制。


### File System(文件系统) ###

-[官方文档](http://nodejs.org/api/fs.html)


NodeJS通过fs内置模块提供文件的操作，其所提供的API基本可分为三类：


- 文件属性读写

- 常用的有fs.stat、fs.chmod、fs.chown等

- 文件内容读写

- 常用的有fs.readFile、fs.readdir、fs.writeFile、fs.mkdir等

- 底层文件操作

- 常用的有fs.open、fs.read、fs.write、fs.close等


NodeJS最精华的一部IO模型在fs模块里有着充分的体现，如上例的API都通过回调函数传递结果：

	fs.readFile(pathName,function(err,data){
		if(err){
			//deal with error.
		} else{
			//deal with data.
		}
	});


如上代码所示，基本所有的fs模块API的回调函数都有两个，第一个参数在有错误发生时等于异常对象，第二个参数是中用于返回API方法执行结果。

此外，fs模块的所有异步API都有对应的同步版本，用于无法使用异步操作时，或者同步操作更方便时的情况。同步API除了方法名的末尾多了一个Sync之外，异常对象与执行结果的传递方式也有相应变化。同样以fs. readFileSync为例：


	try {
		var data = fs.readFileSync(pathName);
		//deal with data.
	} catch(err){
		// deal with erro
	}


### PATH(路径) ###


-[官方文档](http://nodejs.org/api/path.html)


操作文件不可避免要与文件路径打交道，NodeJS提供了path内置模块用于路径操作：

 &&1 path.normalize

>
将传入的路径转换为标准路径，具体的讲，除了解析路径中的.与..外，还能去掉多余的斜杠，如果有程序使用路径作为某些数据的所以，但又允许用户随意输入路径时，就需要使用该方法保证路径的唯一性：
>

	var cache = {};

	function store(key,value){
		cache[path.normalize(key)] = value;
	}

	store('foo/bar',1);
	store('foo/baz//../bar',2);
	console.log(cache); // =>{"foo/bar":2}

>
标准化之后的路径里的斜杠在Windows下是\，而在Linux下是/，若想保证在任何系统下都使用/作为路径分隔符，需要使用.replace(/\\/g,'/')再替换一下标准路径。
>


 &&2 path.join

传入的多个路径拼接为标准路径。该方法可避免手工拼接路径字符串的繁琐，并且能在不同系统下正确的使用相应的路径分隔符：

	path.join('foo/','baz/,'../bar); // =>"foo/bar"

 &&3 path.extname

当需要根据不同文件扩展名做不同操作时，则使用此方法：
path.extname('foo/bar.js'); // =>"..js"


## 遍历目录 ##

遍历目录是操作文件是一个常见需求，比如写一个程序，需要找到并处理指定目录下的所有JS文件时，则需要遍历整个目录。

### 递归算法 ###


遍历目录一般使用递归算法，否则难以写出简洁的代码(递归，不断缩小问题的规模以解决问题)：

	function factorial(n){
		if(n === 1){
			return 1;
		} else {
			return n * factorial(n-1);
		}
	}


计算n的阶乘，当n大于1时，问题简化计算n x (n-1)的阶乘，当n等于1时，问题规模达到最小，不需要再简化，直接返回1.

>
使用递归虽然是的代码简洁，但由于递归一次就产生一次函数调用，在需要优先考虑性能时，需要把递归算法转换为循环算法，以减少函数调用
>

### 遍历算法 ###

目录是一个树状结构，在遍历是一般使用深度优先+先序遍历算法。深度优先，意味着达到下一节点后，首先接着遍历子节点而不是邻居节点，先序遍历，意味着首次到达某节点就算遍历完成：

			 A
			/ \
		   /   \
		  B     C
		 / \     \
		D   E     F


遍历顺序：
A>B>D>E>C>F(遍历到某个节点B时，紧接着时遍历该节点B下的后代节点，只有在B后代均被遍历后才会结束B节点的遍历转而去遍历B节点的相邻节点C)。


### 同步遍历 ###

	function travel(dir,callback){
		fs.readdirSync(dir).forEach(function(file){
			var pathName = path.join(dir,file);

			if(fs.statSync(pathName).isDirectory()){
				travel(pathName,callback);
			} else {
				callback(pathName);
			}
		});
	}


该函数以某个目录作为遍历的起点，遇到一个子目录时，就先接着遍历子目录，遇到一个文件时，就把文件的绝对路径传给回调函数。回调函数拿到文件路径后，就可以做各种判断和处理，假设有如下目录：

	- /home/user/
		- foo/
			- x.js
		- bar/
			- y.js
		z.css


使用以下代码遍历该目录时，得到的输入如下：

	travel('/home/user',function(pathName){
		console.log(pathName);
	})

-----------------------------------------------------------------------

	/home/user/foo/x.js
	/home/user/bar/y.js
	/home/user/z.css


### 异步遍历 ###

如果读取目录或者读取文件状态时使用的是异步API，目录遍历函数会较为复杂些，但元里相同：

	function travel(dir,callback,finish){
		fs.readdir(dir,function(err,file){
			(function next(i){
				if(i < file.lenght){
					var pathName = path.join(dir,file[i]);
					fs.stat(pathName,function(err,stats){
						if(stats.isDirectfory()){
							travel(pathName,callback,function(){
								next(i + 1);
							});
						} else {
							callback(pathName,function(){
								next(i + 1)
							});
						}
					});
				} else {
					finish && finish();
				}
			}(0));
		});
	}



### 文本编码 ###


我们常用的文本编码有UTF8和GBK两种，并且UTF8文件还可能带有BOM。在读取不同编码的文本文件时，需要将文件内容转换为JS使用的UTF8编码字符串后才能正常处理。


 &&1 BOM的移除

BOM用于标记一个文本使用的Unicode编码，其本身是一个Unicode字符("\uFEFF")，位于文本文件头部，在不同的Unicode编码下，BOM字符对应的二进制字节：

		Bytes		Encoding
	------------------------------
		FE FF		  UTF16BE
		FF FE		  UTF16LE
		EF BB BF	  UTF8


因此，可以根据文本文件头几个字节是什麽来判断文件是否包含BOM，以及使用哪种Unicode编码。然而，BOM虽然可以标记文件编码，他本身却不属于文件内容的一部分，如果不去掉BOM，在某些使用场景下将会出错：
将几个JS文件合并成一个文件后，若是文件中含有BOM字符，将会导致浏览器JS语法错误，所以，使用NodeJS读取文本文件时，应该去除BOM:

	function readText(pathname) {
		var bin = fs.readFileSync(pathname);
		if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
			bin = bin.slice(3);
		}
		return bin.toString('utf-8');
	}


 &&2 GBK转UTF8

NodeJS支持在读取文本文件时，或者在Buffer转换为字符串时指定文本编码，但遗憾的是，GBK编码不在NodeJS自身支持范围内。因此，一般我们借助iconv-lite这个三方包来转换编码。使用NPM下载该包后，我们可以按下边方式编写一个读取GBK文本文件的函数。


	var iconv = require('iconv-lite');
	function readGBKText(pathname) {
		var bin = fs.readFileSync(pathname);
		return iconv.decode(bin, 'gbk');
	}




day3 complete!