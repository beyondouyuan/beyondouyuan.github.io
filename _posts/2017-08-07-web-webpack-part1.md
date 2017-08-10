---
layout: post
title: 从头开始学习webpack
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

### Loaders

通过使用不同的loader，webpack通过调用外部脚本或工具可以对不同的格式的文件进行处理，如将JSON文件转换为JavaScript文件，或者打包ES6并转换为浏览器可识别运行的ES5，或者将React的jsx文件转换为JS文件。

Loaders需要单独安装并在webpack.config.js中的modules关键字下进行配置，Laoders配置选项有以下几个：

- test：匹配loaders所处理的文件的拓展名的正则表达式(必选)
- loader：loader的名称(必选)
- include：手动添加必须处理的文件/文件夹(可选)
- exclude：屏蔽不需要处理的文件/文件夹(可选)
- query：为loaders提供额外的设置选项(可选)


#### 小例子

将feedback.js中的问候语信息放置于一个JSON文件中，通过webpack配置使feedback。js可以获取JSON文件的值。

首先安装可转换JSON的loader

    npm install json-loader --save-dev

在webpack.config.js配置loader选项

    const webpack = require('webpack');

    module.exports = {
        devtool:'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json'
                }
            ]
        },

        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
            // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };

创建带有问候语信息的JSON文件feedback.json

    {
        "feedText": "Hello,This Is Webpack World!"
    }

更新feedback.js，引入json文件：

    const feedJSON = require('./feedback.json');

    module.exports = function() {
        var feedback = document.createElement('div');
        // feedback.textContent = 'Hello Webpack, this is Irving 哈哈哈哈';
        feedback.textContent = feedJSON.feedText;
        return feedback;
    };

保存feedback.js后，浏览器自动刷新可看到效果。

### Babel

Babel是一个编译JavaScript的平台，其强大之处在于可通过编译达到我饿每年想要的目的：

- 编译ES6/ES7/ES8
- 编译JavaScript的拓展语言，如React的JSX

#### 安装Babel并配置

Babel的核心包含几个模块化的包，其核心是babel-corenpm包中，webpack将他们整合在一起，但在实际应用中，每一个我们需要的功能或者拓展，都需要单独安装依赖包，一包用的比较多的是编译ES6的babel-preset-es2015和编译React jsx的babel-preset-react

安装babel及扩展包

    npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save -dev

babel-loader用于webpack读取加载babel（或者说ES6等）文件，babel-core是babel的核心包，我们不需要将整个babel包都安装下来，一般是安装babel的核心babel-core在安装其他需要的拓展包。

#### webpack中配置babel

    const webpack = require('webpack');

    module.exports = {
        devtool:'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // 不打包依赖项
                    loader: 'babel',
                    query: {
                        preset: ['es2015','react']
                    }
                }
            ]
        },

        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
            // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };


此时项目中则可以使用ES6以及React的JSX语法，安装React:

    npm install react react-dom --save-dev

### 使用React和ES6

更新feedback.js并返回一个React组件

    import React, { Component } from 'react';

    import feedJSON from './feedback.json';

    class Feedback extends Component {
        render() {
            return (
                <div>
                    {feedJSON.feedText}
                </div>
            )
        }
    }

    export default Feedback;

更新main.js

    import React from 'react';

    import { render } from 'react-dom';

    import Feedback from './feedback';

    render(<Feedback />, document.getElementById('root'));


此时，命令行报错，提示：

    ·can't reslove 'json' in..·
    ·can't reslove 'babel' in..·

    It's no longer allowed to omit the '-loader' suffix whem useing loaders

即webpack2.x以后不再支持省略-loader的后缀名的loader是配置方式，需要把loader的名称补全，修改webpack.config.js如下：

    const webpack = require('webpack');

    module.exports = {
        devtool:'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // 不打包依赖项
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015','react']
                    }
                }
            ]
        },

        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
            // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };

再次运行 npm run dev，成功！至此，我们已成功完成简单的bale配置，支持ES6和React的JSX语法的开发环境配置。

### Babel配置选项

Babel完全可以在webpack.config.js进行配置，一般的简单配置我们也都在webpack.config.js中完成配置，但是，Babel具体有非常多的配置选项，全部配置都在webpack.config.js文件中进行配置将显得太过复杂，所以通常的我们开发时将babel的一些配置须向放置在一个单独的.babelrc配置文件中，webpack会自动调用.babelrc里的babel配置选项。

修改webpack.config.js文件，其中的babel配置部分只保留配置加载babel，而对于es6和react的徐阿香则在.babelrc中配置；

    const webpack = require('webpack');
    module.exports = {
        devtool:'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // 不打包依赖项
                    loader: 'babel-loader'
                }
            ]
        },

        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
            // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };

#### 配置.babelrc

    {
        "presets": [
            "react",
            "es2015"
        ]
    }


### 一切皆模块

对于JS来说，一切皆对象，对于webpack来说，它所处理的的文件都会当作模块处理，包括JavaScript代码、CSS和fonts等等文件，只要有合适的loaders，这些文件就都可以被当作模块处理。


### CSS

webpack提供了两个工具来处理样式表，css-loader和style-loader，两者处理任务不同，css-loader使开发者能够使用类似@import和url(...)的方法实现require的（按需加载）功能，style-loader将所有计算的后的央视加入到页面中，二者组合一起使用能够把样式表嵌入到webpack打包后的js文件中。

#### 安装css-loader && style-loader

    npm install style-loader css-loader --save-dev

#### 配置css-loader


    const webpack = require('webpack');

    module.exports = {
        devtool:'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // 不打包依赖项
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                }
            ]
        },

        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
            // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };

TIPS: 感叹号的作用在于使同意文件能够使用不同类型的loader，当对同一文件使用不同类型的loader时，其计算方式为从右到左，以上，先使用css-loader然后再使用style-loader。

#### 创建css样式表文件

在app目录下创建main.css文件，书写样式内容。

webpack只有单一的入口，其他模块需要通过import、require、url等导入相关位置，为了让webpack能够找到'main.css'文件，我们需要将它到如到main.js文件中。

TIPS:webpack打包文件的时候，通常我们会把css和js打包在同一个文件中(以便将我们的css嵌入到页面的'< style></ style>'标签中)，而不会打包为一个耽误的css文件，当然，通过适合的配置webpack也可以把css大包围耽误的css文件。


### CSS module

使用CSS module就像把JS模块化一样，通过CSS module，所有的类名、动画名默认都制作用于当前模块。webpack提供了CSS module的处理方式，配置CSS loader后，只需要把‘module’传递到需要的地方，即可直接把CSS的类名传递到组件的代码中，且这样的处理方式只对当前的组件有效，不必再担心不同模块中具有相同类名会造成的覆盖问题。

### 配置CSS module

修改webpack.config.js

    const webpack = require('webpack');

    module.exports = {
        devtool:'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // 不打包依赖项
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader?modules'
                }
            ]
        },

        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
            // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };

app目录下创建一个Feedback.css文件：

    .root {
        background-color: lightcyan;
        padding: 10px;
        border: 5px solid lightsalmon
    }

并将其导入到Feedback.js文件中。

    import React, { Component } from 'react';

    import feedJSON from './feedback.json';

    import styles from './styles/Feedback.css';

    class Feedback extends Component {
        render() {
            return (
                <div className={styles.root}>
                    {feedJSON.feedText}
                </div>
            )
        }
    }

    export default Feedback;

以上，Feedback.css中的类名为.rrot，与根目录的div的类名是一样的，但是当我们配置了 CSS Module后，我们在组件中应用该央视别的样式名为{style.className}的方式，webpack打包后，组件引用的这个类名将会是独一无二的hash值类名，因而不必担心覆盖问题：

审查元素，可看到组件的类名如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_7.png" align="center"></p>
</center>

### CSS预处理

如Sass与Less之类的CSS预处理，使用预处理可以对原生的CSS进行扩展，个人更多是使用Sass。

webpack提供了丰富的CSS预处理loader：

- Less loader
- Sass loader
- Stylus loader
- PostCSS loader
    







### 插件（Plugins）

差价用于拓展webpack功能，他们会在整个构建过程中生效，执行相关任务，Loaders和Plugins常常被混淆，其实他们并不完全相同，Loaders是打包构建过程中用来处理文件的(JSX、Scss、Less等)，一次处理一个，插件并不直接操作单个文件，它直接对整个构建过程起作用。

#### 使用插件方法

使用npm安装需要使用的插件，然后需要做的事情就是在webpack配置中的plugins关键字部分添加该插件的一个实例(plugins是一个数组)。

添加一个版权申明的插件:

    const webpack = require('webpack');

    module.exports = {
        devtool: 'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/public', // 打包文件输出目录
            filename: 'bundle.js' // 打包后的js文件名称
        },

        module: {
            loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/, // 不打包依赖项
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            }]
        },

        plugins: [
            new webpack.BannerPlugin('Copyright Flying Unicoms Irving...')
        ],
        devServer: {
            contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
                // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };


此时查看bundle.js即可看到我们的版权申明信息。

#### HtmlWebpackPlugin

HtmlWebpackPlugin插件的作用为依据一个简单的模板，帮助开发者生成最终的html5文件，该html5中自动引用了开发时打包后的JS文件，每次编译都在文件名插入一个唯一hash值，借此可以解决开发时的缓存刷新问题。

安装HtmlWebpackPlugin插件

    npm install html-webpack-plugin --save-dev

该插件自动完成了我们之前手动做的事情，正式使用该插件时，对我们的项目结构做一些调整：

- 移除public目录，利用该插件，HTML5文件会自动生成，此外CSS已经通过前面的插件打包到JS文件中了。
- app目录下创建一个Html文件模板，该模板包含title等其他开发需要的元素，在编译过程中，该插件会依据此模板生成最终的html页面，会自动添加所依赖的css、js、favicon等文件，

将html模板命名为index.tmpl.html（模板名字可随意自定义，但应具有语义化）

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>webpack-simple-project</title>
        <meta name="description" content="从头开始学习webpack">
        <meta name="keywords" content="webpack react">
    </head>

    <body>
        <div id="root" class="root">
        </div>
    </body>

    </html>


新建一个build目录用来存放最终的输出文件（其实无需手动船舰文件在，执行编译命令是将会自动创建这个文件夹）

更新webpack配置:

    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
        devtool: 'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/build', // 打包文件输出目录
            filename: 'bundle-[hash].js' // 打包后的js文件名称
        },

        module: {
            loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/, // 不打包依赖项
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            }]
        },

        plugins: [
            new webpack.BannerPlugin('Copyright Flying Unicoms Irving...'),
            new HtmlWebpackPlugin({
                template: __dirname + '/app/index.tmpl.html' // new 一个该插件的实例，并传入相关参数
            })
        ],
        devServer: {
            // contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录 可以不添加该选项
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
                // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };

审查元素，可以看到如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_8.png" align="center"></p>
</center>

模板生成了，并且添加了hash值用以解决缓存问题。

因为npm run dev是启动一个本地服务器，并没有执行真正的编译，其所编译的文件是在内存中，开发者无法看到，此时，我们执行npm start，执行本地编辑，可以看到本地项目中自动创建了build目录，其其下包含有两个文件，一个是带有hash值的JS打包文件，一个实引用了这个带有hash值的打包文件的html文件，这个html文件有插件根据模板文件生成，如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_9.png" align="center"></p>
</center>

### Hot Module Replacement(HMR)热更新

该插件允许开发者在修改组件代码后，浏览器自动刷新实时预览修改后的效果。

实现Hot Module Replacement很简单，只需要在webpack.config.js中plugins关键字下new一个Hot Module Replacement实例即可(社区使用的webpack版本低于webpack2.x，孤儿还需要在webpack dev server及devServer中添加hot:true参数，大于webpack2.x版本则无需添加该参数)：


    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
        devtool: 'eval-source-maps', // source maps

        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/build', // 打包文件输出目录
            filename: 'bundle-[hash:8].js' // 打包后的js文件名称，只保留8位的hash
        },

        module: {
            loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/, // 不打包依赖项
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            }]
        },

        plugins: [
            new webpack.BannerPlugin('Copyright Flying Unicoms Irving...'),
            new HtmlWebpackPlugin({
                template: __dirname + '/app/index.tmpl.html' // new 一个该插件的实例，并传入相关参数
            }),
            new webpack.HotModuleReplacementPlugin()//热加载插件
        ],
        devServer: {
            // contentBase: __dirname + '/public', // 本地服务器说加载的页面所在目录 可以不添加该选项
            contentBase: __dirname + '/build',
            historyApiFallback: true, // 不跳转
            inline: true // 实时刷新
            // hot: true
                // webpack-dev-server2.x后不再支持colors、hot、prosses等参数
        }

    };

完成以上配置，webpack只能实现普通的JS模块实现热更新，如是想对React组件实现热更新，则需要使用到babel的react-transform-hrm插件(babel和webpack是两个独立的工具哦！只是一般开发都将两者结合起来使用)：

安装react-transform-hmr

    npm install babel-plugin-react-transform react-transform-hmr --save-dev

配置babel(即.babelrc文件)：

    {
        "presets": [
            "react",
            "es2015"
        ],
        "env": {
            "developmwnt": {
                "plugins": [["react-transform", {
                    "transforms": [{
                        "transform": "react-transform-hmr",

                        "import": ["react"],
                        "locals": ["modules"]
                    }]
                }]]
            }
        }
    }

环境为开发环境，因为只有在开发环境中开发则需要调试才有热更新的需求，生产环境上不存在组件代码发生改变的事情(要是有那就糟糕了。。。)，也无需再调试，所以去掉source maps。去掉source maps后打包的文件将会非常小，编译时间也会少很多，如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/webpack/webpack_10.png" align="center"></p>
</center>

至此，已完成基本的开发环境配置，但是在产品阶段，可能还需要对打包文件进行额外的优化处理，如压缩，缓存以及分离css和js。

### 产品环境构造

一般并不是太复杂的项目，我们可以将所有配置都放置在一个配置文件中，对于较复杂的项目，则一般选择分解配置文件为多个小的文件，以使得事情清晰明了有条理。

#### webpack.production.config.js

新建webpack.production.config.js文件，在其内添加基本的配置，其与webpack.config.js基本一致：

TIPS：其实我们还可以这样划分：

- webpack.base.config.js 基本配置
- webpack.dev.config.js 开发配置
- webpack.production.config.js 生产配置

在开发配置和生成环境中到如基本配置，如此拆分更为合理些。
新建webpack.production.config.js文件：

    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/build', // 打包文件输出目录
            filename: 'bundle-[name].js' // 打包后的js文件名称，只保留8位的hash
        },

        module: {
            loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/, // 不打包依赖项
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            }]
        },

        plugins: [
            new webpack.BannerPlugin('Copyright Flying Unicoms Irving...'),
            new HtmlWebpackPlugin({
                template: __dirname + '/app/index.tmpl.html' // new 一个该插件的实例，并传入相关参数
            }),
        ]

    };


生产环境中不需要热更新之类的的功能，则去掉，可在生产环境中添加压缩等优化功能。

#### 更新package.json

pakage.json文件中添加生产构建命令，命令中指定生产环境的webpack配置未见：

    {
      "name": "webpack-simple-project",
      "version": "1.0.0",
      "description": "webpack",
      "main": "./app/main.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack",
        "dev": "webpack-dev-server",
        "build": "webpack --config ./webpack.production.config.js"
      },
      "keywords": [
        "webpack"
      ],
      "author": "beyondouyuan",
      "license": "ISC",
      "devDependencies": {
        "autoprefixer": "^7.1.2",
        "babel-core": "^6.25.0",
        "babel-loader": "^7.1.1",
        "babel-plugin-react-transform": "^2.0.2",
        "babel-preset-es2015": "^6.24.1",
        "babel-preset-react": "^6.24.1",
        "css-loader": "^0.28.4",
        "html-webpack-plugin": "^2.30.1",
        "json-loader": "^0.5.7",
        "postcss-loader": "^2.0.6",
        "react": "^15.6.1",
        "react-dom": "^15.6.1",
        "react-transform-hmr": "^1.0.4",
        "style-loader": "^0.18.2",
        "webpack": "^3.4.1",
        "webpack-dev-server": "^2.6.1"
      },
      "dependencies": {}
    }




### 优化插件

配置的简单的生产环境的环境，去掉source map即可较少编译时间以及较小打包文件，若再增加一些优化的配置，如压缩，则打包文件会更快体积也更小：

- OccurenceOrderPlugin :为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
- UglifyJsPlugin：压缩JS代码；
- ExtractTextPlugin：分离CSS和JS文件


OccurenceOrder和UglifyJS plugins均为内置插件，则这两个插件无需安装可直接使用，只需配置即可，安装ExtractTextPlugin插件：

    npm install extract-text-webpack-plugin --save-dev

配置优化插件（生产环境进行优化，及配置webpack.production.config.js）:

    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    module.exports = {
        entry: __dirname + '/app/main.js', // 入口文件
        output: {
            path: __dirname + '/build', // 打包文件输出目录
            filename: '[name]-bundle-[hash:8].js' // 打包后的js文件名称，只保留8位的hash
        },

        module: {
            loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/, // 不打包依赖项
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
                // loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!postcss-loader')
            }]
        },

        plugins: [
            new webpack.BannerPlugin('Copyright Flying Unicoms Irving...'),
            new HtmlWebpackPlugin({
                template: __dirname + '/app/index.tmpl.html' // new 一个该插件的实例，并传入相关参数
            }),
            // new webpack.optimize.OccurenceOrder(), // 分割组件的最小ID
            new webpack.optimize.UglifyJsPlugin(), // 压缩JS
            // new ExtractTextPlugin('name-[hash:8].css') // 分离出来的css文件的名称明明为style.css
        ]

    };

TIPS：删除项目安装包以及该安装包在pakage.json下的依赖信息：

    npm uninstall --save pkg
如：
    npm uninstall --save postcss-loader

只删除安装包，不删除pakage.json的依赖信息：

    npm uninstall pkg
如：
    npm uninstall postcss-loader

### rimraf

以上，增加了hash来处理缓存后，每次打包都会生成一个weiyihash的打包文件，当我们打包n次之后，就会出现n个具有不同hash的打包文件，而我们其实只需要最后一次打包得到的js文件，所以处理方式是每次打包前清理整个build目录，然后再生成打包文件，如此则每次打包都清理干净build目录，打包后就只有一个bundle-hash.js。

安装rimraf到项目：
    npm install rimraf --save-dev

将rimraf整合至pakage.json的script中的build命令：

    "build": "rimraf build && webpack -p --config ./webpack.production.config.js"

此后每次运行npm run build都会首先清理build目录后再打包，保证build内干净。


pakage.json：

    {
      "name": "webpack-simple-project",
      "version": "1.0.0",
      "description": "webpack",
      "main": "./app/main.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack",
        "dev": "webpack-dev-server",
        "build": "rimraf build && webpack -p --config ./webpack.production.config.js"
      },
      "keywords": [
        "webpack"
      ],
      "author": "beyondouyuan",
      "license": "ISC",
      "devDependencies": {
        "autoprefixer": "^7.1.2",
        "babel-core": "^6.25.0",
        "babel-loader": "^7.1.1",
        "babel-plugin-react-transform": "^2.0.2",
        "babel-preset-es2015": "^6.24.1",
        "babel-preset-react": "^6.24.1",
        "css-loader": "^0.28.4",
        "extract-text-webpack-plugin": "^3.0.0",
        "html-webpack-plugin": "^2.30.1",
        "json-loader": "^0.5.7",
        "postcss-loader": "^2.0.6",
        "react": "^15.6.1",
        "react-dom": "^15.6.1",
        "react-transform-hmr": "^1.0.4",
        "rimraf": "^2.6.1",
        "style-loader": "^0.18.2",
        "webpack": "^3.4.1",
        "webpack-dev-server": "^2.6.1"
      },
      "dependencies": {}
    }
