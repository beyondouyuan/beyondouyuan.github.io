---
layout: post
title: React全家桶之后台管理系统（上）
author: beyondouyuan
date: 2017-08-11
categories: blog
tags: [React]
react: react
description: 一寸柔肠情几许？薄衾孤枕，梦回人静。侵晓潇潇雨。
---

###  写在前面 ###

重新学习React之React全家桶入门，通过构建一个简单的球员管理系统来学习React全家桶，从React组件基础，到React-Router路由管理到React-Redux数据流框架，并引入Ant-Design UI库，完成React全家桶的入门学习以及深入理解。

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



### 组件化表单

以上已完成添加球员的表单，当我们想为球员添加荣誉时，同样需要一个表单，如果再去写一个表单，那么久增加了工作量，组件化是我们的选择，组件化除了便于开发和维护外，另一个重要的特点是可以根据组件选择复用。要实现组件化，我们就需要将耦合在代码中的写死的定制化内容(如针对于球员输入的验证逻辑)抽离出来。

#### 高阶组件

所谓高阶组件即返回组件的组件或者函数。高阶组件可以在不修改原组件代码的情况下，修改源代码的行为或者功能。

一般的，我们的每一个组件只一件事情，组件的初始数据也应该由外部传入，而不再组件内部定制写死，组件内部只维护状态的更新。

一般在开发中，React组件分为另个类型，容器组件和具体的展示组件，容器组件负责提供初始数据以及公共方法，展示组件则只负责根据容器组件传入的数据以及方法来展示数据，展示组件作为容器组件的字组件，容器组件为父组件，父组件到子组件的数据传递方式通过this.props来实现，父子组件间的通信为单向数据流，即由父组件向字组件传递。

高阶组件即扮演容器组件的方法，我们将展示组件嵌套在容器组件，字组件所需要的数据存储在容器组件中，字组件通过过this.props读取想要的一切数据(包括基础数据，对象，数组，函数方法)：
    
    Parent.js
    import Child from './Component/Child'
    class Parent extends React.Compont {
        const name ="Ouyuan";
        const obj = {
            sex: male,
            age: 10
        };
        function handleChange() {
            // doSomething
        }
        return <Child name={name} obj={obj} change={handleChange} />
    }

    Child.js
    
    class Child extends React.Component {
        const myName = this.props.name;
        const obj = this.props.obj;
        handleSubmit(e) {
            e.preveStop();
            // do
            shit.setState({
                //...
            })
        }
        render() {
            return (
                <div>
                    <section>{name}</section>
                    <section>{obj.age}</section>
                    <input value={obj.sex} onChange={this.props.change}/>
                    <button onClick={this.handleSubmit}>提交</button>
                </div>
            )
        }
    }


以上，Parent是一个容器组件，Child是一个具体的展示组件，Child所需要的一切初始数据以及一些可抽离的方法，均由Parent容器组件提供，Child只需要通过this.props对象读取对应属性即可，如此，可是的Child组件只专注一节事情(展示数据或者其他的定制的事情)。以上中，change时间可能每一个被嵌套在容器组件中的子组件中都要用到，故而抽离出来当作公共方法放在容器组件中，传入到字组件再由组件去调用即可。而每个组件的提交的数据或者处理过程不一样，所以handleSubmit也可能不一样，所以handleSubmit一般写在子组件内部。


组件化我们管理系统的表单：在/src目录下新建utils目录，在utils下新建formProvider.jswe文件：


    function formProvider(fields) {
        return function(Component) {

            const initFormState = {};
            for (const key in fields) {
                initFormState[key] = {
                    value: fields[key].defaultValue,
                    error: ''
                };
            }

            class FormComponent extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        form: initFormState,
                        formValid: false
                    };
                    // 绑定this
                    this.handleChange = this.handleChange.bind(this);
                }
                handleChange(fieldName, value, type= "string") {
                    if (type === 'number') {
                        value = +value;
                    }
                    const { form } = this.state;

                    const newFieldState = { value, valid: true, error: '' };

                    const fieldRules = fields[fieldName].rules;

                    for (let i = 0; i < fieldRules.length; i++) {
                        const { pattern, error } = fieldRules[i];
                        let valid = false;
                        if (typeof pattern === 'function') {
                            valid = pattern(value);
                        } else {
                            valid = pattern.test(value);
                        }

                        if (!valid) {
                            newFieldState.valid = false;
                            newFieldState.error = error;
                            break;
                        }
                    }

                    const newForm = {...form, [fieldName]: newFieldState };
                    // const formValid = Object.values(newForm).every(f => f.valid);
                    // 遍历对象可枚举的属性
                    // 低版本浏览器不支持Object.values方法
                    const validArr = Object.keys(newForm).map((k) => newForm[k]);
                    const formValid = validArr.every(f => f.valid);
                    this.setState({
                        form: newForm,
                        formValid
                    });
                }
                // 渲染存入的子组件
                render() {
                    const { form, formValid } = this.state;
                    return <Component 
                        { ...this.props }
                        form = { form }
                        formValid = { formValid }
                        handleChange = { this.handleChange }
                    />
                }
            }
            // 返回父级组件
            return FormComponent;
        }
    }

    export default formProvider;


formProvider接收一个fields参数，并返回一个匿名函数，这个匿名函数接收一个组件作为参数并返回一个组件，所以它的用法是这样的。

PlayerAdd = formProvider(fields)(PlayerAdd);

第二个圆括号传入的参数是一个组件(PlayerAdd)，他将被formProvider函数返回的匿名函数接收并被渲染。PlayerAdd组件被匿名函数接收了，并被调用匿名函数中的FormComponent组件调用render方法渲染，也就是说PlayerAdd组件被FormComponent组件所包裹了(FormComponent嵌套了PlayerAdd)，PlayerAdd组件所需要到的初始数据以及可抽离的功用方法在FormComponent中定义。

以上FormComponrt中使用的展开运算符{ ...this.props }将会把当前组件中除了已经使用到的(form、formValid已经被使用)所有剩余属性(如剩余的name、age等)传递到子组件中。如此，则不需手动传递每一个属性以及防止重复传值，如：

    const list = {a: 1, b: 2, c: 3}

    <Todo {...list} />

等同于

    <Todo a={list.a} b={list.b} c={list.c} />

    {...this.props }
    form = { form }
    formValid = { formValid }
    handleChange = { this.handleChange }

相当于把form、formValid和handleChange合并之后通过props传到子组件中，当然也可以不合并直接传递这三个属性。

然后，我们就可将PalyerAdd组件中定制的数据以及可抽离的公用方法删除掉，只保留渲染组件，所需的数次数据均由外部世界提交(对于PlayerAdd而言，包裹了他的FormComponent组件即为外部世界)：

    import React from 'react';

    import formProvider from '../../utils/formProvider'


    class PlayerAdd extends React.Component {

        fetchData(url) {
            // 通过解构获取数据
            const {form: { name, age, team, size }, formValid } = this.props;
            if (!formValid) {
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
            // 结构出所需要的值
            const {form: { name, age, team, size }, handleChange} = this.props;
            return (
                <div>
                    <header>
                        <h1>添加球员</h1>
                    </header>
                    <main>
                        <form onSubmit={(event) => this.handleSubmit(event)}>
                            <div className="input-group">
                                <label>球员名字：</label>
                                <input type="text" placeholder="请输入球员名字..." value={name.value} onChange={(event) => handleChange('name', event.target.value)} />
                                {!name.valid && <span>{name.error}</span>}
                            </div>
                            <div className="input-group">
                                <label>球员年龄：</label>
                                <input type="number" placeholder="请输入球员年龄..." value={age.value || ''} onChange={(event) => handleChange('age', event.target.value, 'number')} />
                                {!age.valid && <span>{age.error}</span>}
                            </div>
                            <div className="input-group">
                                <label>效力球队：</label>
                                <input type="text" placeholder="请输入效力球队..." value={team.value}  onChange={(event) => handleChange('team', event.target.value)} />
                                {!team.valid && <span>{team.error}</span>}
                            </div>
                            <div className="input-group">
                                <label>球员身高：</label>
                                <input type="number" placeholder="请输入球员身高..." value={size.value || ''} onChange={(event) => handleChange('size', event.target.value, 'number')} />
                                {!size.valid && <span>{size.error}</span>}
                            </div>
                            <input type="submit" value="提交" />
                        </form>
                    </main>
                </div>
            );
        }
    }


    PlayerAdd = formProvider({
        name: {
            defaultValue: '',
            rules: [
                {
                    pattern: function(value) {
                        return value.length > 0
                    },
                    error: '请输入球员名字'
                },
                {
                    pattern: /^.{1,32}$/,
                    error: '用户名最多32个字符'
                }
            ]
        },
        age: {
            defaultValue: 0,
            rules: [
                {
                    pattern: function (value) {
                    return value >= 1 && value <= 100;
                    },
                    error: '请输入1~100的年龄'
                }
            ]
        },
        team: {
            defaultValue: '',
            rules: [
                {
                    pattern: function(value) {
                        return value.length > 0
                    },
                    error: '请输入球队名字'
                },
                {
                    pattern: /^.{1,32}$/,
                    error: '球队名最多32个字符'
                }
            ]
        },
        size: {
            defaultValue: 0,
            rules: [
                {
                    pattern: function (value) {
                    return value >= 100 && value <= 300;
                    },
                    error: '请输入100~300的身高'
                }
            ]
        }
    })(PlayerAdd);


    export default PlayerAdd;

我们将PlayerAdd传入formProvider初始化后再导出，当路由去渲染PlayerAdd组件时就是渲染已经被初始化了的PlayerAdd组件。


#### 组件拆分

组件拆分是一门艺术，合理的组件拆分可以分离出大部分的公用部分，有效提高开发效率，比如以上，我们将之后重用的表单组件，验证部分抽离到容器组件中去，后续添加球员荣誉数据是可以重用这个表单组件，只需要传入不同的验证参数即可。在展示组件中，以来有不少重复的部分：

每一.input-group包含一个label，一个输入的input，一个提示错误span，我们在重复的书写着这些东西，可以将这部分抽离出来封装为一个组件，然后再遍历渲染即可。

/Componets/目录下新建FormItem目录，在FormItem目录下新建FormItem.js：

    import React from 'react';

    class FormItem extends React.Component {
        render() {
            return(
                <div className="input-group">
                    <label>{this.props.label}</label>
                    {this.props.children}
                    {!this.props.valid && <span>{this.props.error}</span>}
                </div>
            )
        }
    }


    export default FormItem;


一般this.props对象内的每一个属性对应一个属性名，如想要获取传入的name数据则通过this.props.name获取，但是有一个例外，那就是this.props.children，该属性对应该组件内的内的所有子节点，使用{this.props.children}将会把该组件内的所有子节点自动全部展开。


PlayerAdd.js组件中引入FormItem组件，修改PlayerAdd组件：

    <form onSubmit={(event) => this.handleSubmit(event)}>
        <FormItem label="球员名字：" valid={name.valid} error={name.error}>
            <input type="text" placeholder="请输入球员名字..." value={name.value} onChange={(event) => handleChange('name', event.target.value)} />
        </FormItem>
        <FormItem label="球员年龄：" valid={age.valid} error={age.error}>
            <input type="number" placeholder="请输入球员年龄..." value={age.value || ''} onChange={(event) => handleChange('age', event.target.value, 'number')} />
        </FormItem>
        <FormItem label="情愿身高：" valid={team.valid} error={team.error}>
            <input type="text" placeholder="请输入效力球队..." value={team.value}  onChange={(event) => handleChange('team', event.target.value)} />
        </FormItem>
        <FormItem label="情愿身高：" valid={size.valid} error={size.error}>
            <input type="number" placeholder="请输入球员身高..." value={size.value || ''} onChange={(event) => handleChange('size', event.target.value, 'number')} />
        </FormItem>
        <input type="submit" value="提交" />
    </form>


### 渲染数据

我们需要将数据库的数据展现出来，创建一乐PlayerList.js文件


    import React from 'react';

    class PlayerList extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                PlayerList: []
            }
        }
        // 在组件怪家前请求数据，当然也可以在组件挂载完成后再请求数据
        componentWillMount() {
            this.fetchData('http://localhost:3000/players');
        }
        fetchData(url) {
            fetch(url)
                // 将返回数据json格式化
                .then(res => res.json())
                .then(res => {
                    // 将获取到的数据储存在state中，在组件内部进行维护
                    this.setState({
                        PlayerList: res
                    });
                });
        }
        render() {
            // 解构赋值提取数据
            const { PlayerList } = this.state;
            // 使用map方法将球员信息数据遍历并渲染到表格中
            return (
                <div>
                    <header>
                        <h1>球员信息</h1>
                    </header>
                    <main>
                        <table>
                            <thead>
                                <tr>
                                    <th>球员ID</th>
                                    <th>球员名字</th>
                                    <th>球员年龄</th>
                                    <th>效力球队</th>
                                    <th>球员身高</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*jsx中的JavaScript表单时使用花括号括住*/}
                                {
                                    PlayerList.map((player) => {
                                        return(
                                            <tr key={player.id}>
                                                <td>{player.id}</td>
                                                <td>{player.name}</td>
                                                <td>{player.age}</td>
                                                <td>{player.team}</td>
                                                <td>{player.size}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </main>
                </div>
            )
        }
    }


    export default PlayerList;


珠江中去获取数据时，我们可以选择在组件被挂载前，也可以在组件被挂载成功后的生命周期去获取数据。获取数据成功后，我们将得到的数据保存在组件内部的state中，因为后续可能会对组件进行操作更变数据，到时候就可以通过更改维护state来实现。返回的数据是一个数据，这可以使用map方法遍历出来并渲染到组件当中。JSX当中所有涉及到JavaScript表达式均需要包括在花括号中。

在index.js中添加球员列表的路由渲染出该组件页面，同时在Home.js组件中也添加到该组件的路由。此时访问[http://localhost:8000/player/list](http://localhost:8000/player/list)即可看到我们存储在数据库中的数据，如图7：

我们还可以在PlayerAdd.js组件中添加路由跳转，但添加球员信息成功后，使用react-router控制路由跳转到球员行李额列表页：

#### 布局组件

在我们的页面中，每一个组件都包含一个页面标题header标签和h1标签，同时内容部分包含在一个main标签中，这样子每个组件每次都需要重复写一遍，效率太低，我们可以将这两个公用部分抽离出来形成布局组件。

新建/Layouts目录，该目录下心境啊HomeLayout.js组件：


    import React from 'react';

    class HomeLayout extends React.Component {
        render() {
            const { title, children } = this.props;
            return (
                <div>
                    <header>
                        <h1>{title}</h1>
                    </header>
                    <main>
                        {children}
                    </main>
                </div>
            )
        }
    }


    export default HomeLayout;



在HomeLayout中使用props.title来维护页面的标题文本。使用props.children来渲染每个页面特有的内容部分。{props.children}将会自动展开我们的所有节点。
性爱Home.js试验一下：

    import React from 'react';
    import { Link } from 'react-router-dom';
    import HomeLayout from '../Layouts/HomeLayout';

    class Home extends React.Component {
        render() {
            return (
                <HomeLayout title="欢迎来到球员管理系统">
                    <div>
                        <Link to="/player/add">新增球员</Link>
                    </div>
                    <div>
                        <Link to="/player/list">球员信息</Link>
                    </div>
                </HomeLayout>
            );
        }
    }

    export default Home;

页面成功渲染，那么其他页面也可以做此调整重构。除了可以在每一个页面import HomeLayout组件外，也可以在路由中进行嵌套，则每一个需要使用到HomeLayoutde zujian都会在路由渲染时传入HomeLayout布局组件。

#### 编辑与删除

到现在为止，已完成读写操作，编辑与删除时针对已存在的数据进行的操作。修改PalyerList.js组件，增加编辑与删除按钮以及相对应的处理程序：


修改PlayerList.js组件，在表格中新增操作列，随后添加删除编辑处理程序handleDelete和handleEdit。


#### 删除

先易后难，首先解决删除功能，在修改PlayerList组件中添加handleDelete方法：

    handleDelete(player) {
        // 确认对话框
        const confirmed = confirm(`确定要删除球员 ${player.name} 吗？`);
        if (confirmed) {
                fetch('http://localhost:3000/players' + player.id, {
                method: 'delete'
            })
            .then(res => res.json())
            .then(res => {
                    this.setState({
                    PlayerList: this.state.PlayerList.filter(item => item.id !== player.id)
                });
                alert('删除球员成功！');
            })
            .catch(err => {
                console.error(err);
                alert('删除失败！')
            });
        }
    }

handleDelete和handleEdit方法将player对象作为参数传入，则这两个方法根据传入的player对象进行相应操作。


#### 编辑

一般地，编辑与添加基本上一致，不同的地方在于：

- 球员编辑需要将球员数据先填充到表单
- 球员编辑在提交时调用的接口和方法不同
- 页面辩题不同
- 页面路由不同

这么看来，我们完全可以讲PlayerAdd.js组件复制一份到一个新的页面中去形成一个新的PlayerEdit.js页面，然后修改一下页面标题，在路由页面添加相应路由到该页面，并且修改提交时候的接口与方法即可。

看上去是可行的，但是React的一大优势就是组件化，组件化的一大特点就是可复用性，倘若我们如此任性的酒新建一个几乎一致只有少许不同的地方的页面组件，那么我们何必再进行之前的组件话优化？甚至，我们何必选择React？

and so!

我们将会新增和编辑页面抽出来，将相同相似的部分抽成一个PlayerEditor.js组件。

- 升级原来的formProvider组件，使其返回的表单组件支持数据填充(编辑页面表单填充数据)
- 将PlayerAdd.js中大部分代码抽离到PlayerEditor.js中，通过传入不同的pros来控制组件的行为是增加还是编辑

修改formProvider组件：


    /*
     * @Author: Irving
     * @Date:   2017-08-12 17:01:43
     * @Last Modified by:   Irving
     * @Last Modified time: 2017-08-13 21:12:32
     */

    import React from 'react';

    function formProvider(fields) {
        /**
         * [description]
         * @param  {[type]} Component [description]
         * @return {[type]}           [description]
         */
        return function(Component) {
            const initFormState = {};
            for (const key in fields) {
                initFormState[key] = {
                    value: fields[key].defaultValue,
                    error: ''
                };
            }

            class FormComponent extends React.Component {
                // 在constructor中初始化数据以及绑定this
                constructor(props) {
                    super(props);
                    this.state = {
                        form: initFormState,
                        formValid: false
                    };
                    // 绑定this
                    this.handleChange = this.handleChange.bind(this);
                    this.setFormData = this.setFormData.bind(this);
                }
                setFormData(values) {
                    if (!values) {
                        return;
                    }
                    const { form } = this.state;
                    let newForm = {...form};
                    for(const field in form) {
                        if (form.hasOwnProperty(field)) {
                            if (typeof values[field] !== 'undefined') {
                                newForm[field] = {...newForm[field], value: values[field]};
                            }
                            newForm[field].valid = true;
                        }
                    }

                    this.setState({
                        form: newForm
                    });
                }
                handleChange(fieldName, value, type= "string") {
                    if (type === 'number') {
                        value = +value;
                    }
                    const { form } = this.state;

                    const newFieldState = { value, valid: true, error: '' };

                    const fieldRules = fields[fieldName].rules;

                    for (let i = 0; i < fieldRules.length; i++) {
                        const { pattern, error } = fieldRules[i];
                        let valid = false;
                        if (typeof pattern === 'function') {
                            valid = pattern(value);
                        } else {
                            valid = pattern.test(value);
                        }

                        if (!valid) {
                            newFieldState.valid = false;
                            newFieldState.error = error;
                            break;
                        }
                    }

                    const newForm = {...form, [fieldName]: newFieldState };
                    // const formValid = Object.values(newForm).every(f => f.valid);
                    // 遍历对象可枚举的属性
                    // 低版本浏览器不支持Object.values方法
                    const validArr = Object.keys(newForm).map((k) => newForm[k]);
                    const formValid = validArr.every(f => f.valid);
                    this.setState({
                        form: newForm,
                        formValid
                    });
                }
                // 渲染存入的子组件
                render() {
                    const { form, formValid } = this.state;
                    return <Component
                        {...this.props }
                        form = { form }
                        formValid = { formValid }
                        handleChange = { this.handleChange }
                        setFormData = { this.setFormData }
                    />
                }
            }
            // 返回父级组件
            return FormComponent;
        }
    }

    export default formProvider;

组件增加setFormData方法，用于填充表单数据。则在编辑球员数据时，即可在表单中读取原数据。

将PlayerAdd组件中的表单抽离到PlayerEditor组件中，表单即为编辑新增的公用部分，如此可达到组件复用的目的。


PlayerEditor.js:

    /*
    * @Author: Irving
    * @Date:   2017-08-13 21:13:24
    * @Last Modified by:   beyondouyuan
    * @Last Modified time: 2017-08-23 10:33:53
    */


    import React from 'react';

    import formProvider from '../../utils/formProvider';

    import FormItem from '../FormItem/FormItem';
    import HomeLayout from '../Layouts/HomeLayout';

    class PlayerEditor extends React.Component {

        componentWillMount () {
            const {editTarget, setFormData} = this.props;
            if (editTarget) {
                setFormData(editTarget);
            }
        }

        fetchData(url) {
            // 通过解构获取数据
            const {form: { name, age, team, size }, formValid, editTarget } = this.props;
            if (!formValid) {
                alert('请填写正确的信息后重试');
                return;
            }
            let editType = "添加";
            let apiUrl = url;
            let method = 'post';
            if (editTarget) {
                editType = "编辑";
                apiUrl += '/' + editTarget.id;
                method = 'put';
            }
            fetch(apiUrl, {
                method,
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
                    alert(editType + '球员成功！');
                    this.context.router.push('/player/list');
                } else {
                    alert(editType + '失败');
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
            const {form: { name, age, team, size }, handleChange} = this.props;
            return (
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <FormItem label="球员名字：" valid={name.valid} error={name.error}>
                        <input type="text" placeholder="请输入球员名字..." value={name.value} onChange={(event) => handleChange('name', event.target.value)} />
                    </FormItem>
                    <FormItem label="球员年龄：" valid={age.valid} error={age.error}>
                        <input type="number" placeholder="请输入球员年龄..." value={age.value || ''} onChange={(event) => handleChange('age', event.target.value, 'number')} />
                    </FormItem>
                    <FormItem label="效力球队：" valid={team.valid} error={team.error}>
                        <input type="text" placeholder="请输入效力球队..." value={team.value}  onChange={(event) => handleChange('team', event.target.value)} />
                    </FormItem>
                    <FormItem label="球员身高：" valid={size.valid} error={size.error}>
                        <input type="number" placeholder="请输入球员身高..." value={size.value || ''} onChange={(event) => handleChange('size', event.target.value, 'number')} />
                    </FormItem>
                    <input type="submit" value="提交" />
                </form>
            );
        }
    }

    // 必须给PlayerAdd义一个包含router属性的contextTypes
    // 使得组件中可以通过this.context.router来使用React Router提供的方法
    PlayerEditor.contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    PlayerEditor = formProvider({
        name: {
            defaultValue: '',
            rules: [
                {
                    pattern: function(value) {
                        return value.length > 0
                    },
                    error: '请输入球员名字'
                },
                {
                    pattern: /^.{1,32}$/,
                    error: '用户名最多32个字符'
                }
            ]
        },
        age: {
            defaultValue: 0,
            rules: [
                {
                    pattern: function (value) {
                    return value >= 1 && value <= 100;
                    },
                    error: '请输入1~100的年龄'
                }
            ]
        },
        team: {
            defaultValue: '',
            rules: [
                {
                    pattern: function(value) {
                        return value.length > 0
                    },
                    error: '请输入球队名字'
                },
                {
                    pattern: /^.{1,32}$/,
                    error: '球队名最多32个字符'
                }
            ]
        },
        size: {
            defaultValue: 0,
            rules: [
                {
                    pattern: function (value) {
                    return value >= 100 && value <= 300;
                    },
                    error: '请输入100~300的身高'
                }
            ]
        }
    })(PlayerEditor);


    export default PlayerEditor;

PlayerEditor.js组件在组件挂载前，接收了来自父组件props对象传入的editTarget属性，用于填充数据（编辑时填充、新增操作则不填充），同时在fetchData方法中也根据父组件中传入的editTarget属性来分别处理新增或者编辑的提交处理程序即handleSubmit，新增或者编辑提交数据时的方法不一样，路经也不完全一致（新增为post方法，而编辑则为put方法）。抽离出PlayerEditpr组件后，修改PlayerAdd组件如下：

    /*
    * @Author: Irving
    * @Date:   2017-08-11 18:30:44
    * @Last Modified by:   Irving
    * @Last Modified time: 2017-08-13 21:31:07
    * @PlayerAdd.js
    */

    import React from 'react';

    import HomeLayout from '../Layouts/HomeLayout';
    import PlayerEditor from './PlayerEditor'

    class PlayerAdd extends React.Component {
        render() {
            return (
                <HomeLayout title="添加球员">
                    <PlayerEditor />
                </HomeLayout>
            );
        }
    }
    export default PlayerAdd;


随后新增PlayerEditPage组件，作为编辑页面，同时在路由页面同样相应路由渲染此页面，PlayerEditPage如下：

    /*
    * @Author: Irving
    * @Date:   2017-08-13 22:49:38
    * @Last Modified by:   beyondouyuan
    * @Last Modified time: 2017-08-23 10:46:53
    * @PlayerEditPage
    */

    import React from 'react';
    import HomeLayout from '../Layouts/HomeLayout';
    import PlayerEditor from './PlayerEditor'

    class PlayerEditPage extends React.Component {
        /**
         * [constructor description]
         * @param  {[type]} props [description]
         * @return {[type]}       [description]
         */
        constructor(props) {
            super(props);
            this.state = {
                player: null
            };
        }
        componentWillMount() {
            const playerId = this.context.router.params.id;
            fetch('http://localhost:3000/players/' + playerId)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    player: res
                });
            });
        }

        render() {
            const { player } = this.state;
            return(
                <HomeLayout title="编辑球员">
                    {
                        player ? <PlayerEditor editTarget={player} /> : '加载中'
                    }
                </HomeLayout>
            )
        }
    }

    PlayerEditPage.contextTypes = {
        router: React.PropTypes.object.isRequired
    };


    export default PlayerEditPage;

PlayerEditPage页面传入editTarget到PlayerEditor组件，用于控制判断为编辑操作。编辑页面在组件渲染前填充表单数据(官方更推荐是在组件挂载之后再执行fetch数据的操作)。

到此，一切准备就绪，添加编辑处理程序，实际上，编辑操作不做数据的实际操作，只需在点击编辑按钮时，将页面路由跳转至编辑页面即可，随后在编辑页面中编辑数据，提交表单，ok！所以，编辑和新增几乎是一致的，只是做个路由跳转到编辑页面，在编辑页面加载时去fetch数据填充表单，然后提交表单，handleEdit如下:

    handleEdit(player) {
        /**
         * 路由跳转到编辑页面即可
         */
        this.context.router.push('/player/edit/' + player.id);

    }

测试一下，点击编辑按钮，页面跳转：

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_7.png" align="center"></p>
</center>


