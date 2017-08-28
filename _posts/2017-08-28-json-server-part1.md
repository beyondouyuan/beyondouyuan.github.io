---
layout: post
title: 前后端分离利器之json-server和mockjs
author: beyondouyuan
date: 2017-08-28
categories: blog
tags: [JavaScript]
javascript: javascript
description: 一寸柔肠情几许？薄衾孤枕，梦回人静。侵晓潇潇雨。
---

### 写在前面

前后端分离是一种优秀的分工模式，前端开发不受后段API开发进度的影响，可脱离后段进行。实现前后端分离的一个关键点是前端需要有模拟的数据接口供前端调用，再平实开发中，若数据量比较少或者不太复杂，那么可以直接使用json文件来模拟，但是遇到需要大量的数据或者比较复杂的表结构，json就显得比较吃力，mockjs也就成了一种很好的解决方案。mockjs提供多种数据类型的模拟数据，函括字符串、数组、对象以及图片链接等。mockjs在纯静态的开发中就几乎可以满足我们的所有需求，但是一般涉及到需要启动服务器下的开发，如在React应用开发中，就需要将mockjs整合到服务器中，通常前端启动服务器监听一个端口，mockjs启动另外一个服务器，监听另一个端口，那么，跨域就来了，webpack可以很方便的实现服务器跨域代理，如果应用中没有集成webpack呢？json-server启动的服务器可以直接支持跨域！


### json-server

一个json-server服务器非常简单。首先全局安装json-server包：
    npm install json-server -g
然后在项目根目录下新建一个server文件夹，其下新建db.json文件，然后命令窗口直接执行json-server即可：


    {
      "stars": [
        {
          "name": "勒布朗·詹姆斯",
          "age": 33,
          "team": "骑士",
          "size": 203,
          "id": 10000
        },
        {
          "id": 10001,
          "name": "凯利·欧文",
          "age": 25,
          "team": "骑士",
          "size": 191
        },
        {
          "id": 10002,
          "name": "德韦恩·韦德",
          "age": 34,
          "team": "公牛",
          "size": 193
        }
      ],
      "news": [
        {
          "title": "欧文交易暂停",
          "id": 10000,
          "date": "2017-08-24",
          "link": "http://nba.com.cn/news/list/news_id=100",
          "content": "由于以赛亚·托马斯体检未合格，骑士将重新评估刺激交易",
          "comments": [
            {
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "5"
            },{
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "5"
            },{
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "10"
            }
          ]
        },{
          "title": "欧文交易暂停",
          "id": 10001,
          "date": "2017-08-24",
          "link": "http://nba.com.cn/news/list/news_id=100",
          "content": "由于以赛亚·托马斯体检未合格，骑士将重新评估刺激交易",
          "comments": [
            {
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "5"
            },{
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "5"
            },{
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "10"
            }
          ]
        },{
          "title": "欧文交易暂停",
          "id": 10002,
          "date": "2017-08-24",
          "link": "http://nba.com.cn/news/list/news_id=100",
          "content": "由于以赛亚·托马斯体检未合格，骑士将重新评估刺激交易",
          "comments": [
            {
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "5"
            },{
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "5"
            },{
              "authors": "小欧元",
              "content": "厉害了我的哥！",
              "time": "2017-08-25",
              "star": "10"
            }
          ]
        }
      ]
    }
在服务器目录server/下执行json-server db.json -w -p 3000命令，json-server带三个参数，第一个db.json为json-server启动服务器数据模板，第二个-w即watch，监控db.json的更改，第三个即port，服务器监听的端口。浏览器访问[http://localhost:3000](http://localhost:3000)即可看到json-server为我们提供的数据接口，浏览器访问json-server启动的服务器可以看到所有数据接口列表。访问相应借口得到对应数据。如此，前端可直接调用这个接口访问数据。

使用json-server启动数据库，其为开发者注册一些列标准的RESTFull风格的API接口路由，以players为例：

- GET/news 获取新闻列表的接口
- GET/news/:id 获取单个新闻的接口
- POST/news 新增新闻的接口
- PUT/news/:id 更新新闻的接口
- DELETE/news:id 删除新闻的接口

在获取数据列表的接口中也可以追加参数参数，用来限定查询结果，如：

- 查询title为xxx的新闻：/news?title='xxx'
- 查询id大于等于10000且小于等于10010的新闻：/news?id_gte=10000id_lte=10010

此外还可以限定分页、排序、匹配等查询方式。


其实这就是一个启动了服务器的静态json模拟数据，所不同的是，json-server为我们提供了服务器的访问方式以及RESTFull风格的API，这种方式可以满足我们一定的需求，但他依然是一种静态的数据方式，改动变更依然麻烦。


### Mockjs

在server/目录下新建mock.js文件：

    /*
    * @Author: beyondouyuan
    * @Date:   2017-08-27 10:59:06
    * @Last Modified by:   beyondouyuan
    * @Last Modified time: 2017-08-27 11:20:44
    */


    const Mock = require('mockjs');
    const Random = Mock.Random;

    module.exports = () => {
        let data = {
            stars: [],
            news: []
        };

        const starImages = [1, 2, 3].map(img => Random.image('120x60', Random.color(),Random.word(2,6)));
        for(let i = 0; i < 50; i++) {
            const contents = Random.cparagraph(0,10);
            data.stars.push({
                id: i,
                name: Random.cname(),
                desc: contents.substr(0,50),
                tag: Random.cword(2,8),
                views: Random.integer(100, 5000),
                images: starImages.slice(0, Random.integer(1,3))
            })
        }
        const newsImages = [1, 2, 3].map(img => Random.image('120x60', Random.color(),Random.word(2,6)));
        for(let i = 0; i < 100; i++) {
            const contents = Random.cparagraph(0,10);
            data.news.push({
                id: i,
                title: Random.cword(8,20),
                desc: contents.substr(0,50),
                tag: Random.cword(2,8),
                views: Random.integer(100, 5000),
                images: newsImages.slice(0, Random.integer(1,3))
            })
        }
        return data;
    }

命令行窗口执行json-server命令：

    cd server && json-server mock.js -w -p 3000

<center>
<p><img src="https://beyondouyuan.github.io/img/other/other_1.png" align="center"></p>
</center>

到此，我们已经将mockjs和json-server即鹤了起来，这为我们提供了动态的模拟数据接口，麻麻再也不用担心前端的你要等待后段的进度，粑粑再也不懂担心你老是去修改json文件来模拟数据，老师再也不用担心搞不懂跨域的你，json-server点读机，哪里不会点哪里！

### 多样的json-server

json-server很简单，但是花样也不少，比如，我们可以配置
一些基本信息，自定义接口类型等等，比如，可以这么玩：

server/目录下新建config.js文件：

    module.exports = {
      SERVER:"127.0.0.1",
      PORT: 3003,
      RULES:"routes.json",
      DB_FILE:"./db.js"
    };

server/目录下新建db.js文件：

    const Mock = require('mockjs');
    const Random = Mock.Random;

    module.exports = () => {
        let data = {
            stars: [],
            news: []
        };

        const starImages = [1, 2, 3].map(img => Random.image('120x60', Random.color(),Random.word(2,6)));
        for(let i = 0; i < 50; i++) {
            const contents = Random.cparagraph(0,10);
            data.stars.push({
                id: i,
                name: Random.cname(),
                desc: contents.substr(0,50),
                tag: Random.cword(2,8),
                views: Random.integer(100, 5000),
                images: starImages.slice(0, Random.integer(1,3))
            })
        }
        const newsImages = [1, 2, 3].map(img => Random.image('120x60', Random.color(),Random.word(2,6)));
        for(let i = 0; i < 100; i++) {
            const contents = Random.cparagraph(0,10);
            data.news.push({
                id: i,
                title: Random.cword(8,20),
                desc: contents.substr(0,50),
                tag: Random.cword(2,8),
                views: Random.integer(100, 5000),
                images: newsImages.slice(0, Random.integer(1,3))
            })
        }
        return data;
    }


db.js实际上就是一个模拟的数据库，与之前的mock.js是一样的。

再在server/目录下新建index.js文件用于使用json-server的api来启动服务器：

    const path = require('path');
    const config = require('./config');
    const jsonServer = require('json-server');
    const rules = require('./routes');
    const dbfile = require(config.DB_FILE);

    const ip = config.SERVER;
    const port = config.PORT;
    const db_file = config.DB_FILE;

    const server = jsonServer.create();
    const router = jsonServer.router(dbfile());
    const middlewares = jsonServer.defaults();

    // 当将json-server安装的项目本地配合mockjs以及自定义路由时，必须使用node命令启动服务器，而不能使用json-server命令来启动复杂配置项目，如此处的index.集成复杂配置，但是，json-server可单独启动mock.js文件以及启动db.json静态配置的数据源

    server.use(jsonServer.bodyParser);
    server.use(middlewares);

    server.use((req, res, next) => {
        res.header('X-Hello', 'World');
        next();
    })

    router.render = (req, res) => {
        res.jsonp({
            code: 0,
            body: res.locals.data
        })
    }

    server.use("/api", router);
    server.use(jsonServer.rewriter(rules));
    server.use(router);

    server.listen({
        host: ip,
        port: port,
    }, function() {
        console.log(JSON.stringify(jsonServer));
        console.log(`JSON Server is running in http://${ip}:${port}`);
    });


>
note:当我们想在项目中使用json-server的api自定义的启动服务器时，需要将json-server安装到本地当前项目，而且对于使用自定义api自动服务器时，服务器文件是一个.js文件，json-server需要我们使用node script命令来启动，否则报错。
我们可以使用cd server && json-server mock.js -w -p 3000命令来启动mock.js却不能使用cd server && json-server index.js -w -p 3000，只能使用cd server && node index.js -w -p 3000
>

此时在命令行进入到项目的server/目录，执行node index.js即可。

也可以将json-server整合到pakage.json的scripts命令中。

初始化项目
    npm init

pakage.json配置node script命令来启动json-server：

    "scripts": {
        "start": "cd server && node ./index.js"
      },

然后不再需要进入到server／目录，只需要在项目根目录执行npm start命令即可。

更多的玩法，那就参考json-server的官网来咯。

