---
layout: post
title: NodeJs项目实战之实时聊天室(一)
author: beyondouyuan
date: 2016-10-30
categories: blog
tags: [NodeJs]
node: node
description: 清润风光雨后天，蔷薇花谢绿窗前，碧琉璃瓦欲生烟。十里闲情凭蝶梦，一春幽怨付鲲弦。小楼今夜月重圆。

---

### 写在前面 ###


当我们准备做一个nodejs的应用时，我们会首先创建一个项目的工程目录，这个时候，我们一般会首先从cmd窗口进入到该工程的根目录，然后执行*npm init*命令，此时，窗口要求我们按提示输入一些信息(这些信息就是之后的package.json的信息，如一些版本号，描述，关键词等等)，执行此命令后，程序将会自动在工程根目录创建一个package.json的文件，有了这个package.json配置文件之后，我们将可以在此文件中配置我们的应用信息。比如，当我们的项目需要依赖某个模块(如express模块)时，我们会在cmd命令窗口执行*npm install express -save*，这条命令将会在工程根目录的package.json文件中自动添加诸如：

    "dependencies": {
        "express": "^4.14.0"
    }


即将我们应用的依赖包信息配置写入其中，当我们发布应用的时候无须将我们的依赖包的文件也一起发布，而只需要package.json文件中有我们需要的依赖包的信息即可，当别人下载或者使用我们的应用时，程序会根据package.json的配置信息内的依赖包信息自动下载所需要的依赖包。

所以每当我们创建一个应用的工程目录后，接下来的事都首先应该是执行*npm init*命令来自动生成package.json配置文件。以便便于后面的添加配置信息。

若我们不是在创建工程目录后马上就执行*npm init*命令来创建package.json文件，那么当我们下载一个包时，使用这样的命令：

    npm install express -save

这时候，窗口会提示项目目录中找不到pakage.json这样文件，虽然这个依赖包依然安装成功，但是却没有将应用的依赖包信息自动写入pakage.json配置文件，但后期我们需要配置很多的依赖关系信息时则需要手动输入，将十分不便。

>
>
当然当我们不想把依赖信息马上就写入配置文件中时，每次下载某个包时，后面可以不加*-save*即可，比如*npm install express*一样可以下载依赖包，只是没有将依赖信息配置到package.json文件中而已。
>


### 项目介绍 ### 


#### 功能介绍 #### 

1.用户列表

2.文本信息传输

3.图片传输

4.上下线通知

#### 技术点 #### 

1.nodejs

2.express

3.socket.io

4.html+css

5.其它(soc.js/Message.js)


#### 项目进程 ####

1.nodejs+express环境配置

2.soket.io入门

3.socket.io事件

4.聊天室基础实战

5.jade应用

6.聊天界面

7.系统信息

8.用户上下线通知

9.单聊天及群聊

10.图片发送

11.功能完善


### express ###

实际上，express实际上就是一个mvc式的框架，利用express框架可以让我们快速的搭建web的开发工程目录(如自动创建存放javascript和css的文件夹等)而无需一个一个目录去手动创建，这可以很方便的搭建起项目，而把时间精力花费在实际代码当中，而不是花大量时间在构建项目工程目录当中。

>
>
grails 也是一个很不错的mvc框架，应用grails可以让你在不到一分钟的时间内，仅用一两条命令即可搭建起一个包含各种依赖目录的工程文件，可惜的是，这个框架实在是太小众了。
>

首先创建一个名为node_chat工程目录，然后又cmd进入到node_chat根目录。

    cd node_chat
    >node_chat

在node_chat根目录执行npm init命令，创建pakage.json配置文件

    >node_chat npm init

按照提示输入相应信息，

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_1.png" align="center"></p>
</center>
完成pakage.json初步配置
<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_2.png" align="center"></p>
</center>

在全局变量下载依赖包express：

    >node_chat npm install -g express

在工程根目录下载依赖包express并将依赖信息写入package.json:

    >node_chat npm install express -save

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_3.png" align="center"></p>
</center>

此时再看我们的package.json文件

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_4.png" align="center"></p>
</center>

自动添加了一条这样的信息：

    "dependencies": {
        "express": "^4.14.0"
    }

也即将我们应用的依赖信息写在了配置文件中，当我们以后发布这个应用的时候就不需要包依赖包(node_modules下的所有文件)一起发布，而只需要将package.json文件发布即可，但有人下载使用我们的应用时，nodejs会根据package.json配置信息自动下载所需的依赖包。


>
>
Tips：我们也可以在下载依赖包的时候不带 *-save*命令，而知使用诸如*npm install express*这样的命令，这样的命令依然会成功下载我们所需的依赖包，只是没有把依赖信息自动写入我们的配置文件package.json中而已，我们可以在后期将要发布应用时手动配置package.json文件的依赖信息即可。当然，这是在没有太多依赖包的时候时可以的，若是应用需要的依赖包很多，而我们去手动配置，那么，选择狗带吧！
>


### express应用生成器——express-generator ### 


利用express-generator，我们可以快速搭建项目工程文件：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_5.png" align="center"></p>
</center>

在茫茫的太空之中，极权只要三分钟，在express中，mvc只需要一行命令。

我们首先在全局中下载express-generator依赖包：

    node_chat>npm install -g express-generator

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_6.png" align="center"></p>
</center>

创建一个名为myapp的应用：

    node_chat>express myapp

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_7.png" align="center"></p>
</center>


这样，我们就在node_chat工程下创建了一个名为myapp的应用，并且，创建完应用的同时，还有信息提示我们：

    install dependencies:
        > cd myapp && npm install

    run the app:
        > SET DEBUG=myapp:* & npm start


第一条信息是提示我们下载依赖包以及怎样下载依赖包，我们看下我们的myapp应用目录下有个package.json配置文件，

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_8.png" align="center"></p>
</center>

是的，他告诉了我们需要的依赖包。所以我们按提示信息执行：

    node_chat>cd myapp
    myapp>npm install

*npm install*这条命令会把package.json中配置信息中的所有的依赖包下载下来。
我们在看下我们的myapp目录，刚开始创建的时候并没有node_modules这个文件夹，当我们执行*npm install*命令下载所需的模块后，这个文件夹才被创建，而且我们看到的是这个文件夹内所包含的包的数量正如package.json配置中的数量一样：

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_9.png" align="center"></p>
</center>


额...好像多了什么东西，是的，那个.bin是我之前执行了npm start后出来的。


    run the app:
        > SET DEBUG=myapp:* & npm start


<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_10.png" align="center"></p>
</center>

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_11.png" align="center"></p>
</center>

此命令即为启动myapp应用。ok！

启动后在浏览器上访问[localhost:3000](localhost:3000)页面，其所显示的内容其实就是在router/index.js上的内容渲染到views后所得到的。

当然，我们还可以使用python的supervisor应用管理器来启动我们的项目。

<center>
<p><img src="https://beyondouyuan.github.io/img/node_chat_12.png" align="center"></p>
</center>


这样我们就可以使用以下命令来启动我们的myapp应用了：

    myapp>node ./bin/www

没错，成功启动！

实际上，npm start和node ./bin/www是一样的，他们都是执行.bin/www
