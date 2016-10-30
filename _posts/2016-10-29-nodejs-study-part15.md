---
layout: post
title: NodeJs初成长之nodejs链接mysql
author: beyondouyuan
date: 2016-10-29
categories: blog
tags: [NodeJs,nodejs入门]
node: node
description: 莺嘴啄花红溜，燕尾剪波绿皱。指冷玉笙寒，吹彻小梅春透。依旧，依旧，人与绿杨俱瘦。

---

### 写在前面 ###

1.使用cmd命令行登录mysql方法：

2.mysql -h主机地址 -u用户名 －p用户密码

3.注:u与username可以不用加空格，其它也一样
   
4.mysql -u (username) -p(password)

5.//如：用户名为irving，密码为irving

6.mysql -u irving -pirving  //==>>以此格式输入(-p和password间没有空格)，这可以直接登录了(不会出现在下一行提示enter password)。

7.若是(-p和password间有空格，这需要在下一行再次输入密码才可以,也就是说空格之后输入的密码不起作用)

8.mysql -u irving -p irving  //下一行会提示:enter password


9.有点蒙蔽了，之前在cmd窗口登录mysql时候一直都把命令写成：

    mysql -u -irving -pirving

于是=======>>>>>仆街，出错了...


### 安装mysql ###

我使用的是wamp集成包，安装wamp后稍微进行配置后，即可使用php环境以及集成的mysql工具。

将wamp下的mysql添加到系统环境变量后可以使用cmd命令行窗口链接到数据库。

登录数据库：

    mysql -u (username) -p(password)

如登录我的irving用户，密码也为irving：

    mysql -u irving -p
    enter password:******

ok!登录成功，创建一个名为nodejs的数据库

    mysql> create databases nodejs 
    // 使用nodejs数据库并创建一个名为t_user的表
    mysql>use nodejs
    mysql>create table t_user(
        -> id INT PRIMARY KEY AUTO_INCREMENT,
        -> name VARCHAR(16) NOT NULL ,
        -> create_date TIMESTAMP NULL DEFAULT now()
        -> )ENGINE=InnoDB DEFAULT CHARSET=utf8;


随后随意插入两个用户的信息，分别为ouyuan irving并填充相应数据信息。

回到我们的编辑器，创建一个名为node_mysql的项目，并在该项目下创建一个node_mysql.js文件。

从cmd窗口进入到node_mysql项目，下载mysql模块：

    npm install mysql

安装成功后命令行提示成功信息，并且回到项目可以看到有个node_modules文件，这个就包含了我们需要的mysql模块。

在node_mysql.js下写入代码如下：

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'irving',                 // 数据库所有权用户
        password: 'irving',             // 用户密码
        database:'nodejs',              // 数据库名
        port: 3344                      // mysql端口
    });
    connection.connect();
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    });
    connection.end();


以上，已连接到数据库。我们可以测试一下，在sublime中按下ctrl + b，即可看到我们的debug信息：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_mysql.png" align="center"></p>
</center>

yes!It work!

我们来把mysql中所创建的表格的信息输出到浏览器上，首先创建一个简单的服务器，并在服务器中查询我们想要得到的数据，代码如下：


    var http = require('http');

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'irving',                 // 数据库所有权用户
        password: 'irving',             // 用户密码
        database:'nodejs',              // 数据库名
        port: 3344                      // mysql端口
    });


    var server = http.createServer(function(request,response){
        console.log('启动服务器');
        connection.query('select * from t_user;',function(error,rows,fields){
            // if(error) throw error;
            response.writeHead(200, { "content-Type": "text/plain" });
            response.end(JSON.stringify(rows));
        });
    });

    server.listen(8888);


我们使用JSON.stringify(rows)方法将获取得到的rows转换为JSON字符串。

在cmd中启动node_mysql

    node node_mysql

在浏览器中打卡[localhost:8888](localhost:8888)。看到了什么？

<center>
<p><img src="https://beyondouyuan.github.io/img/node_mysql_1.png" align="center"></p>
</center>


是他！是他！就是他！

我们得到了数据库nodejs中的表格t_user插入的两个用户的信息！
