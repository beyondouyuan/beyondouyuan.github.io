---
layout: post
title: Node+Express+MongoDB开发博客(一)
author: beyondouyuan
date: 2016-11-19
categories: blog
tags: [NodeJs]
node: node
description: 月沉沉，人悄悄，一炷后庭香袅。风流帝子不归来，满地禁花慵扫。。

---

### 写在前面 ### 


按原计划，本该是在上一篇走过一遍的nodejs实现实时聊天室后就打算把react和构建工具gulp和webpack巩固一遍的，不过周末恰巧把在公司这一段时间的学习笔记都带回来了，这里也包括了阅读《nodejs开发指南》以及参考Cnode社区《一起学习nodejs》这两篇经典好文而后跟随画轮子，感觉比之前读和写了好多的nodejs小demo代码的收获都大，为了更牢固些，还是先继续再温习一遍node的开发过程，之后再整理其他的学习笔记了。

### 搭建工程目录 ###

实际上并不需要花如此多时间在搭建工程目录上，我们可以直接在cmd命令行窗口中执行：

    express myblog

如此我们即可得到我们想要的工程目录结构，不过，我等还是初学者，多花些时间学习点基础的知识却对我们是有好处的。

废话不多说，首先在自己的工作空间创建myblog文件夹，运行npm init初始化项目得到package,json配置文件。在myblog目录下创建对应文件以及文件夹用于放置对应源代码。
 

工程目录如下图所示：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_1.png" align="center"></p>
</center>


对应文件及文件夹的用处：

1.models：存放操作数据库的文件

2.public: 存放静态文件，如样式表、图片等

3.routes：存放路由文件

4.views：存放模板文件

5.index.js：程序主文件(入口文件)

6.package.json：存放项目名、描述、作者、依赖项等信息


>
> TIPS：发现了吗？我们遵循了MVC(模型(models)--视图(views)--控制器(controller/route))的开发模式。
> 


### 安装依赖项 ### 

运行以下命令安装所需依赖项：

    npm i config-lite connect-flash connect-mongo ejs express express-formidable express-session marked moment mongolass objectid-to-timestamp sha1 winston express-winston --save


对应模块的用处：

1.express：web框架

2.express-session：支持会话机制，session中间件

3.connect-mongo：将session存储于mongodb，结合express-session使用

4.connect-flash：页面通知提示的中间件，基于session实现

5.ejs：模板(现在的express默认模板是jade)

6.express-formidable：接收表单及文件上传的中间件

7.config-lite：读取配置文件

8.marked：markdown解析

9.moment：时间格式化

10.mongolass：mongodb驱动

11.objectid-to-timestamp：根据ObjectId生成时间戳

12.sha1：sha1加密，用于密码加密

13.winston：日志

14.express-winston：基于winston的用于express的日志中间件


### 配置文件 ###

不管项目大小，把配置与代码分离都是很明智的做法，我们通常会将配置写到一个配置文件中，如config.js或者是config.json，并放置到项目的根目录下。但是通常有时候我们会有很多环境，比如会有本地开发环境、测试环境和线上环境等，不同的环境的配置有所不同，我们不可能每次部署时都要去修改应用config.test.js或者config.production.js。等文件，所以，我们可以选择config-lite模块来满足以上的需求。

config-lite会根据环境变量(NODE_DEV)的不同从当前执行进程目录下的config目录加载不同的配置文件。若是没有设置NODE_DEV则会读取默认的default配置文件。

我们在myblog根目录下创建config目录，在config目录下新建default.js：

    module.exports = {
        port:3000,
        session:{
            secret:'nodeblog',
            key:'nodeblog',
            maxAge:2592000000
        },
        db:'nodeblog',
        mongodb:'mongodb://localhost:27017/nodeblog'
    }; 


该文件写入了我们的默认配置信息：

1.port：程序启动要监听的端口号

2.session：express-session的配置信息

3.mongodb：mongodb的地址，nodeblog为db名



### 功能与路由设计 ### 


在开发一个项目之前，我们一般需要明确该项目要实现哪些功能。对于我们的将要开的博客也是如此，一般来说，一个博客开发起来还是蛮多工作也蛮复杂的，不过对于吾等初学者而言，我们只要去实现最基本的功能，待来日羽翼丰满之时，其余功能我们再一一自行实现！待到秋来九月八，我花开后百花杀！

功能及路由设计如下：

1.注册

    1).注册页：GET/signup
    2).注册(包含上传头像)：POST/signup

2.登录

    1).登录页：GET/signup
    2).登录：POST/signup

3.登出：GET/signout


4.查看文章

    1).主页：GET/posts
    2).个人主册：GET/posts/?author = xxx
    2).查看一片文章(包含留言)：GET/posts/:postId

5.发表文章

    1).发表文章页：GET/posts/create
    2).发表文章：POST/posts

6.修改文章

    1).修改文章页：GET/posts/:postId/edit
    2).修改文章：POST/posts/:postId/edit

7.删除文章：GET/posts/:postId/remove

6.留言

    1).创建留言：POST/posts/:postId/comment
    2).删除留言：GET/posts/:postId/comment/:commentId/remove


#### 页面通知 #### 

我们还需要这样一个功能：当我们操作成功时需要显示一个成功的通知，如登录成功跳转到主页时，需要显示一个*登陆成功*的通知；当我们操作失败时需要显示一个*失败*的通知，如注册时用户名被占用了，需要显示一个*用户名已占用*的通知。通知只显示一次，刷新后消失，我们可以通过*connect-flash*中间件实现这个功能。


#### 权限控制 ####

不管是论坛还是博客网站，我们没有登录的话只能浏览，登录后才能发帖或者写文章，即使登录了你也不能修改或者删除其他人的文章，此即为权限控制。

为我们的博客添加权限控制，我们可以把用户状态的检查封装成一个中间件，在每个需要权限控制的路由加载该中间件，即可实现页面的权限控制。在工程目录下新建middlewares文件夹，在该目录下新建check.js，其代码如下：

    module.exports = {
      checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
          req.flash('error', '未登录'); 
          return res.redirect('/signin');
        }
        next();
      },

      checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
          req.flash('error', '已登录'); 
          return res.redirect('back');//返回之前的页面
        }
        next();
      }
    }; 


1.checkLogin: 当用户信息(req.session.user)不存在，即认为用户没有登录，则跳转到登录页，同时显示*未登录*的通知，用于需要用户登录才能操作的页面及接口

2.checkNotLogin: 当用户信息(req.session.user)存在，即认为用户已经登录，则跳转到之前的页面，同时显示*已登录*的通知，如登录、注册页面及登录、注册的接口


### 创建路由 ###

wow!终于要搞事情了了！

一个一个来！

1.在routes目录下创建index.js文件，代码如下：

    //routes/index.js
    module.exports = function(app){
        app.get('/',function(req,res){
            res.redirect('/posts');
            // res.send('你来了！');
        });
        app.use('/signup',require('./signup'));
        app.use('/signin',require('./signin'));
        app.use('/signout',require('./signout'));
        app.use('/posts',require('./posts'));
    }; 

2.在routes目录下创建posts.js文件，代码如下：

    // @version $1.0.0$

    var express = require('express');
    var router = express.Router();

    var checkLogin = require('../middlewares/check').checkLogin;

    // GET /posts 所有用户或者特定用户的文章页
    //   eg: GET /posts?author=xxx
    router.get('/', function(req, res, next) {
      // res.send(req.flash());
      // 测试路过
        res.send('帅哥欧元静静的路过');
    });

    // POST /posts 发表一篇文章
    router.post('/', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // GET /posts/create 发表文章页
    router.get('/create', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // GET /posts/:postId 单独一篇的文章页
    router.get('/:postId', function(req, res, next) {
      res.send(req.flash());
    });

    // GET /posts/:postId/edit 更新文章页
    router.get('/:postId/edit', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // POST /posts/:postId/edit 更新一篇文章
    router.post('/:postId/edit', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // GET /posts/:postId/remove 删除一篇文章
    router.get('/:postId/remove', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // POST /posts/:postId/comment 创建一条留言
    router.post('/:postId/comment', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // GET /posts/:postId/comment/:commentId/remove 删除一条留言
    router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    module.exports = router;

3.在routes目录下创建signin.js文件，代码如下：

    // version $1.0.0$

    var express = require('express');
    var router = express.Router();

    var checkNotLogin = require('../middlewares/check').checkNotLogin;

    // GET /signin 登录页
    router.get('/', checkNotLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // POST /signin 用户登录
    router.post('/', checkNotLogin, function(req, res, next) {
      res.send(req.flash());
    });

    module.exports = router;


4.在routes目录下创建signup.js文件，代码如下：

    // version $1.0.0$

    var express = require('express');
    var router = express.Router();

    var checkNotLogin = require('../middlewares/check').checkNotLogin;

    // GET /signup 注册页
    router.get('/', checkNotLogin, function(req, res, next) {
      res.send(req.flash());
    });

    // POST /signup 用户注册
    router.post('/', checkNotLogin, function(req, res, next) {
      res.send(req.flash());
    });

    module.exports = router;

5.在routes目录下创建signout.js文件，代码如下：

    // version $1.0.0$

    var express = require('express');
    var router = express.Router();

    var checkLogin = require('../middlewares/check').checkLogin;

    // GET /signout 登出
    router.get('/', checkLogin, function(req, res, next) {
      res.send(req.flash());
    });

    module.exports = router;


以上，我们已经把每一个功能的控制器也即路由的框架写了出来，但是具体的业务逻辑实现我们并未实现，而是每一个路由都是向页面返回一条信息，这条信息仅仅返回了请求路径(或者我们其他的测试信息，比如返回*帅气的欧元安静的路过等等*)。


来测试一番，要启动程序，则首先修改工程根目录下的程序的启动文件(入口文件)index.js，将依赖项依次引入，修改index.js代码如下：

    var path = require('path');
    var express = require('express');
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);
    var flash = require('connect-flash');
    var config = require('config-lite');
    var routes = require('./routes');
    var pkg = require('./package');

    var app = express();


    // 设置模板根目录

    app.set('views',path.join(__dirname,'views'));

    // 设置模板引擎为ejs
    // 注意是view不是views哦！

    app.set('view engine','ejs');


    // 设置静态文件目录

    app.use(express.static(path.join(__dirname,'public')));

    // session中间件支持会话机制

    app.use(session({
        name:config.session.key, // 设置cookie中保存session id的字段名称
        secret:config.session.secret, // 通过设置secret来计算hash值并放在cookie中，使产生的signedCookie防篡改
        cookie: {
            maxAge:config.session.maxAge // 过期时间，过期后cookie中的session id自动删除
        },
        store:new MongoStore({ // 将session存放到mongodb
            db:config.db,
            url:config.mongodb // mongodb地址
        })
    }));


    // flash中间件，用于显示通知

    app.use(flash());

    // 处理表单及文件上传的中间件
    app.use(require('express-formidable')({
      uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
      keepExtensions: true// 保留后缀
    }));


    // 设置模板全局常量
    app.locals.blog = {
      title: pkg.name,
      description: pkg.description
    };

    // 添加模板必需的三个变量
    app.use(function (req, res, next) {
      res.locals.user = req.session.user;
      res.locals.success = req.flash('success').toString();
      res.locals.error = req.flash('error').toString();
      next();
    });


    // 路由

    routes(app);

    // 监听端口，启动程序

    app.listen(config.port,function(){
        console.log('${pkg.name} listening on port ${config.port}');
    });

此时在从cmd窗口进入到myblog根目录执行以下代码运行程序：

    supervisor --harmony index


然后我们随意访问以下几个路径：

1.http://localhost:3000/posts

2.http://localhost:3000/signout

3.http://localhost:3000/signup


看！飞碟！额...有点辣眼睛...


<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_2.png" align="center"></p>
</center>
