---
layout: post
title: 从头开始webpack
author: beyondouyuan
date: 2017-08-07
categories: blog
tags: [webpack]
webpack: webpack
description: 相思只在，丁香枝上，豆蔻梢头。

---

### 写在前面 ###

webpack本质上是一个打包工具，配置一个合理的webpack环境，不但可以高效的打包我们的开发文件，同时也可以给我们提供一个良好愉悦的开发环境，使用webpack配合前后端分离的开发是再美妙不过的事情了。


### 创建并进入项目

mkdir webpack-simple-project && cd webpack-simple-project

### 初始化项目

npm init
 
### 项目中安装webpack

npm install --save-dev webpack

### 构建项目目录

- 创建app目录
- 创建public目录

app目录用于保存原始数据以及项目开发的JAvaScript模块

pulic目录用于存放准备给浏览器读取的数据(包括使用的webpack打包后生成的js文件以及一个index.html文件)。

- 创建index.html文件放置于public目录，两个js文件(feedback.js和main.js)放置于app目录


index.html文件只需要基础的html代码，其唯一的目的就是加载打包后的js(bundle.js)文件

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>webpack-simple-project</title>
        <meta name="description" content="">
        <meta name="keywords" content="">
        <link href="" rel="stylesheet">
    </head>

    <body>
        <div id="root"></div>
        <script src="bundle.js"></script>
    </body>

    </html>

feedback.js只包含一个返回带有简短信息的html节点元素的函数

    module.exports = function() {
        var feedback = document.createElement('div');
        feedback.textContent = 'Hello Webpack';
        return feedback;
    };

main.js用来把feedback模块返回的节点插入页面


    const feedback = require('./feedback');

    document.getElementById('root').appendChild(feedback());


### 执行webpack命令

确保已全局安装webpack

webpack-simple-project>webpack app/main.js public/bundle.js

命令窗口如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_2.png" align="center"></p>
</center>

执行该命令后/public目录下将生成一个bundle.js文件，此即为打包后生成的js文件

项目结构如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_1.png" align="center"></p>
</center>

此时通过浏览器访问public/index.html即可看到页面上显示了我们想显示的信息。

以上，webpack已正常工作，但是倘若每次编译文件都要输入这么一大堆命令，着实效率低下，所以，我们需要通过使用webpack的配置文件来帮我们做这些事情。

### webpack配置文件

在根目录下新建webpack.config.js文件，此即为webpack的配置文件，基本的webpack配置包括入口文件以及存放打包后文件的目录路径.

    module.exports = {
        entry: __dirname + '/app/main.js',
        output: {
            path: __dirname + '/public',
            filename: 'bundle.js'
        }
    };

- entry：为项目入口文件(最终被页面引用的js文件极为入口文件)
- output：即为打包后的js文件存放的目录。
- __dirname：为node.js中的一个全局变量，其指向当前执行脚本所在的目录


#### 运行webpack

此时只需要在命令行执行 webpack 即可与之前执行的那一串命令得到同样的打包效果

命令行窗口如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_3.png" align="center"></p>
</center>

### 结合packege.json执行webpack

修改package.json的script标签


    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack"
    }

此script语句相当于把npm的start命令指向了webpack命令
此后，可以直接运行npm start来启动巍峨不怕船开命令执行打包工作。

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_4.png" align="center"></p>
</center>

npm的start是一个特殊的脚本名称，它的特殊性表现在，在命令行中使用npm start就可以执行相关命令，如果对应的此脚本名称不是start，想要在命令行中运行时，需要这样用npm run {script name}如npm run build。

### webpack功能

以上实现了基本的webpack配置，在以上的配置中只是利用的webpack命令进行金蛋的打包工作，webpack为前端开发这提供了十分强大的功能，利用这些功能，可以为前端开发哦配置一个愉快的开发工作环境。

### Source Maps

开发免不了需要调试，但是打包之后开发这并不容易找到出错地方对应的源代码位置，Source Maps为此而生。
配置Source Maps后，webpack在打包时可以为开发这生成source maps，如此则为开发这提供了一种对应编译文件和源码文件的方法，便于调试。

webpack配置Source Maps需要devtool，其提供四种不同的配置选项，可是具体需要而选择

devtool选项：

- source-maps：在一个单独的文件中产生一个完整且功能完全的文件，其具有最好的source maps，但其会减慢打包构建速度
- cheap-module-source-maps：在一个单独的文件中生成一个不带映射的map，其可以提高构建速度，但使用浏览器开发这工具调试时只能具体到汗，调试不便
- eval-source-maps：使用eval打包软文件模块，在同一个文件中生成干净完整的source maps，其可以在不影响构建速度的前提下生成完整的source maps，但其打包后存在性能以及安全的隐患，适用于开发阶段，生产阶段不推荐。
- cheap-module-eval-source-map：其在打包时具有最快生成source maps的速度，生成的Source Maps会和打包后的JavaScript文件同时显示


开发以及学习阶段选择使用eval-source-maps选项即可。

#### 配置Source Maps

修改webpack.config.js配置文件，添加source maps配置。

    module.exports = {
        devtool:'eval-source-maps',
        entry: __dirname + '/app/main.js',
        output: {
            path: __dirname + '/public',
            filename: 'bundle.js'
        }
    };


执行npm start重新打包，我们发现，打包后的bundle.js文件变大了，而且在浏览器的Source下可以看到bundle.js以及main.js.map以及feedback.js.map，若不添加source maps之前时，浏览器的开发这工作下是看不到这几个js文件的。

### 使用webpack构建本地服务器

此时我们浏览项目的index.html的方式是这样的：

file:///F:/study/webpack-simple-project/public/index.html

这是直接访问本地文件，太丑了有木有，而且显得非常不专业，我们希望是通过这样http:localhost:3000/index.html或者http:localhost:3000/*这样的方式也即像通过服务器访问服务器或者网站地址这样的方式来访问我们的本地项目，这样不但显得比较专业一些，而且，直接访问文件(file:///F:/study/webpack-simple-project/public/index.html)的方式需要每次刷新浏览器才能开发改动的效果，而通过服务器，可以实现自动刷新，无需每次都手动刷新。

使用webpack构建本地服务器，实现浏览器监控代码的修改，启动自动刷新修改后的结果，webpack提供了一个基于node.js构建的可选的本地服务器可实现这个功能。

webpack本地服务器是一个单独的模块组件，配置是需要单独安装作为项目依赖。

#### 安装webpack-dev-server依赖

npm install webpack-dev-server / cnpm install webpack-dev-server

webpack-dev-server有以下几个配置选项：

- contentBase：默认的webpack-dev-server会根据跟目录文件夹提供本地服务器，若是想为另外一个目录下的文件夹提供本地服务器，应在该目录（文件夹）下设置其所在目录（本例为/public目录）
- port：设置默认监听端口，若省略，则默认为8080端口
- inline：设置为true，当源文件改变时会自动刷新页面
- colors：设置为true，使终端输出的文件为彩色
- historyApiFailback：在开发单页面时常用，其依赖于HTML5 history Api，若设置为true，所有的跳转将指向index.html

#### 添加webpack-dev-server到webpack.config.js文件


    module.exports = {
        devtool:'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录  掘金社区使用的是webpack1.12.1版本，有所不同，本项目使用了webpack2.**
            // webpack2.** 使用colors报错，不使用也具有彩色颜色
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
        }
    };

tips：devServer中不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些

index.html在publc文件夹目录，我们想以本地服务器来启动index.html，故将contentBase设置为public目录。
命令行在项目在根目录直接执行webpack-dev-server，结果如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_5.png" align="center"></p>
</center>

此时访问[localhost:8080/](http://localhost:8080)即访问到了public/index.html。
且当我们改变feeedback.js的输出内容并保存后，命令行窗口自动重新打包js文件，浏览器自动刷新可以看到最新的提示信息。

浏览器自动刷新：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_6.png" align="center"></p>
</center>

tips：此时我们看public下的bundle.js文件并不是我们最新的feedback.js，因为webpack-dev-server打包的bundle.js是在内存中的。

将webpack-dev-server整合到package.json中，script下添加dev命令：

"dev":"webpack-dev-server --inline"

由于在webpack.config.js中配置的devServer已经带有inline参数，所以dev命令后面可以不带--inline参数，当webpack.config.js中部进行devServer的配置，则需要在script命令中添加相应的参数

运行dev命令

npm run dev

tips：在此项目中使用cnpm install webpack-dev-server然后整合到package.json script命令会报错，使用npm install webpack-dev-server安装依赖着不会，应该是cnpm进行了阉割。
