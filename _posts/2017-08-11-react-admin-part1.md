---
layout: post
title: React全家桶之一
author: beyondouyuan
date: 2017-08-11
categories: blog
tags: [React]
react: react
description: 一寸柔肠情几许？薄衾孤枕，梦回人静。侵晓潇潇雨。
---

###  写在前面 ###

重新学习React之React全家桶入门，通过构建一个简单的球员管理系统来学习React全家桶。

## React全家桶入门

### 项目描述

通过简单的增删改查实现一个后台管理系统

- 对于并不复杂的项目应用暂且不考虑设计方案
- 增删改查只暂且做简单的操作实现过程

### 接口&&数据库

增删改查必定涉及到数据持久化以及数据交互，本项目展示不涉及数据库数据持久化以及数据交互的接口，借助json-server实现数据mock。json-server为我们提供了服务器的同时还为我们提供具有rest api风格的API接口。

### 全家桶 or 甜筒

React是一个轻型的MVVM前端框架，可以在不影响项目原有业务以及代码结构下无缝接入到现有项目，这就是React甜筒，但是使用React全家桶才可以更加清爽的体验到React的强大以及优秀的性能。

##### React全家桶

- React
- React-Router
- React-Redux
- React-Router-Redux
- Redux-Saga
- Immutable
- Reselect
- Antd-Design


### 构建项目

首先需要有项目工程结构。

#### 构建服务器端

使用json-server实现数据持久化以及接口请求的数据交互，
全局安装json-server

npm install json-server -g

##### 创建项目并进入项目

mkdir admin-manage && cd admin-manage

##### 初始化项目

npm init

##### 创建服务端目录

在根目录下新建server目录，用于放置服务器端文件，在server目录先新建db.json文件，作为服务器端的数据库文件。开始编写db.json，写入用于测试的数据：

    {
        "user": [
            {
                "id": 10000,
                "name": "勒布朗·詹姆斯",
                "age": 32,
                "gender": "male",
                "size": 203
            },
            {
                "id": 10001,
                "name": "凯利·欧文",
                "age": 25,
                "gender": "male",
                "size": 191
            },
            {
                "id": 10002,
                "name": "德韦恩·韦德",
                "age": 34,
                "gender": "male",
                "size": 193
            },
            {
                "id": 10003,
                "name": "科怀·伦纳得",
                "age": 25,
                "gender": "male",
                "size": 203
            },
            {
                "id": 10004,
                "name": "凯文·杜兰特",
                "age": 28,
                "gender": "male",
                "size": 208
            },
            {
                "id": 10005,
                "name": "史蒂芬·库里",
                "age": 29,
                "gender": "male",
                "size": 193
            },
            {
                "id": 10006,
                "name": "詹姆斯·哈登",
                "age": 27,
                "gender": "male",
                "size": 196
            },
            {
                "id": 10007,
                "name": "拉塞尔·维斯布鲁克",
                "age": 27,
                "gender": "male",
                "size": 193
            }
        ]
    }

在服务器目录server/下执行json-server db.json -w -p 3000命令，命令行窗口如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_1.png" align="center"></p>
</center>

json-server带三个参数，第一个db.json为json-server启动服务器数据模板，第二个-w即watch，监控db.json的更改，第三个即port，服务器监听的端口

我们成功启动了一个具有临时数据库的服务器，根据敞口提示，在浏览器窗口访问[http://localhost:3000](http://localhost:3000)即可进入启动服务器的首页，如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_2.png" align="center"></p>
</center>

访问[http://localhost:3000/players](http://localhost:3000/players)即可看到我们的json数据！如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_3.png" align="center"></p>
</center>

#### json-server如何工作

db.json文件中的数据是标准的JSON格式数据，该json中包含一个players数组和honer数组，通过这个介绍哦你文件告诉json-server，数据库需要一个players表和一个honor表，并且其里面的数据极为bd.json的对应数据，使用json-server启动数据库，其为开发者注册一些列标准的RESTFull风格的API接口路由，以players为例：

- GET/players 获取球员列表的接口
- GET/players/:id 获取单个球员的接口
- POST/players 新增球员的接口
- PUT/players/:id 更新球员的接口
- DELETE/players:id 删除球员的接口

在获取数据列表的接口中也可以追加参数参数，用来限定查询结果，如：

- 查询所有骑士球员：/players?team=骑士
- 查询年龄大于等于25且小于等于30的球员：/players?age_gte=25&age_lte=30

此外还可以限定分页、排序、匹配等查询方式。

#### 构建客户端

- npm install roadhog -g 全局安装roadhog，roadhog是一款强大的React项目搭建工具
- 根目录下新建/src目录，用于存放客户端开发源文件
- 根目录下新建/public目录，用于存放静态文件
- /src下新建index.js，index.js作为应用入口文件
- /public目录下新建index.html，index.html作为页面入口文件
- 执行npm install react react-dom react-router -S，安装react依赖

##### 应用入口
返回一个简单的React组件，用于展示一条简单的问候信息：

    import React from 'react';
    import ReactDOM from 'react-dom';

    ReactDOM.render((
        <div>Hello React</div>
    ), document.getElementById('root'));


##### 页面入口

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>React全家桶</title>
        <meta name="description" content="react全家桶入门">
        <meta name="keywords" content="react react-router">
    </head>

    <body>
        <div id="root"></div>
        <script src="/index.js"></script>
    </body>

    </html>

div#root为挂载React组件的根容器，index.js为打包后的文件。

命令行窗口返回项目根目录，首先启动json-server服务器：

    cd server && json-server db.json -w -p 3000

新开一个命令行窗口，进入项目根目录，执行roadhog来启动React应用：

    roadhog server

roadhog启动React应用后，其默认监听的端口是8000，启动后自动打开浏览器到http://localhost:8000，即可看到效果，命令行窗口如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_4.png" align="center"></p>
</center>

TIPS:此时我们并没有在项目中看到打包的index.js文件，这是因为roadhog server和webpack-dev-server一样，启动小型的服务器，打包的文件存在于内存当中。

至此，服务端和科幻段都已经跑动，但是每次启动应用都需要打开两个命令行窗口并分别输入两次很长的命令启动两个服务器，这样不便于开发，可以将这两个命令集成到pakage.json的script命令中，启动时采用npm xxx命令来启动。修改pakage.json文件：


    {
      "name": "admin-manage",
      "version": "1.0.0",
      "description": "use react buil admin manager",
      "main": "index.js",
      "scripts": {
        "server": "cd server && json-server db.json -w -p 3000",
        "dev": "roadhog server"
      },
      "keywords": [
        "react",
        "antd",
        "webpack"
      ],
      "author": "beyondouyuan",
      "license": "ISC",
      "dependencies": {
        "react": "^15.6.1",
        "react-dom": "^15.6.1",
        "react-router": "^4.1.2"
      }
    }


此后只需要在两个命令窗口的根目录分别执行以下命令：

- npm run server
- npm run dev

分别启动服务器和React应用即可。

到此时，以成功配置开发环境，以及一个mock数据的服务器，一个客户端React应用


### 增加基本的球员列表

到现在为止，应用只有一个简单的Hello,React问候语的页面，我们需要不同的页面来展示不同的信息，首先新建添加用的页面，一组件的形式编写。

/src目录下新建Components目录，Components目录下新建一个Players目录，Players目录下新建Add.js文件，随后开始变细Add.js：

    import React from 'react';

    class PlayerAdd extends React.Component {
        render() {
            return (
                <div>新增球员</div>
            )
        }
    }

    export default PlayerAdd;

React的render方法是一个纯函数，返回一个React渲染的组件。

#### 配置路由

创建的React逐渐需要通过路由才可访问到(相当于通过配置url去浏览一个页面)。

项目使用react-router-dom提供的路由组件来控制当前路由下想要渲染的组件，修在/src/index.js入口文件，在其中添加路由控制组件：

    import React from 'react';
    import ReactDOM from 'react-dom';
    // use react-router
    import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom';

    // use Components
    import PlayerAddComponent from './Components/Players/PlayerAdd';
    import HomeComponent from './Components/Players/Home';

    ReactDOM.render((
        <Router history={browserHistory}>
            <div>
                <Route exact path="/" component={HomeComponent} />
                <Route path="/player/add" component={PlayerAddComponent} />
            </div>
        </Router>
    ), document.getElementById('root'));

TIPS:react-router4.x已经被拆分为三个组件：react-router、react-router-dom和react-router-native，react-router提供核心的路由组件与函数，其余两个提供运行环境（浏览器与react-native）所需的特定组件，进行网站即运行在浏览器环境
的开发，应当安装react-router-dom，react-router-dom暴露出react-router中的对象与方法，所以实际上我们只需要安装react-router-dom。

且Router不再可以直接像一下这样：

    <Router history={history}>
        <Route path="/" component={PlayerAddComponent} />
        <Route path="/palyer/add" component={PlayerAddComponent} />
    </Router>

其会报错“A <Router> may have only one child element”，Router相当于一个普通的React组件，其职能有一个顶级容器，所以通过一个div元素来包裹住多个route

配置path="/"时， Route需添加参数exact，表明paht="/"是唯一的路径，否则之后配置的path="/player/add"渲染的组件将会是paht="/"和paht="/player/add"渲染两个组件相加的结果。

#### 新建主页

主页用于展示球员列表，在Players目录下新建Home.js文件，用于展示球员信息列表，并可以通过相应路由到达其他组件页面：

    import React from 'react';
    import { Link } from 'react-router';

    class Home extends React.Component {
        render() {
            return (
                <div>
                    <header>
                        <h1>欢迎来到球员管理系统</h1>
                    </header>

                    <main>
                        <Link to="/player/add">添加球员</Link>
                    </main>
                </div>
            );
        }
    }

    export default Home;

在入口文件中引入并渲染该组件，

### 新增球员逻辑

修改新增政球员页面，构建一个表单，用于增加球员，表单提交数据的字段与db.json中的数据一致。修改PlayerAdd.js页面：

    import React from 'react';

    class PlayerAdd extends React.Component {
        render() {
            return (
                <div>
                    <header>
                        <h1>添加球员</h1>
                    </header>
                    <main>
                        <form>
                            <div className="input-group">
                                <label>球员名字：</label>
                                <input type="text" placeholder="请输入球员名字..." />
                            </div>
                            <div className="input-group">
                                <label>球员年龄：</label>
                                <input type="number" placeholder="请输入球员年龄..." />
                            </div>
                            <div className="input-group">
                                <label>效力球队：</label>
                                <input type="text" placeholder="请输入效力球队..." />
                            </div>
                            <div className="input-group">
                                <label>球员身高：</label>
                                <input type="number" placeholder="请输入球员身高..." />
                            </div>
                            <input type="submit" value="提交" />
                        </form>
                    </main>
                </div>
            );
        }
    }

    export default PlayerAdd;


至此，页面准备就绪！

#### 获取表单值

React推荐使用单向数据流来控制数据，单向数据流可以非常清晰的港丽数据流向，想要获取React表单的输入值，需要为表单绑定它的value，然后通过监听的change事件来处理更新value值。对于组件内部的数据，我们一般通过state来维护，更新数据即更新state使用setState()方法来实现。

修改PlayerAdd.js页面如下


    import React from 'react';

    class PlayerAdd extends React.Component {
        // PlayerAdd组件实际上是React组件类的子类，
        // 调用React组件类的构造函数，且构造函数不能为空
        constructor() {
            // 在构造函数中调用super()初始化this，this不能出现在super之前
            super();
            // 初始化数据
            this.state = {
                name: "",
                age: 0,
                team: "",
                size: 0
            };
        }
        // 输入框change处理程序
        handleChange(field, value, type='string') {
            // 表单值默认为字符串类型，对于数值类型，可以使用隐式转换为数值类型
            if(type === 'number') {
                value = +value;
            }
            // 更新状态
            this.setState({
                [field]: value
            });
        }
        // 表单提交处理程序
        handleSubmit(event) {
            event.preventDefault();
            alert(JSON.stringify(this.state));
        }
        render() {
            // 结构出所需要的值
            const { name, age, team, size } = this.state;
            return (
                <div>
                    <header>
                        <h1>添加球员</h1>
                    </header>
                    <main>
                        <form onSubmit={(event) => this.handleSubmit(event)}>
                            <div className="input-group">
                                <label>球员名字：</label>
                                <input type="text" value={name} placeholder="请输入球员名字..." onChange={(event) => this.handleChange('name', event.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>球员年龄：</label>
                                <input type="number" placeholder="请输入球员年龄..." value={age} placeholder="请输入球员名字..." onChange={(event) => this.handleChange('age', event.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>效力球队：</label>
                                <input type="text" placeholder="请输入效力球队..." value={team} placeholder="请输入球员名字..." onChange={(event) => this.handleChange('team', event.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>球员身高：</label>
                                <input type="number" placeholder="请输入球员身高..." value={size} placeholder="请输入球员名字..." onChange={(event) => this.handleChange('size', event.target.value)} />
                            </div>
                            <input type="submit" value="提交" />
                        </form>
                    </main>
                </div>
            );
        }
    }

    export default PlayerAdd;

但React组件是使用ES6的class进行声明时，this并没有被自动绑定，所以当我们想要使用this关键字时，一般在构造函数constructor中调用super()方法来初始化this。单门向使用this。props来读取组件属性，构造函数的写法为：
    
    constructor(props) {
        super(props)
    }

super()方法必须接受参数，否则报错。


在表单中输入数据，点击提交按钮会弹出我们所输入的主句，如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_5.png" align="center"></p>
</center>

则已经成功拿取到数据。


#### 调用接口提交数据创建

调用接口可以使用很多方法：Ajax请求、默认表单提交、fetch请求。直接的表单提交会发生页面跳转，fecth相比于Ajax更加顺畅，选择fetch方式来调用接口：

    import React from 'react';

    class PlayerAdd extends React.Component {
        // PlayerAdd组件实际上是React组件类的子类，
        // 调用React组件类的构造函数，且构造函数不能为空
        constructor() {
            // 在构造函数中调用super()初始化this，this不能出现在super之前
            super();
            // 初始化数据
            this.state = {
                name: '',
                age: 0,
                team: '',
                size: 0
            };
        }
        // 输入框change处理程序
        handleChange(field, value, type='string') {
            // 表单值默认为字符串类型，对于数值类型，可以使用隐式转换为数值类型
            if(type === 'number') {
                value = +value;
            }
            // 更新状态
            this.setState({
                [field]: value
            });
        }
        // 封装请求函数
        fetchData(url) {
            // 通过解构获取数据
            const { name, age, team, size } = this.state;
            fetch(url, {
                method: 'post',
                // fetch方法提交的json需要使用JSON.stringify方法转换为字符串
                // 请求体
                body:JSON.stringify({
                    name,
                    age,
                    team,
                    size
                }),
                // 请求头
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // 回调函数
            .then((res) => res.json())
            .then((res) => {
                // 当添加成功，返回的sjon对象中应包含一个有效的id字段
                // 因而可以使用res.id来判断是否添加成功
                if(res.id) {
                    alert('添加球员成功！');
                    // 更新状态，提交成功后表单清空
                    this.setState({
                        name: "",
                        age: 0,
                        team: "",
                        size: 0
                    });
                } else {
                    alert('添加失败');
                }
            })
            // 捕捉错误
            .catch((err) => {
                console.error(err);
            });
        }
        // 表单提交处理程序
        handleSubmit(event) {
            event.preventDefault();
            this.fetchData('http://localhost:3000/players');
        }
        render() {
            // 结构出所需要的值
            const { name, age, team, size } = this.state;
            return (
                <div>
                    <header>
                        <h1>添加球员</h1>
                    </header>
                    <main>
                        <form onSubmit={(event) => this.handleSubmit(event)}>
                            <div className="input-group">
                                <label>球员名字：</label>
                                <input type="text" placeholder="请输入球员名字..." value={name} onChange={(event) => this.handleChange('name', event.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>球员年龄：</label>
                                <input type="number" placeholder="请输入球员年龄..." value={age || ''} onChange={(event) => this.handleChange('age', event.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>效力球队：</label>
                                <input type="text" placeholder="请输入效力球队..." value={team}  onChange={(event) => this.handleChange('team', event.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>球员身高：</label>
                                <input type="number" placeholder="请输入球员身高..." value={size || ''} onChange={(event) => this.handleChange('size', event.target.value)} />
                            </div>
                            <input type="submit" value="提交" />
                        </form>
                    </main>
                </div>
            );
        }
    }

    export default PlayerAdd;

将原本在handleSubmit()处理程序中提交数据的代码封装为一个fetchDate()函数，当表单提交时调用这个函数即可。

输入数据点击提交，浏览器弹出提交成功提示信息，如图：

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_6.png" align="center"></p>
</center>

查看db.json，已经插入了刚才添加的球员数据！



#### 验证

以上，一时鲜球员添加，但是，还存在一些问题：

- 名字任意长
- 年龄为任意值
- 值可以为空

对于开发者来说，我们不能盲目相信用户输入的信息，可能有恶意造假，甚至用户不知道如何处理，因而我们需要对表单的输入做一定的限制，即进行表单验证。

合理良好的表单验证可以提高产品的用户体验与友好度，一般的表单验证主要为数据有效性验证、非空验证、验证失败的友好提示，发生错误则阻止表单提交。

进行验证时，记录每一个需要验证字段的当前有效状态，该字段的输入数据有效，则不提示信息，无效则显示提示信息，对于输入数据的验证一般在表单值发生改变时进行验证。


修改state的结构，把每个表单的值都放到了一个form字段中，方便统一管理；然后每个表单的值都变为了一个包含valid和value还有error字段的对象，valid表示该值的有效状态，value表示该表单具体的值，error表示错误提示信息，在输入框值改变时进行验证，验证出错则提示错误信息，验证成功则更新状态：


    import React from 'react';

    class PlayerAdd extends React.Component {
        // PlayerAdd组件实际上是React组件类的子类，
        // 调用React组件类的构造函数，且构造函数不能为空
        constructor() {
            // 在构造函数中调用super()初始化this，this不能出现在super之前
            super();
            this.state = {
                form: {
                    name: {
                        valid: false,
                        value: '',
                        error: ''
                    },
                    age: {
                        valid: false,
                        value: 0,
                        error: ''
                    },
                    team: {
                        valid: false,
                        value: '',
                        error: ''
                    },
                    size: {
                        valid: false,
                        value: 0,
                        error: ''
                    }
                }
            };
        }
        // 输入框change处理程序
        handleChange(field, value, type='string') {
            // 表单值默认为字符串类型，对于数值类型，可以使用隐式转换为数值类型
            if(type === 'number') {
                value = +value;
            }
            const { form } = this.state;
            const newField = { value, valid: true, error: '' };
            switch(field) {
                case 'name': {
                    if (value.length >= 32) {
                        newField.error = '球员名字最长为32位';
                        newField.valid = false;
                    } else if (value.length === 0) {
                        newField.error = '请输入球员名字';
                        newField.valid = false;
                    }
                    break;
                }
                case 'age': {
                    if (value >= 100) {
                        newField.error = '请输入正确的年龄';
                        newField.valid = false;
                    } else if (value < 0) {
                        newField.error = '请输入正确的年龄';
                        newField.valid = false;
                    }
                    break;
                }
                case 'team': {
                    if (value.length >= 32) {
                        newField.error = '球队名字最长为32位';
                        newField.valid = false;
                    } else if (value.length === 0) {
                        newField.error = '请输入球队名字';
                        newField.valid = false;
                    }
                    break;
                }
                case 'size': {
                    if (value >= 300) {
                        newField.error = '身高不能超过300cm';
                        newField.valid = false;
                    }
                    break;
                }
            }
            this.setState({
                form: {
                    ...form,
                    [field]: newField
                }
            });
        }
        fetchData(url) {
            // 通过解构获取数据
            const {form: { name, age, team, size }} = this.state;
            if (!name.valid || !age.valid || !team.valid || !size.valid) {
                alert('请填写正确的信息后重试');
                return;
            }
            fetch(url, {
                method: 'post',
                // fetch方法提交的json需要使用JSON.stringify方法转换为字符串
                // 请求体
                body:JSON.stringify({
                    name: name.value,
                    age: age.value,
                    team: team.value,
                    size: size.value
                }),
                // 请求头
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // 回调函数
            .then((res) => res.json())
            .then((res) => {
                // 当添加成功，返回的sjon对象中应包含一个有效的id字段
                // 因而可以使用res.id来判断是否添加成功
                if(res.id) {
                    alert('恭喜！添加球员成功！');
                } else {
                    alert('添加失败');
                }
            })
            // 捕捉错误
            .catch((err) => {
                console.error(err);
            });
        }
        // 表单提交处理程序
        handleSubmit(event) {
            event.preventDefault();
            this.fetchData('http://localhost:3000/players');
        }
        render() {
            // 解构出所需要的值
            const {form: { name, age, team, size }} = this.state;
            return (
                <div>
                    <header>
                        <h1>添加球员</h1>
                    </header>
                    <main>
                        <form onSubmit={(event) => this.handleSubmit(event)}>
                            <div className="input-group">
                                <label>球员名字：</label>
                                <input type="text" placeholder="请输入球员名字..." value={name.value} onChange={(event) => this.handleChange('name', event.target.value)} />
                                {!name.valid && <span>{name.error}</span>}
                            </div>
                            <div className="input-group">
                                <label>球员年龄：</label>
                                <input type="number" placeholder="请输入球员年龄..." value={age.value || ''} onChange={(event) => this.handleChange('age', event.target.value, 'number')} />
                                {!age.valid && <span>{age.error}</span>}
                            </div>
                            <div className="input-group">
                                <label>效力球队：</label>
                                <input type="text" placeholder="请输入效力球队..." value={team.value}  onChange={(event) => this.handleChange('team', event.target.value)} />
                                {!team.valid && <span>{team.error}</span>}
                            </div>
                            <div className="input-group">
                                <label>球员身高：</label>
                                <input type="number" placeholder="请输入球员身高..." value={size.value || ''} onChange={(event) => this.handleChange('size', event.target.value, 'number')} />
                                {!size.valid && <span>{size.error}</span>}
                            </div>
                            <input type="submit" value="提交" />
                        </form>
                    </main>
                </div>
            );
        }
    }

    export default PlayerAdd;


解构：

左右两边结构相同，提取出右边对应数据并赋值给左边。

以下，ES6对象的解构，将会从右边的this.state中提取出与左边form同名的对象。

    const { form } = this.state;

而：
    const {form: { name, age, team, size }} = this.state;

将会从右边的this.state中提取出name,age,team,size等对象。

TIPS：数组的解构基于位置信息解构，对象是无序的，其基于属性名以及结构进行提取，也即相当于一种模式匹配。

#### 对象展开运算符

使用展开运算符可以快速操作对象

    newState = {...oldState}

oldState对象将会自动展开，其对应的属性会被映射到newState队形属性中
##### 合并对象

    let a={x:1,y:2};
    let b={z:3};
    let ab={...a,...b};
    ab //{x:1,y:2,z:3}

则：

    this.setState({
        form: {
            ...form,
            [field]: newField
        }
    });

为将form对象和filed两者合并更新状态中的form对象。
