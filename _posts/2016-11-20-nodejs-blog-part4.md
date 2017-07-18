---
layout: post
title: Node+Express+MongoDB开发博客(四)
author: beyondouyuan
date: 2016-11-20
node: node
description: 记得小蘋初见，两重心字罗衣，琵琶弦上说相思。当时明月在，曾照彩云归。

---


### 写在前面 ###

下午去打了场篮球，额，忘了剪指甲，直接戳断了一个...所以，做任何事情之前还是要做好一切的准备工作啊。比如，造轮子不能停。

### 404页面 ###  

我们无法保证一件事永远是正确的，我们也无法预测一切事情都是不出意外的。到现在我们访问我们的博客的时候都是访问我们已知的路由请求，但是当到了用户这里，他可能会访问到一个不存在的路径，于是，服务器会返回一个提示到页面展示给用户看
*Cannot GET XXX*，好丑！


我们来自定义404页面，以便在用户访问到不存在的路径时，看到的提示舒服明了一些。修改routes/index.js，在：

    app.use('/posts', require('./posts'));

下添加如下代码：

    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.render('404');
      }
    });


在views/目录下新建404.ejs，用于展示错误信息。

这里借用了tx的公益404页面，当然，我们可以做自己的404页面。


### 错误页面 ### 

我们无法保证程序永远不出错，这个比无法保证用户永远都是访问正确请求的情况还要多。所以，我们需要有错误处理程序，并提供错误页面将错误栈返回并显示在错误页面上。

在views/目录下新建error.ejs页面，用于展示错误信息。

修改程序入口文件index.js，在app.listen上一行添加如下代码：

    // error page
    app.use(function (err, req, res, next) {
      res.render('error', {
        error: err
      });
    });

### 日志 ###

我们需要知道我们的用户在博客上做了哪些操作，操作的结果过如何。这就需要用到日志了，一般的应用都会使用到日志系统。我们的日志分为正常请求和错误请求，这两种错误都要打印到终端以便我们立刻知道用户的操作，同时日志还必须要写入到文件，以便日后查看(就如我现在所在的第三方支付公司在接受检查时，要求必须要在终端打印出日志并且相应敏感信息还需要加密，同时要用文件保存日志一段时间，以便日后有问题时可以从日志上查看)。 

我们使用winston和express-winston记录日志。新建logs目录存放日志文件，修改index.js，在：

    var pkg = require('./package');

下引入所需模块：

    var winston = require('winston');
    var expressWinston = require('express-winston');

并将：

    // 路由
    routes(app);


修改为：

    // 正常请求的日志
    app.use(expressWinston.logger({
      transports: [
        new (winston.transports.Console)({
          json: true,
          colorize: true
        }),
        new winston.transports.File({
          filename: 'logs/success.log'
        })
      ]
    }));
    // 路由
    routes(app);
    // 错误请求的日志
    app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        }),
        new winston.transports.File({
          filename: 'logs/error.log'
        })
      ]
    }));


我们将正常请求的日志打印到终端并写入了logs/success.log文件，将错误请求日志打印到终端并写入了logs/error.log。

需要注意：这个时候就需要.gitignore文件了，git会读取.gitignore 并忽略这些文件。在myblog下新建.gitignore文件，添加如下配置：


    config/*
    !config/default.*
    logs
    npm-debug.log
    node_modules
    public/img
    coverage

通过设置：

    config/*
    !config/default.*

这样只有config/default.js才会加入git的版本控制，而config目录下的其他配置文件则会被忽略。


### 测试 ###


似乎我们在以便开发中已经同时测试了我们的博客应用，但是这不够！要是开发就能做完所有测试的工作，那还要测试这个岗位干嘛！

我们使用mocha和supertest来测试我们的博客，在myblog下新建test文件夹存放测试文件，以注册为例子进行测试。

安装所需模块：

    npm i mocha supertest --save

修改package.json文件的script对象，添加测试命令：

    "scripts": {
      "test": "mocha --harmony test"
    }


指定执行test目录的测试，修改程序入口文件index.js，将：

    // 监听端口，启动程序
    app.listen(config.port, function () {
      console.log(`${pkg.name} listening on port ${config.port}`);
    });

修改为：

    if (module.parent) {
      module.exports = app;
    } else {
      // 监听端口，启动程序
      app.listen(config.port, function () {
        console.log(`${pkg.name} listening on port ${config.port}`);
      });
    }


如此，可以实现：直接启动index.js则会监听端口启动程序，如果index.js被require 了，则导出app，通常用于测试。测试一下注册时上传头像，放在test目录下，新建test/signup.js，代码如下：

    var path = require('path');
    var assert = require('assert');
    var request = require('supertest');
    var app = require('../index');
    var User = require('../lib/mongo').User;

    describe('signup', function() {
      describe('POST /signup', function() {
        var agent = request.agent(app);//persist cookie when redirect
        beforeEach(function (done) {
          // 创建一个用户
          User.create({
            name: 'aaa',
            password: '123456',
            avatar: '',
            gender: 'x',
            bio: ''
          })
          .exec()
          .then(function () {
            done();
          })
          .catch(done);
        });

        afterEach(function (done) {
          // 清空 users 表
          User.remove({})
            .exec()
            .then(function () {
              done();
            })
            .catch(done);
        });

        // 名户名错误的情况
        it('wrong name', function(done) {
          agent
            .post('/signup')
            .type('form')
            .attach('avatar', path.join(__dirname, 'avatar.png'))
            .field({ name: '' })
            .redirects()
            .end(function(err, res) {
              if (err) return done(err);
              assert(res.text.match(/名字请限制在 1-10 个字符/));
              done();
            });
        });

        // 性别错误的情况
        it('wrong gender', function(done) {
          agent
            .post('/signup')
            .type('form')
            .attach('avatar', path.join(__dirname, 'avatar.png'))
            .field({ name: 'nswbmw', gender: 'a' })
            .redirects()
            .end(function(err, res) {
              if (err) return done(err);
              assert(res.text.match(/性别只能是 m、f 或 x/));
              done();
            });
        });
        // 其余的参数测试自行补充
        // 用户名被占用的情况
        it(‘duplicate name', function(done) {
          agent
            .post('/signup')
            .type('form')
            .attach('avatar', path.join(__dirname, 'avatar.png'))
            .field({ name: 'aaa', gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
            .redirects()
            .end(function(err, res) {
              if (err) return done(err);
              assert(res.text.match(/用户名已被占用/));
              done();
            });
        });

        // 注册成功的情况
        it('success', function(done) {
          agent
            .post('/signup')
            .type('form')
            .attach('avatar', path.join(__dirname, 'avatar.png'))
            .field({ name: 'nswbmw', gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
            .redirects()
            .end(function(err, res) {
              if (err) return done(err);
              assert(res.text.match(/注册成功/));
              done();
            });
        });
      });
    });

运行npm test看看效果吧。

### 部署 ###

到目前为止，我们已经完成了博客的最基本功能，我们也做了测试，感觉还阔以，但是，这一切都是在本地进行的。我们想让用户使用我们的博客，那就必须将应用发布出去，发布出去时必然就与我们在本地使用不一样，比如，我们存放用户注册信息和发表的文章信息就不可能使用本地的服务器上，至少，我们得放到托管的云服务器上。启动应用时也不可能是依靠启动index.js文件来启动。

我们选用的服务器是MongoDB，除了其本身的特性适合我们的博客外，还有一个原因，有一个Mlab云数据提供商，他是一个MongoDB云数据提供商，而且最重要的是，他还为我们提供了一个500MB的免费空间，这是非常适合我们学习者用来做开发测试的。

首先注册一个Mlab账户，在账户下创建一个数据库，比如我们就创建一个名为nodeblog的数据库。

>
>
TIPS:MLab的每个数据库都必须至少有一个用户哦，
> 

创建数据库并未数据库添加用户后，我们会得到MLab分配的mongodb.url信息：

    mongodb://<dbuser>:<dbpassword>@ds139327.mlab.com:39327/databasename

databasename是我们创建的数据库名称(比如我们创建的nodeblog)，dbuser是我们为数据库nodeblog添加的用户名(比如我们添加的是ouyuan)，dbpassword当然就是我们添加的用户的密码了(比如我们用户ouyuan的密码就是ouyuan)。


在config/目录下新建production.js文件，添加如下代码：


    module.exports = {
        mongodb: 'mongodb://ouyuan:ouyuan15594821972@ds159237.mlab.com:59237/nodeblog'
};


>
>
TIPS:之前未在windows上配置环境变量，运行npm start时会报错
>


安装across-env:

    npm install cross-env --save-dev


在生产环境上执行：

    cross-env NODE_ENV=production supervisor --harmony index

以上运行成功，即证明我们成功配置了生产环境。

重新运行后，我们新注册一个用户，此时我们看可以在MLab上看到我们的注册信息了。

<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_13.png" align="center"></p>
</center>

当我们的博客要部署到线上服务器时，不能单纯的靠node index或者supervisor index来启动了，因为我们断掉SSH连接后服务就终止了。

这时我们就需要像pm2或者forever这样的进程管理器了。pm2是Node.js下的生产环境进程管理工具，就是我们常说的进程守护工具。


可以用来在生产环境中进行自动重启、日志记录、错误预警等等。以pm2 为例，全局安装pm2：

    npm install pm2 -g

修改package.json文件：


"scripts": {
  "test": "node --harmony ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha",
  "start": "cross-env NODE_ENV=production pm2 start index.js --node-args='--harmony' --name 'myblog'"
}


此时运行npm start，命令行打印信息如下：


<center>
<p><img src="https://beyondouyuan.github.io/img/node_blog_14.png" align="center"></p>
</center>


成功，此时我们把命令行关闭，依然可以在我们的博客上进行登录、注册、发表文章等操作。

我们离成功还剩一步！现在我们只能够通过[localhost:3000](localhost:3000)来使用我们的博客，一般的，我们要使用某个网站或者博客，一般会访问http://www.xxx.xx。而我们现在却是localhost:3000...，怎么办？我们可以通过托管平台来吧我们的应用托管起来，就像我们用gh-page来托管静态墨客一样，我们把我们的博客托管在HEROKU上。

### 部署到Heroku ### 

登录到Heroku后，点击右上角的Dashboard，然后依次点击New -> Create New App，输入应用名称(我创建的名称就叫做beyondouyuan)，得到一个应用，然后在Heroku的命令行工具上执行：

    $ heroku login


填写正确的email和password验证通过后，本地会产生一个SSH public key，
然后输入以下命令：


    $ git init
    $ heroku git:remote -a 你的应用名称(beyondouyuan)
    $ git add .
    $ git commit -am "first blood"
    $ git push heroku master

稍后，我们的论坛就部署成功了。访问：https://你的应用名称.herokuapp.com/。

呜呼！now！可以把你的博客推广给你的朋友了！额，虽然目前还是有点丑，功能也不多，不过，毕竟是第一次，有了第一次，那以后一切都好办了。

夜已深，人未眠，思春...噢不！思考！

以上，终于算是从入门到入坑过了一遍nodejs的瘾，不过，革命尚未成功，日后尚需努力！

