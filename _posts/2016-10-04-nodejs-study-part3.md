---
layout: post
title: NodeJs初成长(二)之七天学会nodejs(2)
author: beyondouyuan
date: 2016-10-04
categories: blog
tags: [NodeJs,七天学会nodejs]
node: node
description: 春日游，杏花吹满头。陌上谁家年少，足风流？妾拟将身嫁与，一生休。纵被无情弃，不能羞。
---

###  写在前面 ###

对于开发者来说，怎样去构建项目工程的目录是一件极为重要的事情，一个良好的工程目录可以让开发者将更多的时间精力放在实际的业务代码上，而不是更多的去考虑怎样处理文件之间的关系，这样可以极大的开发效率。

对于我个人而言，公司使用的开发框架是grails，当你首次创建工程时，框架会自动为你分配好各类文件目录，当需要调用某个目录下的文件时，只需要按照一定的语法方式进行调用，而无需考虑调用文件与被调用文件之间的路径关系，如此，则可以省却很多与开发无关的事情。

##  第二天 代码的组织与部署 ##


使用NodeJS编写程序前，为了有个良好的开端，首先需要准备好代码的目录结构和部署方式，就如同修房子要先搭脚手架。


### 模块路径解析规则 ###


require函数支持斜杠(/)或盘符(C:)开头的绝对路径，也支持(./)开头的相对路径。但这两种路径在模块之间建立了强耦合关系，一旦某个模块文件的存放位置需要变更，使用该模块的其它模块的代码也需要跟着调整，变得牵一发动全身。因此，require函数支持第三种形式的路径，写法类似于foo/bar，并依次按照以下规则解析路径， 直到找到模块位置。


 &&1 内置模块

若传递给require函数的是NodeJS的内置模块名称，则不做路径解析，直接返回内部模块的导出对象，例如：require('fs')，

 &&2 node_module目录

NodeJS定义了一个特殊的node_module目录用于存放模块，例如某个模块你的绝对路径是/home/user/hello.js，在该模块中使用require('foo/bar')方式加载模块是，则NodeJS一次尝试使用以下路径：

	/home/user/node_module/foo/bar
	/home/node_module/foo/bar
	/node_module/foo/bar


 &&3 NODE_PATH环境变量

与PATH环境变量类似，NodeJS允许通过NODE_PATH环境变量来制定额外的模块路径。NODE_PATH环境变量中包含一到多个目录路径，路径之间在Linux下使用:(冒号)分隔，在Windows下使用；(逗号)分隔。例如定义了一下的NODE_PATH环境变量：

	NODE_PATH=/home/user/lib:/home/lib


当使用require('foo/bar')的方式加载模块时，则NodeJS依次尝试以下路径：

	/home/user/lib/foo/bar
	/home/lib/foo/bar

### 包(package) ###

JS模块的基本单位是单个的js文件，而一些复杂的模块通常由许多子模块组成。为了便于管理以及使用，可以把由许多子模块组成的大模块称为“包”，并把所有子模块放在同一个目录里。

组成一个包的所有子模块中，需要有一个入口模块，入口模块的导出对象被作为包的导出对象，如下目录结构：

	- /home/user/lib/
		- cat/
			- head.js
			- body.js
			- main.js

(cat即为一个包)
cat目录定义了一个包，其中包含三个子模块，main.js作为入口模块，其内容如下：


	var head = require('./head');
	var body = require('./body');
	exports.create = function (name) {
		return {
			name: name,
			head: head.create(),
			body: body.create()
		};
	};


在其它模块里使用包的时候，需要加载包的入口模块，使用require('/home/user/lib/cat/main')能到达目的，但是入口模块名称出现在路径里不是很好，因此需要做些额外的工作，让包用起来像个单模块(就像是一个不包含子模块的模块)。


 &&1 index.js

当模块的文件名是index.js，加载模块是可以使用模块所在的目录的路径代替模块文件文件路径(如html中以index.html作为默认主页，访问主页是可以不输入主页文件名称，http://www.beyondouyuan.com与http://www.beyondouyuan.com/index.html等价)，因此，接上(以下两条语句等价)：

	var cat = require('/home/user/lib/cat/index');
	var cat = require('/home/user/lib/cat');

这样处理后，就只需要把包目录路径传递给require函数，cat包就像是一个单模块。


 &&2 package.json

如果想自定义入口模块的文件名和存放位置，就需要在包目录下包含一个package.json文件，并在其中指定入口模块的路径。以上例cat模块重构如下：

	- /home/user/lib/
		- cat/
			- + doc/
			- lib/
				- head.js
				- body.js
				- main.js
			- + tests/
			- package.json

其中package.json内容如下：

	{
	"name":"cat",
	"main":"./lib/main.js"
	}


如此一来，就同样可以使用require('/home/user/lib/cat')等方式加载模块，NodeJS会根据包陌路下的package.json找到入口模块的位置(如此可以不需要将main.js改为index.js也可以使用require('/home/user/lib/cat')方式加载包而不需要出现入口模块文件名了)。


### 命令行程序 ###

所有使用NodeJS编写的东西，要么是一个包，要么是一个命令行程序，而前者最终也会用于开发后者。因此在部署代码需要一些技巧，让用户觉得自己是在使用命令行程序。

例如使用NodeJS编写了个程序，可以把命令行参数原样打印出来。该程序很简单，在主模块内实现了所有功能(通过主模块调度组成整个程序的所有子模块)。写好后，把该程序部署在/home/user/bin/node-echo.js这个位置。为了在任何目录下都能运行此程序，则需要使用以下终端命令：


	$ node /home/user/bin/node-echo.js Hello World
	Hello World

然而此种方式并不像是一个命令行程序，以下才是所期望的方式：

	$ node-echo Hello World


### Linux ###

在Linux系统下，可以把JS文件当作shell脚本运行，从而道道上述目的，步骤如下：

1.在shell脚本中，可以通过#!注释来制定当前脚本使用的解析器，所以首先在node-echo.js文件顶部增加以下一行注释，表明当前脚本使用NodeJS解释。

	#! /user/bin/env node

2.然后,使用以下命令赋予node-echo.js文件执行权限，

	$ chmod - +x /home/user/bin/node-echo.js

3.最后，在PATH环境变量中指定的某个目录下，例如/user/local/bin下创建一个软链文件，文件名与希望使用的终端命令同名，命令如下：

	$ sudo in -s /home/user/bin/node-echo.js /user/local/bin/node-echo

这样处理后，就可以在任何目录下使用node-echo命令了。


### Windows ###


在Windows下，得靠.cmd文件来解决问题。假设node-echo.js文件放在C:\Users\user\bin目录，并且该目录已经添加到PATH环境变量里。接下来需要在该目录下创建一个名为node-echo.cmd的文件，文件内容如下：

	@node "C:\User\user\bin\node-echo.js" %*

如此则可在任何目录下使用node-echo命令。


### 工程目录 ###

以编写一个命令行程序为例，一般同时提供命令行模式和API模式两种使用方式，并且会借助三方包来编写代码，除代码外，一个完整的程序应该有自己的文档和测试用例。因此，一个标准的工程目录都看起来像下边这样：

	- home/user/workspace/node-echo/          # 工程目录
	 	- bin/								  # 存放命令行相关代码
	 		- node-echo
		- + doc/							  # 存放文档
		- lib/								  # 存放API相关代买
			- echo.js
		- node-modules/						  # 存放三方包
			- + argv/
		- + tests/							  # 存放测试用例
		- package.json                        # 元数据文件
		- README							  # 说明文档

其中部分文件内容如此啊：


	/* bin/node-echo */
	var argv = require('argv'),
		echo = require('../lib/echo');
	console.log(echo(argv.join(' ')));


	/* lib/echo.js */

	module.exports = function(message){
		return message;
	}

	/* package.json */

	{
		"name":"node-echo",
		"main":"./lib/echo.js"
	}

以上例子中分离存放了不同类型的文件，并通过node_modules目录直接使用三方包名加载模块，此外，定义package.json后，node-echo目录也可被当作一个包来使用。


### NPM ###

NPM是随同NodeJS一起安装的包管理工具，能觉解NodeJS代码部署上的许多问题，常见使用场景有以下几种：

1.允许用户从NPM服务器下载别人编写的三方包到本地使用。

2.允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用。

3.允许用户将自己编写的包或者命令行程序上传到NPM服务器供别人使用。

NPM建立了一个NodeJS生态圈，NodeJS开发者和用户可在里面互通有无。


### 下载三方包 ###

需要使用三方包时，首先需要知道有哪些包可用，需然[npmjs.org](https://npmjs.org/)提供了搜索框可以根据包名进行搜索，但如果想使用的三方包的名字不确定，则只能[Google](https://www.google.com)了。知道包名后，如argv，就可以在工程目录下打开终端，使用命令行下载三方包。

	$ npm install argv
	/* 以下为终端上的显示信息 */
	...
	argv@0.0.2 node_modules\argv

下载好之后，argv包就放在了工程目录下的node_modules目录中，因此代码中只需要通过require('argv')的方式即可，无需指定三方包路径。

以上命令默认下载最新版三方包，若想下载制定版本，则可在包名边上加@version，如通过命令下载0.0.1版的argv：

	$ npm install argv@0.0.1
	...
	argv@0.0.1 node_modules\argv


若是用到的三方包较多，在终端下一个包一条命令地安装则太过于麻烦了。因此NPM对package.json的字段做了扩展，允许在其中申明三方包依赖，因此，以上的例子中package.json可改写如下：

	{
		"name":"node-echo",
		"main":"./lib/echo.js",
		"dependencies":{
			"argv":"0.0.2"
		}
	}

如此处理后，在工程目录下就可以使用nmp install命令批量安装三方包了，更重要的是，当以后node-echo也上传到NPM服务器，别人下载这个包时，NPM会根据包中申明的三方包依赖自动下载进一步依赖的三方包。以使用npm install node-echo命令为例，NPM会自动创建以下目录结构

	- project/
		- node-modules/
			- node-echo/
				- node-modules/
					- + argv/
				- ...
		- ...

如此，则用户只需关心自己直接使用的三方包，不需要自己去解决所有包的依赖关系。


### 安装命令行程序 ###

从NPM服务ishang下载安装命令行的方法与三方包相似，例如以上例子的node-echo提供了命令行使用方式，只要node-echo自己配置好了相关的package.json字段，对于用户而言，只需要使用以下命令安装程序。

	$ npm install node-echo -g

-g表示全局安装，因此node-echo会默认安装到以下位置，并且NPM会自动创建好Linux系统下需要的软链文件或者Windows系统下的.cmd文件。

	- /user/local/						# Linux系统下
		- lib/node-modules/
			- + node-echo/
			- ...
		- bin/
			- node-echo
			- ...
		- ...



	- %APPDATA%\npm\					# Windows系统下
		- node-modules\
			- + node-echo\
			- ...
		- node-echo.cmd
		- ...


### 发布代码 ###


第一次使用NPM发布代码前需要注册一个帐号。终端下运行npm adduser，之后按照提示做即可，帐号注册号后，紧接着需要编辑package.json文件，加入NPM必须的字段，以上node-echo为例子，package.json里必要的字段如下：

	{
		"name":"node-echo",					# 包名
		"version":"1.0.0",					# 当前版本号
		"dependencies": {					# 三方包依赖，需要制定包名和保本号码
			"argv":"0.0.2"
		},
		"main":"./lib/echo.js",				# 入口模块位置
		"bin":{
			"node-echo":"./bin/node-echo"	# 命令行程序名和主模块位置
		}
	}

之后，就可以在package.json所在目录运行npm publish发布代码了。


### 版本号 ###


使用NPM下载和发布代码都会接触到版本号，NPM使用语意版本号来管理代码，语意版本号分为x.y.z三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按一下原则更新。

- + 如果只是修复bug，需要更新z位。

- + 如果是新增了功能，但是向下兼容，需要跟新y位。

- + 如果有大变动，向下不兼容，需要更新x位。


版本号有此语意性的保证后，在申明三方包依赖时，除了可依赖于一个固定版本号外，还可依赖于摸个范围的版本号，例如"argv":"0.0.x"表示依赖于0.0.x系列的最新版本argv。


### 抖机灵 气得我手发抖 ###


NPM提供了许多功能，package.json里也有许多有用的字段。


NPM常用命令：

- install

- publish

- npm help 可查看所有命令

- npm help command 可查看某条命令的详细帮助，例如npm help install。

- package.json 所在目录下使用npm install .-g可先在本地安装当前命令程序，可用于发布前的本地测试

- 使用 npm update [package] 可以把当前目录下的node-modules子目录里边的对应模块更新至最新版本。

- 使用 npm cache clear 可以清空NPM本地缓存，用于对付使用相同版本号发布的新版代码

- 使用 npm unpublish package @ version 可以撤销发布自己发布过的某个版本代码。


### 小结 ###

使用NodeJS编写代码前需要做的准备工作，总结有几下几点

- 编写代码前先规划好目录结构。

- 稍大的程序可以将代码拆分为多个模块管理，更大些的程序可以使用包来组织。

- 合理使用node_modules和NODE_PATH来解耦包的使用方式和物理路径。

- 使用NPM加入NodeJS生态圈互通有无。

- 想到了喜欢的包名时及时在NPM上抢注。


day2 complete

以上。