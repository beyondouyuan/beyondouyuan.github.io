---
layout: post
title: NodeJs初成长(二)之七天学会nodejs(4)
author: beyondouyuan
date: 2016-10-06
categories: blog
tags: [前端,NodeJs,七天学会nodejs]
node: node
description: 雨打芭蕉疏梧桐，情生意动。情生意动？醉问金樽绿与红。
---


### 写在前面 ###

不了解网络编程的程序员不是好前端，而NodeJS恰好提供了一扇了解网络编程的窗口。通过NodeJS，除了可以编写一些服务端程序来协助前端开发和测试外，还能够学习一些HTTP协议与Socket协议的相关知识，这些知识在优化前端性能和排查前端故障时说不定能派上用场。今天学习与之相关的NodeJS内置模块。


### 网络操作 ###

NodeJS本来的用途就是编写高性能的web服务器，

使用NodeJS内置http模块实现一个HTTP服务器：

	var http = require('http');

	http.createServer(function(request,response){
		response.writeHead(200,{'Content-Type':'text-plain'});
		response.end('Hello,World \n');
	}).listen(8888);

以上创建了一个HTTP服务器并监听8888端口，打开浏览器访问该端口即可看到效果


### API走马观花 ###


### HTTP ###

- [官方文档](http://nodejs.org/api/http.html)

'http'模块提供两种使用方式：

1.作为服务器使用时，创建一个HTTP服务器，监听HTTP科幻段请求并返回响应。

2.作为客户端使用时，发起一个HTTP客户端请求，获取服务器响应。

 &&1 服务器模式下的工作：

上例所示：

- 首先使用createServer()方法创建一个服务器，

- 然后调用.listen()方法监听端口，

- 之后，每当发来一个客户端请求，创建服务器时传入的回调函数被调用一次(这是一种事件机制)。

HTTP请求本质上是一个数据流，由请求头(headers)和请求体(body)组成：

	POST /HTTP/1.1
	User-Agent:curl/7.26.0
	Host:localhost
	Accept:*/*
	Content-Lenght:11
	Content-Type:application/x-www-form-urlencoded

	Hello,World


“Hello,World”之上部分即是请求头，"Hello,World"是请求体。HTTP请求在发送给服务器时，可以认为是按照从头到尾的顺序一个字节一个字节地以数据流方式发送的。而http模块创建的HTTP服务器在接收到完整的请求头后，就会调用回调函数。回调函数中，除了可以使用request对象访问请求头数据外，还能把request对象当作一个只读数据流来访问请求数据：



	http.createServer(function(request,response){
		var body = {};

		console.log(request.method);
		console.log(request.headers);

		request.on('data',function(chunk){
			body.push(chunk);
		});

		request.on('end',function(){
			body = Buffer.concat(body);
			console.log(body.toString());
		});
	}).listen(8888);


----------------------------------------------------------------------------------------------------------------------------------------------------------

	POST

	{
		'user-agent':'curl/7.26.0',
		host:'localhost',
		accept:'*/*',
		'content-lenght':'11',
		'content-type':'application/x-www-form-urlencoded'
	}
	Hello,World


HTTP响应本质相也是一个数据流，同样由响应头(headers)和响应体(body)组成：

	HTTP/1.1 200 ok
	Content-Lenght:text/plain
	Content-Lenght:11
	Data:tue,05 Now 2016 05:31:38 GMT

	Connection:keep-alive

	Hello,World


在回调函数中，除可使用response对象来写入响应头数据外，还可以把response对象当作只写数据流来写入响应体数据：

	http.createServer(function(request,response){
		response.writeHead(200,{'Content-Type':'text-plain'});

		request.on('data',function(chunk){
			response.write(chunk);
		});

		request.on('end',function(){
			response.end();
		});
	}).listen(8888);

 &&2 客户端模式下的工作

为了发起一个客户端请求，需要指定目标服务器的位置并发送请求头和请求体：

	var options = {
		hostname:'www.google.com',
		post:8888,
		path:'upload',
		method:'POST',
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}
	};

	var request = http.request(options,function(response){});

	request.write('Hello,World');
	request.end();


上例，request方法创建了一个客户端，并制定求情目标和请求头是数据，之后，将request对象当作一个只写数据流写入请求数据和结束请求。

HTTP请求中GET请求最为常见，并且不需要请求体：

	http.get('http://www.google.com',function(response){});


当客户端发送请求并接收到完整的服务器响应头时，就会调用回调函数，在回调函数中，除了可以使用response对象访问响应头数据外，还可把response对象当作只读数据流来访问响应体数据：

	http.get('http://www.google.com',function(response){
		var body = {};

		console.log(response.statusCode);
		console.log(response.headers);

		response.on('data',function(chunk){
			body.push(chunk);
		});

		request.on('end',function(){
			body = Buffer.concat(body);
			console.log(body.toString());
		});
	});


----------------------------------------------------------------------------------------------------------------------------------------------

	200
	{
		'content-type':'text/html',
		server:'Apache',
		'content-lenght':'801',
		Date:'Tue,06 Nov 2016 18:08:14 GMT',
		connection:'keep-alive'
	}
	<!DOCTYPE html>
	-------------------------


### HTTPS ###
-[官方文档](http://nodejs.org/api/https.html)

https模块与http模块极为类似，区别在于https模块需要额外处SSL证书。
在服务器模式下，创建一个HTTPS服务器：

	var options = {
		key:fs.readFileSync('./ssl/default.key'),
		cert:fs.readFileSync('./ssl/default.cer')
	};

	var server = https.createServer(options,function(request,response){
		// ...
	})


与HTTP服务器相比，多了一个options对象，通过key和cert字段指定HTTPS服务器使用的私钥和公钥。

NodeJS支持SNI技术，可以根据HTTPS客户端请求使用的域名动态使用不同的证书，因此同一个HTTPS服务器可以使用多个域名提供服务。为HTTPS服务器添加多组证书：


	server.addContext('foo.com', {
		key: fs.readFileSync('./ssl/foo.com.key'),
		cert: fs.readFileSync('./ssl/foo.com.cer')
	});
	server.addContext('bar.com', {
		key: fs. readFileSync('./ssl/bar.com.key'),
		cert: fs. readFileSync('./ssl/bar.com. cer')
	});

在客户端模式下，发起一个HTTPS请求与http模块几乎相同：



	var options = {
		hostname: 'www.google.com',
		port: 443,
		path: '/',
		method: 'GET'
	};
	var request = https.request(options, function (response) { } );
	request.end();



>
如果目标服务器使用的SSL证书是自制的，不是从颁发机构购买的，默认情况下https模块会拒绝连接，提示说有证书安全问题。在options里加入rejectUnauthorized: false字段可以禁用对证书有效性的检查，从而允许https模块请求开发环境下使用自制证书的HTTPS服务器。
>


### URL ###

-[官方文档](http://nodejs.org/api/url.html)


处理HTTP请求时常使用到url模块，该模块允许解析URL、生成URL以及拼接URL。完整URL组成：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_4.png" align="center"></p>
</center>


使用.parse()方法将一个URL字符串转换为URL对象：


	url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash') ;


	/* =>
	{protocol:'http:',
	auth:'user:pass',
	host:'host.com:8080',
	port:'8080',
	hostname:'host.com',
	hash:'#hash',
	search:'?query=string',
	query:'query=string',
	pathname:'/p/a/t/h',
	path:'/p/a/t/h?query=string',
	href:'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'}
	*/


传给.parse方法的不一定要是一个完整的URL，例如在HTTP服务器回调函数中， request.url不包含协议头和域名，但同样可以用.parse方法解析：


	http.createServer(function(request,response){
		vartmp=request.url;//=>"/foo/bar?a=b"
		url.parse(tmp);

		/*=>
		{protocol:null,
		slashes:null,
		auth:null,
		host:null,
		port:null,
		hostname:null,
		hash:null,
		search:'?a=b',
		query:'a=b',
		pathname:'/foo/bar',
		path:'/foo/bar?a=b',
		href:'/foo/bar?a=b'}
		*/
	}).listen(80);


. parse方法还支持第二个和第三个布尔类型可选参数。第二个参数等于true时，该方法返回的URL对象中，query字段不再是一个字符串，而是一个经过querystring模块转换后的参数对象。第三个参数等于true时，该方法可以正确解析不带协议头的URL，例如//www.example.com/foo/bar。


反过来，format方法允许将一个URL对象转换为URL字符串：

	url.format({
		protocol:'http:',
		host:'www.example.com',
		pathname:'/p/a/t/h',
		search:'query=string'
	});

	/*=>
	'http://www.example.com/p/a/t/h?query=string'
	*/


.resolve方法可以用于拼接URL：
	url.resolve('http://www.example.com/foo/bar','../baz');

	/* =>
	http://www.example.com/baz
	*/


### Query String ###
-[官方文档](http://nodejs.org/api/querystring.html)


querystring模块用于实现URL参数字符串与参数对象的互相转换:

	querystring.parse('foo=bar&baz=qux&baz=quux&corge');
	/* =>
	{foo:'bar',baz:['qux','quux'],corge:''}
	*/
	querystring.stringify({foo:'bar',baz:['qux','quux'],corge:''})
	;
	/*=>
	'foo=bar&baz=qux&baz=quux&corge='
	*/



### Zlib ###
-[官方文档](http://nodejs.org/api/zlib.html)


zlib模块提供了数据压缩和解压的功能。当我们处理HTTP请求和响应时，可能需要用到这个模块。
首先我们看一个使用zlib模块压缩HTTP响应体数据的例子。这个例子中，判断了客户端是否支持gzip，并在支持的情况下使用zlib模块返回gzip之后的响应体数据:


	http.createServer(function(request,response){
		vari=1024,
		data='';
		while(i--){
			data+='.';
		}
		if((request.headers['accept-encoding']||'').indexOf('gzip')!==
		-1){
			zlib.gzip(data,function(err,data){
				response.writeHead(200,{
					'Content-Type':'text/plain',
					'Content-Encoding':'gzip'
				});
				response.end(data);
			});

		} else {
				response.writeHead(200,{
				'Content-Type':'text/plain'
			});
			response.end(data);
		}
	}).listen(80);
接着我们看一个使用zlib模块解压HTTP响应体数据的例子。这个例子中，判断了服务端响应是否使用gzip压缩，并在压缩的情况下使用zlib模块解压响应体数据。
	var options = {
		hostname: 'www.example.com',
		port:80,
		path:'/',
		method:'GET',
		headers:{
			'Accept-Encoding':'gzip,deflate'
		}
	};

	http.request(options,function(response){
		varbody=[];
		response.on('data',function(chunk){
			body.push(chunk);
		});

		response.on('end',function(){
			body=Buffer.concat(body);

			if(response.headers['content-encoding']==='gzip'){
				zlib.gunzip(body,function(err,data){
				console.log(data.toString());
				});
			} else{
				console.log(data.toString());
			}
		});

	}).end();


### Net ###


- [官方文档](http://nodejs.org/api/net.html)


### 小结 ###

1.http和https模块支持服务端模式和客户端两种模式。

2.request和response对象除了用于读写头数据外，还可以当作数据流操作。

3.url.parse方法加上request.url属性是处理http请求时的固定搭配。

4.使用zlib模块可以减少使用HTTP协议时数据传输量。
