---
layout: post
title: Node+Express+MongoDB开发博客(二)
author: beyondouyuan
date: 2016-11-19
categories: blog
tags: [NodeJs]
node: node
description: 月沉沉，人悄悄，一炷后庭香袅。风流帝子不归来，满地禁花慵扫。

---

### 写在前面 ### 

在上一篇博文，我们已经成功启动应用并进行了测试，我们把访问的路径返回给用户，并用res.send()将信息发送到页面中，有没有觉得...这也太特么丑了！而且，我们很多功能肯定是需要用到UI界面来显示我们炫酷迷人的博客了(废话，没有UI难道在终端玩博客啊！)，所以，我们需要为我们的博客设计UI页面！

### 页面设计 ###

在这里，我们学习的重点在于Node开发，而不在于UI等方面，所以，我暂且先厚着脸皮直接拿Cnode社区的页面先用着，至于之后的UI方面，日后再说...

使用Jquery+Semantic-UI实现前端页面，我们的页面主要有：

1.注册页面

2.登录页面

3.未登录时的主页或者用户页

4.登录后的主页或者用户页

5.发表文章页

6.编辑文章页

7.未登录时的文章页

8.登录后的文章页

9.通知


我们使用ejs作为模板，将模块拆分成一些组件，然后使用ejs的include方法将组件组合起来进行渲染，同时为组件以及模板创建样式表，在public/css目录下创建style.css文件来保存全局样式。

在views/目录下创建头部模块header.ejs文件、页脚模块footer.ejs文件，同时在views目录下创建components文件夹用于存放组件文件。

在components目录下创建nav.ejs文件放置导航栏组件、nav-setting.ejs文件放置导航栏响应按钮、notification.ejs文件放置通知组件。

>
> TIPS：footer.ejs模块中的script标签是semantic-ui操控页面控件的代码，一定要放到footer.ejs 的body标签的前面，因为只有页面加载完后才能通过JQuery获取DOM元素。
>

>
> TIPS：注意header.ejs和footer.ejs的标签闭合问题哦！
>


以上模板中，我们使用到了blog、user、success、error变量，我们将blog变量挂在到app.locals下，将user、success、error挂载到res.locals下。

我们来修改程序入口文件index.js，在routes(app)上一行添加如下代码：

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

这样一来，即可在模板中调用这些变量了。


### 连接数据库 ###

我们页面设计部分不再重点，所以...就借用大家的智慧了。

我们选择了MongoDB这个非关系型数据库，在express中使用Mongolass模块来操作MongoDB的增删改查。在myblog下新建lib文件目录，在lib目录下新建mongo.js，其代码如下：

    var config = require('config-lite');
    var Mongolass = require('mongolass');
    var mongolass = new Mongolass();
    mongolass.connect(config.mongodb); 

### 注册 ### 

页面已经设计好，数据库也已经连接，万事俱备只欠东风！

午时已到！首先来实现注册处理程序。


我们只存储用户的名称、密码(加密后的)、头像、性别和个人简介这几个字段，对应修改 lib/mongo.js，添加如下代码：


    exports.User = mongolass.model('User', {
      name: { type: 'string' },
      password: { type: 'string' },
      avatar: { type: 'string' },
      gender: { type: 'string', enum: ['m', 'f', 'x'] },
      bio: { type: 'string' }
    });
    exports.User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一


只有画，没有美人，岂不扫兴？模板已经设计好，那么我们就来做一个具体的注册页面！

#### 注册页面 #### 


新建views/signup.ejs文件，用于存放注册页面代码。

随后，修改routes/signup.js中获取注册页的路由如下：


    // GET /signup 注册页
    router.get('/', checkNotLogin, function(req, res, next) {
      // res.send(req.flash());
      //  update to get signup.ejs page by oy
      res.render('signup');
    });

现在访问localhost:3000/signup看看效果吧!


<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_3.png" align="center"></p>
</center>

惊世骇俗！神魂颠倒！果然是角色美人！我们的signup路由通过render方法成功获取到页面了。

#### 注册与文件上传 #### 

我们使用express-formidable处理form表单(包括文件上传)。修改index.js，在app.use(flash()); 下一行添加如下代码：


    // 处理表单及文件上传的中间件
    app.use(require('express-formidable')({
      uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
      keepExtensions: true// 保留后缀
    }));

新建models/users.js文件，添加如下代码：

    var User = require('../lib/mongo').User;

    module.exports = {
      // 注册一个用户
      create: function create(user) {
        return User.create(user).exec();
      }
    };

完善一下我们的注册处理程序，修改signup.js：

    // signup.js
    var path = require('path');
    var sha1 = require('sha1');
    var express = require('express');
    var router = express.Router();

    var UserModel = require('../models/users');
    var checkNotLogin = require('../middlewares/check').checkNotLogin;

    // GET /signup 注册页
    router.get('/', checkNotLogin, function(req, res, next) {
      res.render('signup');
    });

    // POST /signup 用户注册
    router.post('/', checkNotLogin, function(req, res, next) {
      var name = req.fields.name;
      var gender = req.fields.gender;
      var bio = req.fields.bio;
      var avatar = req.files.avatar.path.split(path.sep).pop();
      var password = req.fields.password;
      var repassword = req.fields.repassword;

      // 校验参数
      try {
        if (!(name.length >= 1 && name.length <= 10)) {
          throw new Error('名字请限制在 1-10 个字符');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
          throw new Error('性别只能是 m、f 或 x');
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
          throw new Error('个人简介请限制在 1-30 个字符');
        }
        if (!req.files.avatar.name) {
          throw new Error('缺少头像');
        }
        if (password.length < 6) {
          throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
          throw new Error('两次输入密码不一致');
        }
      } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/signup');
      }

      // 明文密码加密
      password = sha1(password);

      // 待写入数据库的用户信息
      var user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
      };
      // 用户信息写入数据库
      UserModel.create(user)
        .then(function (result) {
          // 此 user 是插入 mongodb 后的值，包含 _id
          user = result.ops[0];
          // 将用户信息存入 session
          delete user.password;
          req.session.user = user;
          // 写入 flash
          req.flash('success', '注册成功');
          // 跳转到首页
          res.redirect('/posts');
        })
        .catch(function (e) {
          // 用户名被占用则跳回注册页，而不是错误页
          if (e.message.match('E11000 duplicate key')) {
            req.flash('error', '用户名已被占用');
            return res.redirect('/signup');
          }
          next(e);
        });
    });

    module.exports = router;

注册处理程序完成，已经迫不及待了！

但为了看到显著的效果，我们先创建主页的模板。修改routes/posts.js 中对应代码如下：

    // GET /posts 所有用户或者特定用户的文章页
    //   eg: GET /posts?author=xxx
    router.get('/', function(req, res, next) {
      // res.send(req.flash());
      // 测试路过
        // res.send('帅哥欧元静静的路过');
      res.render('posts');
    });

为主页路由获取主页页面，此时主页页面并尚未存在，我们在views/目录下创建posts.ejs文件，用于存放主页页面代码如下：

    <%- include('header') %>
    这是主页
    <%- include('footer') %>


访问注册页面并尝试注册看看！

我们在注册页面输入的页面信息：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_4.png" align="center"></p>
</center>

注册成功并跳转到主页：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_5.png" align="center"></p>
</center>

本地的数据库中有我们的注册信息，成功保存到数据库！

<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_6.png" align="center"></p>
</center>


我们，成功了！我们，是同志了！
