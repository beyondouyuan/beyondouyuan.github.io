---
layout: post
title: NodeJs初成长(二)之七天学会nodejs(5)
author: beyondouyuan
date: 2016-10-09
categories: blog
tags: [NodeJs]
node: node
description: 永夜抛人何处去？绝来音。香阁掩，眉敛，月将沉。争忍不相寻？怨孤衾。换我心，为你心，始知相忆深。
---


### 写在前面 ###

NodeJS可以感知和控制自身进程的运行环境和状态，也可以创建子进程并与其协同工作，这使得NodeJS可以把多个程序组合在一起共同完成某项工作，并在其中充当胶水和调度器的作用。

### 进程管理 ###
NodeJS调用终端命令简化目录拷贝
 &&1 小示例

	var child_process = require('child_process');
	var util = require('util');

	function copy(source,target,callback){
		child_process.exec(
			util. format('cp -r %s/*%s',source,target),callback);
		}

	copy('a','b',function(err){
		//..
	});

### API ###

#### Process ####

- [官方文档](http://nodejs.org/api/process.html)

NodeJS通过Process对象感知与控制自身进程，Process不是内置对象而是全局对象，在任何地方均可调用。

#### Child Process ####

- [官方文档](http://nodejs.org/api/child_process.html)

使用child_process模块可以创建可控制子进程。

#### Cluster ####

- [官方文档](http://nodejs.org/api/cluster.html)

Cluster模块时对child_process的进一步封装，专用于解决但进程NOdeJS Web服务器无法充分利用多核CPU问题，使用CLuster可以简化多进程服务器程序开发，让每个核上运行一个工作进程，并统一通过主进程监听端口和分发请求。

### 应用场景 ###

单独地学习API未免太过于枯燥，所以来点刺激的咯。

#### 获取命令行参数 ####

NodeJS通过process.argv获取命令行参数，但是，node执行程序路径和主模块文件路径固定占据了argv[0]和argv[1]两个位置，而第一个命令行参数从argv[2]开始，为了让ragv更加自然：

	function main(argv){
		//...
	}
	main(process.argv.slice(2));

#### 退出程序 ####

所有程序执行完后，则正常退出，此时程序的退出状态码为0。或者一个程序发生异常后挂了，此时程序的退出状态码并不等于0，若是捕捉到了某个异常，而不想再程序执行下去，则需要立即退出，并需要把退出状态码设置为指定数字：

	try{
		//...
	} catch(err){
		//...
		process.exit(1);
	}


#### 控制输入输出 ####

NodeJS程序的标准输入流(stdin)、一个标准输出流(stdout)、一个标准错误流(stderr)分别对应process.stdin、process.stdout和process.stderr，第一个为只读数据流，后两个为只写数据流，他们的操作方式与数据流操作方式即可：

	function log(){
		process.stdout.write(
			util.format.apply(util,arguments) + '\n'
		);
	}

#### 降权 ####

在Linux下，通常需要使用root权限才能监听到1024以下窗口。但是一旦完成端口监听后，继续让程序运行在root权限存在安全隐患，因此最好将权限降下：

	http.createServer(callback).listen(80,function(){
		var env = process.env,
			uid = parseInt(env['SUDO_UTD'] || process.getuid(),10),
			gid = parseInt(env['SUDO_GID'] || process.getgid(),10);

			process.setgid(gid);
			process.setuid(uid);
	});

以上注意：

1.若是通过sudo获取root权限，运行程序的用户UID和GID保存在环境变量SUDO_UID和SUDO_GID，若是通过chmod +s方式获取root权限，运行程序用户的UID和GID直接通过process.getuid和process.getgid方法获取。

2.process.setuid和process.setgid方法值计算number类型参数。

3.降权是必须向降GID再降UID，否则顺序放过来则没有权限更改程序的GID了。


### 创建子进程 ###

	var child = child_process.spawn('node',['xxx.js']);

	child_stdout.on('data',function(data){
		console.log('stdout:' + data);
	});

	child_stderr.on('data',function(data){
		console.log('stderr:' + data);
	});

	child.on('close',function(code){
		console.log('child process exited with code:' + code);
	});

.spawn(exec,args,options)方法支持三个参数，exec实质性文件路径，可以是绝对路径也可以是相对路径，还可以是根据PATH环境变量能找到的执行文件名。args中，数组中每个成员都按程序对应一个命令行参数，options参数可选，用于配置紫禁城的执行环境与行为。

上例通过对象.stdout和stderr访问紫禁城的输出，但通过options.stdio字段的不同配置，可以将紫禁城的输入输出重定向到任何数据流上，或者让紫禁城共享父进程的标准输入输出流，或者直接忽略紫禁城的输入输出。


#### 进程间通讯 ####

在Linux系统下，进程之间可以通过信号互相通信：

	/*parent.js*/

	var child = child_process.spawn('node',['child.js']);
	childe_kill('SIGTERM');

	/*child.js*/

	process.on('SIDTERM',function(){
		cleanUP();
		process.exit(0);
	});

以上，父程序通过.kill()方法向子进程发送SIGTERM信号，紫禁城监听process对象的SIGTERM事件响应信号。kill方法本质上使用了给进程发送信号的，进程收到信号后具体要做什么，则取决于信号的种类和进程自身的代码。

若父子进程都是NodeJs进程，就可以通过IPC(进程间通信)双向传递数据：

	/*parent.js*/

	var child = child_process.spawn('node',['child.js'],{stdio:[0,1,2,'ipc']});

	child.on('message',function(msg){
		console.log(msg);
	});

	child.send({ hello:'hello'});

	/*child.js*/

	process.on('message',function(msg){
		msg.hello = msg.hello.toUpperCase();
		process.send(msg);
	});


父进程在创建子进程时，在options.stdio字段中通过ipc开启了一条IPC通道，之后就可以监听子程序对象的message事件接收来自子进程的消息，并通过.send()方法给子进程发送信息，子进程在procees对象上监听message事件接收来自父进程的消息，并通过.send()方法向父进程发送信息，数据在传递过程中，会现在发送端使用JSON.stringify方法序列化，再在接收端使用JSON.parse()方法反向序列化。


#### 守护子进程 ####


守护进程一般用于监控工作进程的运行状态，在工作进程不正常退出时重启工作进程，保证工作进程不间断运行：


	/*daemon.js*/
	function spawn(mainModule){
		var worker = child_process.spawn('node',['mainModule']);

		worker.on('exit',function(code){
			if(code !==0){
				spawn(mainModule);
			}
		});
	}
	spawn('worker.js');


#### 小结 ####

1.使用process对象管理自身。

2.使用child_process模块创建和管理子进程。

