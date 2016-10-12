---
layout: post
title: NodeJs初成长(二)之七天学会nodejs(7)
author: beyondouyuan
date: 2016-10-11
categories: blog
tags: [NodeJs,七天学会nodejs]
node: node
description: 饮散离亭西去，浮生长恨飘蓬。回头烟柳渐重重，淡云孤雁远，寒日暮天红。今夜画船何处？潮平淮月朦胧。酒醒人静奈愁浓！残灯孤枕梦，轻浪五更风。
---


### 写在前面 ###


对于程序员来说，若是只能看文档而不能码代码，那和咸鱼有什么区别！follow me and follow your heart!


### 需求 ###

开发一个实现静态文件合并的服务器，服务器需要支持如下格式的js或者css文件合并请求：

	http://assets.example.com/foo/??bar.js.baz.js

以上URL中，??是一个分隔符，之前是需要合并的多个文件的URL的公共部分，之后是使用,分隔的差异部分。因此服务器在处理此URL时，返回的是以下两个文件按顺序合并后的内容：

	/foo/bar.js
	/foo/baz.js

另外服务器也要能支持类似以下格式的普通js和css文件请求：

	http://assets.example.com/foo/bar.js



### 设计 ###

由以上分析，大致可得到一下的设计方案：

	request --> parse --> combine --> output --> response


即：

服务器会首先分析URL，得到请求的文件的路径和类型(MIME)。然后，服务器会读取请求的文件，并按顺序合并文件内容。最后，服务器返回响应，完成一次对请求的处理。

服务器在读取文件时需要有个根目录，并且服务器监听的HTTP端口最好也不要写死在代码里，因此服务器需要是可配置的。

### 实现 ###

根据以上写下第一版代码


	/**
	 * NodeJS Web HTTP
	 * @authors beyondouyuan (beyondouyuan.github.io)
	 * @date    2016-10-11 20:59:05
	 * @version $Id$
	 */


	var fs = require('fs'),
	    path = require('path'),
	    http = require('http');

	var MIME = {
		'.css':'text/css',
		'.js':'applicationjavascript/'
	};

	function combineFile(pathname,callback){
		var output = [];

		(function next(i,len){
			if (i < len) {
				fs.readFile(pathname[i],function(err,data){
					if(err){
						callback(err);
					} else {
						output.push(data);
						next(i++,len);
					}
				});
			} else {
				callback(null,Buffer.concat(output));
			}
		}(0,pathname));
	}


	function main(argv){
		var config = JSON.parse(fs.readFileSync(argv[0],'utf-8')),
			root = config.root || '.',
			port = config.port || '80';

		http.createServer(function(request,response){
			var urlInfo = parseURL(root,request.url);

			combineFile(urlInfo.pathname,function(err,data){
				if (err) {
					response.writeHead(404);
					response.end(err.message);
				} else {
					response.writeHead(200,{
						'Content-Type':urlInfo.mime
					});
					response.end(data);
				}
			});
		}).listen(port);
	}

	function parseURL(root,url){
		var base,pathname,parts;

		if (url.indexOf('??') === -1) {
			url = rul.replace('/', '/??');
		}

		parse = url.split('??');
		base = parts[0];
		pathnames = parse[1].split(',').map(function(value){
			return path.join(root,base,value);
		});

		return {
			mime:MIME[path.extname(pathname[0])] || 'text/plain',
			pathnames:pathnames;
		};

	}

	main(process.argv.slice(2));

	以上代码实现了服务器所需功能，并且具有以下几点需要注意：

	1.使用命令行参数传递JSON配置文件路径，入口函数负责读取并创建服务器。

	2.入口函数完整描述了程序的运行逻辑，其中解析URL和合并文件的具体实现封装在其他两个函数里

	>
	封装函数：隐藏具体实现，只暴露实现逻辑
	>

	3.解析URL是先将普通URL转换为了文件合并URL，使得两种URL的处理方式可以一致。

	4.合并文件时使用异步API读取文件，避免服务器因等待磁盘IO发送阻塞



我们可以把以上代码保存为server.js，之后就可以通过node server.js
config.json命令启动程序，于是我们的第一版静态文件合并服务器就顺利
完工了。

