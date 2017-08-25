---
layout: post
title: React全家桶之后台管理系统（中）
author: beyondouyuan
date: 2017-08-15
categories: blog
tags: [React]
react: react
description: 一寸柔肠情几许？薄衾孤枕，梦回人静。侵晓潇潇雨。
---

###  写在前面 ###

上一篇，初步的增删改查功能已完成！

### 关联

我们只是完成了一个简单的球员数据录入，然后，这也太单调了一些，一个球员本身不可能是一个单一的球员，总还有点相关性的--比如，荣誉。

每一个球员都会去到各自的荣誉，我们在db.json中也有一个honor对象，它应当与球员一一对应。我们需要将两者关联起来。我们可以使用owner_id将两者关联起来（数据模型设计得并不是很好，一版来说，不应该是所属owner而应该是标签tag，他们是一对多的关系）。

### 构建组件

球员荣誉与球员信息的管理方式如出一辙，也就是说，他们的组件也是高度相似甚至是可以重用的，在此处，暂时不再乎组件重用，将Players目录下的组件复制一份到Honor目录下，随后修改对应的字段以及路由和url等参数即可。所有参数修改后，到相应路由可以看到我们想要的效果！

这样就行了么？！以上提到过，一个球员除了基本信息，还要有相关信息，就如我们平时浏览新闻的时候可以看到新闻的归属活着类别标签，我们这里也有这么个关系，这些个荣誉活着新闻是属于哪一个球员呢？

我们当然可以在输入荣誉的时候输入关联标签或者所属id，但是，这是一个一对多的关系，一个球员可能有多个标签，或者说，虽然只关联一个id，但是，这个id太长，不宜于输入，所以。。。怎么办？是的，没错，提供一个下拉列表！搞定！这是我们以往的做法，提供一个原生的下拉标签，提供选项。

在React中，我们可以不必如此古板，我们只需要提供一个列表---不一定就是下拉列表selecte，我们完全可以用一个无序列表提供这样的功能，我们只需要再给这个无序列表的li添加相应的选择事件的监听处理程序即可。

我们将这个下拉列表命名为AutoComplete组件，意为根据输入的id进行譬如id_linke这样的模糊搜索，也即是党我们输入一个id时，发起一个请求，请求路径为http://localhost:3000/player?id_like=xxx这样的类型，请求得到的数组渲染在这个模拟下拉列表中，即相当于实现模糊搜索亦或事自动完成的功能。



将这个自动完成或者模拟搜索抽离成为一个组件，这个组件包括一个输入框用于用户输入，以及一个列表，用于渲染选择列表，选择列表的数据根据输入的值进行id_like模拟请求数据得到。


### 组件划分

通常的，当我们想写一个组件的时候，首先需要思考以下几个问题：

- 组件的结构该是怎样的
- 组件的逻辑是怎样的
- 是否需要有内部状态，有内部状态则使用class组件，组件的状态由组件自身维护。无则使用函数组件或者纯组件。
- 组件需要暴露那些接口给外界，即可通过props对象所暴露的属性有哪些


综上，可以首先确定我们的组件是一个输入框和一个无序列表：

    <div>
        <input type="" name="" />
        <ul>
            <li></li>
        </ul>
    </div>

思考我们组件的逻辑：

- input未输入时，就是一个普通的输入框
- input输入时，值改变，若根据输入的值可以模糊请求到数据，则将得到的数据渲染ul中
- 无序列表监听键盘方向键，以及点击事件，鼠标以及键盘移动，相应li变为激活项，鼠标点击相应项，则input的值编委该项的值


### 组件内部状态

组件通过state对象来维护内部状态，通常使用setState方法来更新state对象。默认情况下，state改变组件树会重新调用render方法渲染组件，但是，我们可以在componentShouldUpdate周期控制返回值来控制是否重新渲染组件。

### 组件实现

AutoComplete.js组件如下：


    /*
    * @Author: beyondouyuan
    * @Date:   2017-08-23 11:31:15
    * @Last Modified by:   beyondouyuan
    * @Last Modified time: 2017-08-23 15:06:52
    */

    import React from 'react';

    import { PropTypes } from 'react';

    import style from '../../styles/auto-complete.less'

    function getItemValue(item) {
        return item.value || item;
    }

    class AutoComplete extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                displayValue: '',
                activeIndex: -1
            };
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.handleLeave = this.handleLeave.bind(this);
        }
        // 输入处理程序
        handleChange(value) {
            this.setState({
                activeIndex: -1,
                displayValue: ''
            });
            this.props.handleChange(value);
        }
        handleKeyDown(event) {
            const { activeIndex } = this.state;
            const { options } = this.props;

            switch (event.keyCode) {
                // 回撤
                case 13: {
                    if (activeIndex >= 0) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.handleChange(getItemValue(options[activeIndex]))
                    }
                    break;
                }
                // 上下方向
                case 30:
                case 40: {
                    event.preventDefault();
                    this.updateItem(event.code === '30' ? 'up' : 'down');
                    break;
                }
                default:
                    break;
            }
        }
        handleEnter(index) {
            const currentitem = this.props.options[index];
            this.setState({
                activeIndex: index,
                displayValue: getItemValue(currentitem)
            })
        }
        handleLeave() {
            this.setState({
                activeIndex: -1,
                displayValue: ''
            })
        }
        updateItem(direction) {
            const { activeIndex } = this.state;
            const { options } = this.props;
            const lastIndex = options.length - 1;

            let newIndex = -1;

            // 根据键盘方向更新激活项索引
            if(direction === 'up') {
                // 若尚未选中，则默认选中最后一项，从下往上
                if (activeIndex === -1) {
                    newIndex = lastIndex;
                } else {
                    newIndex = activeIndex - 1;
                }
            } else {
                if(activeIndex < lastIndex) {
                    newIndex = activeIndex + 1;
                }
            }
            // 跟新输入框的值
            let newDisplayValue = '';
            if (newIndex >= 0) {
                newDisplayValue = getItemValue(options[newIndex]);
            }
            // 跟新状态
            this.setState({
                displayValue: newDisplayValue,
                activeIndex: newIndex
            });
        }
        render() {
            const { displayValue, activeIndex } = this.state;
            const { value, options } = this.props;

            return(
                <div className={style.wrapper}>
                    <input
                        value={displayValue || value}
                        onChange={(event) => this.handleChange(event.target.value)}
                        onKeyDown={this.handleKeyDown}
                    />
                    {
                        options.length > 0 && (
                            <ul
                                className={style.options}
                                onMouseLeave={this.onMouseLeave}
                            >
                                {
                                    options.map((item, index) => {
                                        return (
                                            <li
                                                key={index}
                                                className={activeIndex === index ? style.active : ''}
                                                onMouseEnter={() => this.handleEnter(index)}
                                                onClick={() => this.handleChange(getItemValue(item))}
                                                >
                                                { item.text || item }
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        )
                    }
                </div>
            );
        }
    }

    // 组件检验

    AutoComplete.propTypes = {
        value: PropTypes.number.isRequired,
        options: PropTypes.array.isRequired,
        handleChange: PropTypes.func.isRequired
    }



    export default AutoComplete;

### this绑定方式

以上，在constructor构造函数中有两句与句：

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleLeave = this.handleLeave.bind(this);

而在组件中还有诸如onClick事件的方法：

    onClick={() => this.handleChange(getItemValue(item))}


以上都出于相同的目的：绑定this。使用ES5语法书写的React组件会自动为我们将this指向到当前组件，而使用ES6语法书写的React组件则未自动为我们绑定this，所以我们需要手动绑定，使得this指向到当前组件，一版绑定由两种方式：

- 在构造函数constructor的super()方法之后绑定this
- 在组件内使用肩头函数，肩头函数本身并没有this，使用肩头函数即相当于自动的把this绑定到了当前组件对象
- 当组件的方法比较多，而我们又不想都适用肩头函数时，在constructor中一个一个的绑定太过于麻烦，所以我们还可以写一个公用的方法来遍历绑定this


HonorEditor.js组件输入owner_id的部分修改如下：

    <FormItem label="荣誉所属：" valid={owner_id.valid} error={owner_id.error}>
        <AutoComplete
            value={owner_id.value ? owner_id.value : 0}
            options={PlayerOptions}
            handleChange={value => this.handlePlayerOwnerIdChange(value)}
         />
    </FormItem>


表单其余部分不变。

getPlayerOptions方法为实现模糊搜索请求数据，得到下拉列表的的渲染的数据。
handlePlayerOwnerIdChange方法用于监听输入框，然后使用函数节流的方式去调用getPlayerOptions方法请求数据。

    getPlayerOptions(playerId) {
        fetch('http://localhost:3000/players?id_like' + playerId)
            .then((res) => res.json())
            .then((res) => {
                if (res.length === 1 && res[0].id === players) {
                    return;
                }
                this.setState({
                    PlayerOptions: res.map(item => {
                        return{
                            text: `${item.id} (${item.name})`,
                            value: item.id
                        }
                    })
                })
            })
    }
    timer = 0;
    handlePlayerOwnerIdChange(value) {
        this.props.handleChange('owner_id', value, 'number');
        this.setState({
            PlayerOptions: []
        });
        // 时间节流
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (value) {
            // setTimeout使用肩头函数自动绑定this指向当前组件对象
            this.timer = setTimeout(() => {
                this.getPlayerOptions(value);
                this.timer = 0;
            }, 800)
        }
    }

### 模块CSS

自动完成输入的列表未加入任何样式，太过于丑陋，添加一个auto-complete.less的样式，在AutoComplete组件中引入，并为组件添加样式类名：

    import style from '../../styles/auto-complete.less'

    className={style.wrapper}

在某个组件中引入样式表文件，而不是在程序应用的入口文件中引入样式表，则无需使用webpack的loader去加载文件，如此形成一个组件对应一个模块的样式表。


以上，到当前为止，React的组件基础，以及React-Router的使用知识已经算是过了官方文档的大部分了，其实可以看出，使用React的核心或者说基本点在于以下几点：

- 组件的拆分，在React中，可以说一切都是组件，一切都是由组件组成，也即可以说明，一切都可以被拆分为组件。
- 是否需要将某部分拆分为组件？组件是否该继续细拆违更小的组件？组件的拆分是一门艺术！
- 组件是否可以重用，如何重用？组件由两大特点：可维护性，可复用性。
- 组件的逻辑：组件内部通过维护，组件对外接口由props对象提供。
- 组件的生命周期，在哪个周期适合做哪些操作？ajax或者fetch数组请求官方更加推荐是在componentDidMouting周期内执行，而不是在componentWillMouting周期， componentWillMouting具有不确定性，服务器端的操作再次周期问题不大。componentDidMouting周期至少可以保证被调用一次。


### 登陆验证

到目前为止，我们的后台，来者不拒，所有知道我们后台连接的人都可以直接访问我们的后台，可以操作修改我们的数据。这怎么行呢？so!我们需要给我们的后台系统添加验证后开放权限，首先，你要有个女朋友！哈哈哈哈，首先，得要登陆才可以访问后台并操作数据，未登录？对不起，请离开。

对于我们的管理系统而言，其实是一个SPA应用，即单页面应用，SPA应用于传统的web应用不同，SPA的页面渲染不再依赖于服务器，其语服务器的交互主要通过接口完成，而REASTfu风格的接口提倡无状态，通常不使用cookie和session来进行身份认证。不通过cookie和session的话，一般会采用web token来实现身份验证(如微信公众号采用的token验证身份)，所谓token其实就是一个验证身份的令牌。见令牌如见圣上。客户端在登陆成功后可以获取服务器加密的token。然后在后续需要身份认证的接口请求中在header中带上这个token，服务端就可以通过判断token的有效性来验证该请求是否合法。


改造服务器，实现简单的token验证。

在server/目录下新建auth.js，写入验证模块：


    // 到期时间 1 min
    const expireTime = 1000 * 60;

    module.exports = function(req, res, next) {
        // 登陆成功后的返回头中增加服务器已加密的token信息，以便在后续需要身份验证的接口请求中在请求头戴上这个token，发送到服务器进行判断请求是否合法
        res.header('Access-Control-Expose-Headers', 'access-token');

        // 当前时间
        const now = Date.now();
        // 默认为不合法你，即未认证
        let unAuthorized = true;

        // 获取请求头的信息，判断是否有access-token即请求是否合法
        const token = req.header('access-token');
        // 若请求头存在token，则为合法请求
        if (token) {
            // 是否有效期内
            const expired = now - token > expireTime;
            // 超时
            if (!expired) {
                unAuthorized = false;
                // 重新设置token有效时间起始点为当前时间点
                res.header('access-token', now);
            }
        }

        if (unAuthorized) {
            // 客户端请求出错
            res.sendStatus(401);
        } else {
            // 继续执行
            next();
        }
    }



### 服务器入口

在server/目录下新建index.js文件，作为启动服务器入口，同时需要在项目中本地安装服务器开发依赖：

    npm install json-server --save-dev

index.js引入json-server，使用其API，构建一个简单的服务器启动项：


    const path = require('path');
    const jsonServer = require('json-server');
    const server = jsonServer.create();
    const router = jsonServer.router(path.join(__dirname, 'db.json'));
    const middlewares = jsonServer.defaults();

    // 注册json-server的api

    server.use(jsonServer.bodyParser);
    server.use(middlewares);

    server.post('/login', function(req, res, next) {
        res.header('Access-Control-Expose-Headers', 'access-token');
        const { account, password } = req.body;
        if (account === 'admin' && password === '123456') {
            res.header('access-token', Date.now());
            res.json(true);
        } else {
            res.json(false);
        }
    });

    // 验证
    server.use(require('./auth'));
    server.use(router);

    server.listen(3000, function() {
        console.log('服务器启动成功！浏览器访问http://localhost:3000/')
    })



如此，在服务器中实现简单的登陆服务，并在启动服务器后，加载验证模块，


TIPS：验证的实现流程：

当服务器启动后，若违登陆，我们直接通过浏览器访问前端项目地址[http://localhost:8000](http://localhost:8000)，此时与未做验证之前没有任何不懂，但是，当我们从首页点击路由或者地址栏直接输入想要访问的页面的路由时，若是该路由是新增信息页面路由，也没有什么问题，但是，若是该路由所渲染的组件内部涉及到数据请求，那么，由于未登录，即服务器中的：



    server.post('/login', function(req, res, next) {
        res.header('Access-Control-Expose-Headers', 'access-token');
        const { account, password } = req.body;
        if (account === 'admin' && password === '123456') {
            res.header('access-token', Date.now());
            res.json(true);
        } else {
            res.json(false);
        }
    });

这段代码未被执行，即：

    res.header('access-token', Date.now());
    res.json(true);

这两条语句未执行，那么也就无处可寻找access-token了。则验证未通过，此时浏览器抛出错我！那么怎么办呢？登陆呗！等等，这里还有一个亮点，验证未通过，那么应该是未登陆或者有效期超时，此时，都应该需要登陆或者重新登陆，要用户自己去找登陆页面然后登陆吗？当然不可能如此不友好啦！也就是说，一旦抛出验证未通过的错误，那么我们就应该自动跳转到登陆页面，让用户登陆！一般什么时候回抛出错误？在我们这个管理系统中，我们设计的是，发起请求时，一旦对于敏感的数据API发起请求就需要验证，相应头返回信息就包括重新计时的access-token字段，此处我们假定所有的数据都是敏感信息，那么也就是说，所有发起请求的地方都要验证，一旦验证未通过，则报错并自动跳转到登陆界面。以上：对于那些发起请求的地方进行登陆页面跳转，再好不过了，我们的数据请求都是使用fetch方法来完成，每个涉及到数据交互的地方都需要用到fetch，那么我们要在每一个fetch的地方都要进行登陆页面跳转的接口修改嘛？当然不行！这也太蠢了！该当如何？封装复用！我已经在每个fetch数据的地方都进行了简单的封装，但是这存在两个问题：

- 封装只在每个组件内部将fetch代码段抽离成一个函数，便于组件代码的管理
- 目前封装的每个fetch函数都不一样，然而他们却都有很多相同的店

也就是说，我目前所做的封装并不是真正的封装，知识将零散的代码片段合成一个函数，便于管理代码而已，他们不可被其他组件中需要用同样代码的地方复用，只能每个组件内写一个函数，这座了大量重复的工作，所以，我们应该将这段fetch数据的代码抽离成一个单独的fetch模块，并且把相同功能的部分也独立未共用方法，而不是在每个组件内写一个函数的所谓简单的封装，当有组件需要用fetch数据时，引入这个fetch模块，然后需要做组件特有的操作时再行添加！

### 封装Fetch

在utils/目录下，新建request.js文件，用于封装fetch模块：


    import { hashHistory } from 'react-router'


    export default function request(method, url, body) {
        method = method.toUpperCase();

        if (method === 'GET') {
            // fetch的GET不允许有body，参数只能放在url中
            body = undefined;
        } else {
            // 序列化请求体
            body = body && JSON.stringify(body);
            // 以上相当于
            // if (body) {
            //     json.stringify(body);
            // }
        }

        return fetch(url, {
            // 请求方法
            method,
            // 公共头部信息
            // fetch如ajax一样，若是post方法，发送htttp请求时，根据协议则需要设置请求头报文信息
            // 请求头内部需要设置access_token字段
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem('access_token') || '' // 从sessionStorage中获取access token
            },
            // 请求体
            body
        })
            .then((res) => {
                if(res.status === 401) {
                    // 路由跳转至登陆页面
                    hashHistory.push('/login');
                    // 标记为未认证
                    // return Promise.reject('Unauthorized.');
                } else {
                    // 获取头部的access_token字段
                    const token = res.headers.get('access-token');
                    if (token) {
                        // 设置token存储到sessionStorage中
                        sessionStorage.setItem('access_token', token);
                    }
                    return res.json();
                }
            })
    }

    // 配置不同请求方法的fetch
    export const get = url => request('GET', url);
    export const post = (url, body) => request('POST', url, body);
    export const put = (url, body) => request('PUT', url, body);
    export const del = (url, body) => request('DELETE', url, body);

封装的首要特点就是将定制化的部分改为通用化，比如，请求的方法有gep post put等，定制化就是在每个函数中写死请求的方法时get或者post还是put，则每次请求使用不同的方法，这个函数就得复制一份，通用化即是以参数代替定制化写死的内容，如，以method代替get、post、put等，每次请求方法不同时，只要传入的实参不同即可。

以上，除了导出四个对应方法的四个函数外，还要导出默认的request函数，因为请求方法可能不止四个钟的一个，也可能是，使用fetch模块时，由于需求不同，请求时方法也不同（即求情方法可能改变），但是其他都相同，我们不可能去调用不同的方法函数，而应该是使用默认的request函数，修改因为需求不同而使得方法不同的method参数，这个应用场景很熟悉是不是？新增信息和编辑信息！新增和编辑使用的fetch一切代码几乎相同，除了根据传入的条件判断方法是post还是put。所以，以上即为封装的fetch模块。

封装好fetch后，将应用中一切涉及到fetch数据请求的地方均修改为引入我们封装的模块，此后即可实现一旦抛出验证未通过的错误即可自动跳转到登陆页面！


### 实现登陆

登陆跳转已实现，登陆页面尚未就绪，实现之：


在Components/目录下新建Login/目录，在该目录下新建Login.js组件：

    import React from 'react';

    import formProvider from '../../utils/formProvider';

    import FormItem from '../FormItem/FormItem';
    import HomeLayout from '../Layouts/HomeLayout';

    import { post } from '../../utils/request';

    class Login extends React.Component {
        constructor() {
            super();
            this.handleSubmit = this.handleSubmit.bind(this);
        }
        handleSubmit(event) {
            event.preventDefault();
            const { formValid, form: {account, password} } = this.props;
            if (!formValid) {
                alert('请输入账号或密码');
                return;
            }
            post('http://localhost:3000/login', {
                account: account.value,
                password: password.value
            })
                .then((res) => {
                    if(res) {
                        alert('登陆成功')
                        this.context.router.push('/');
                    } else {
                        alert('登陆失败，账号或者密码错误')
                    }
                })
        }
        render() {
            const { form: { account, password }, handleChange } = this.props;

            return(
                <HomeLayout title="登陆">
                    <form onSubmit={this.handleSubmit}>
                        <FormItem label="用户名：" valid={account.valid} error={account.error}>
                            <input type="text" value={account.value} onChange={event => handleChange('account', event.target.value)} />
                        </FormItem>
                        <FormItem label="密码：" valid={password.valid} error={password.error}>
                            <input type="text" value={password.value} onChange={event => handleChange('password', event.target.value)} />
                        </FormItem>
                        <div>
                            <input type="submit" value="提交" />
                        </div>
                    </form>
                </HomeLayout>
            )
        }
    }

    Login.contextTypes = {
      router: React.PropTypes.object.isRequired
    };


    Login = formProvider({
        account: {
            defaultValue: '',
            rules: [
                {
                    pattern(value) {
                        return value.length > 0;
                    },
                    error: '请输入账号'
                }
            ]
        },
        password: {
            defaultValue: '',
            rules: [
                {
                    pattern(value) {
                        return value.length > 0;
                    },
                    error: '请输入密码'
                }
            ]
        }
    })(Login);

    export default Login;


别忘路在路由文件中添加路由哦！React中一切想要通过url方式被直接访问的组件都需要通过添加路由来渲染。



<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_8.png" align="center"></p>
</center>


尝试一下操作，启动服务器-访问管理系统-不登陆-访问信息列表-报错并自动跳转到登陆-登陆-成功后跳转到主页。

当然了，这种验证方式并不十分友好，比如，每次登陆成功都是回到主页，我们可以设计react-router的路由操作，每次登陆成功回到上一次页面。但我们的关注的重点暂时不在于产品设计。and so on。。。

### Ant-Design

后台管理系统有时并不太关注页面的样式，或者样式的变化也不是特别复杂，但是也不能太过于丑陋，也不能过于单一，Ant-Design可以满足我们的需求。

TIPS：

前端时间知乎上海游话题问起为什么NG这么久了还没出一个乡React的Ant-Design这样的UI框架？哈哈哈哈哈！应为他没有我们帅啊！不过前一周NG倒是出了相应的UI框架了。

安装组件库：

    npm install antd --save


对于使用React全家桶来说，无论是webpack打包还是其他的打包，都存在这样一个问题：若是将全家桶或者第三方库都打包了，则文件将会异常庞大，所以，我们需要实现组件的暗许加载，则需要安装一个babel-plugin-import的babel插件来实现次目的：

    npm install babel-plugin-import --save-dev


TIPS：

npm安装命令：

项目依赖：

    npm install xxx --save

    or

    npm i xxx -S

开发依赖：

    npm install xxx --save-dev

    or

    npm i xxx -D


配置.roadhogrc文件，加载babel-plugin-import插件：

在根目录下创建.roadhogrc文件：

    {
      "extraBabelPlugins": [
        ["import", {
          "libraryName": "antd",
          "libraryDirectory": "lib",
          "style": "css"
        }]
      ]
    }



### 引入antd

首先修改我们的整体布局，一般而言，后台管理系统的结构通常为顶部导航栏部分，左侧侧边栏菜单部分，右侧主体内容部分，将我们的布局也改为这样的结构与行业接轨！

HomeLayout.js中引入antd，修改HomeLayout组件如下：

    import React from 'react';

    import { Link } from 'react-router';

    import { Menu, Icon } from 'antd';

    import style from './home-layout.less'

    const SubMenu = Menu.SubMenu;
    const MenuItem = Menu.Item;


    class HomeLayout extends React.Component {
        render() {
            const { children } = this.props;
            return (
                <div>
                    <header className={style.header}>
                        <Link to="/">首页</Link>
                    </header>

                    <main className={style.main}>
                        <div className={style.menu}>
                            <Menu mode="inline" theme="dark" style={{width: '240px'}}>
                                <SubMenu key="player" title={<span><Icon type="user" /><span>球员管理</span></span>}>
                                    <MenuItem key="player-list">
                                        <Link to="/player/list">球员列表</Link>
                                    </MenuItem>
                                    <MenuItem key="player-add">
                                        <Link to="/player/add">添加列表</Link>
                                    </MenuItem>
                                </SubMenu>
                                <SubMenu key="honor" title={<span><Icon type="user" /><span>球员管理</span></span>}>
                                    <MenuItem key="honor-list">
                                        <Link to="/honor/list">球员列表</Link>
                                    </MenuItem>
                                    <MenuItem key="honor-add">
                                        <Link to="/honor/add">添加列表</Link>
                                    </MenuItem>
                                </SubMenu>
                            </Menu>
                        </div>

                        <div className={style.content}>
                            {children}
                        </div>
                    </main>
                </div>
            )
        }
    }

    export default HomeLayout;

此时访问我们的首页：





<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_9.png" align="center"></p>
</center>


可以发现，侧边栏已经有样式，这就是我们引入的antd组件库，antd使用方法参考官网[Ant-Design](https://ant.design/docs/react/introduce-cn)，侧边栏已经成勇使用了antd组件库的样式，但是整体布局^_^。那是因为我们的home-layout.less还没有着手去写，完成home-layout.less：

    .main {
        height: 100vh;
        padding-top: 50px;
    }

    .header {
        width: 100%;
        height: 50px;
        line-height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 18px;
        padding: 0 20px;
        color: white;
        background-color: #2F99FF;
        > a {
            color: inherit;
        }
    }


    .menu {
        width: 240px;
        height: 100%;
        float: left;
        background-color: #404040;
    }

    .content {
        height: 100%;
        padding: 12px;
        overflow: hidden;
        margin-left: 240px;
    }


左侧固定，右侧自适应哦！如图：


<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_10.png" align="center"></p>
</center>


有了这个布局页面之后，此间我们做的Home.js组件，用于当作主页，以便用来放置各个路由供用户点击，有了侧边栏之后，这个组件已经没有存在的必要，但是我们还是可以修改一下这个组件，比如放置欢迎信息以及一些简单的登陆用户的信息展示。

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_11.png" align="center"></p>
</center>


完美有木有！当然不完美，太空洞了，往后进行扩展的时候，Home.js组件应该是渲染一些可视化的可视数据图。


TIPS：路由文件修改如下：


    import React from 'react';
    import ReactDOM from 'react-dom';
    // use react-router
    import { Router, Route, IndexRoute, hashHistory } from 'react-router';

    // use Components
    import PlayerAddComponent from './Components/Players/PlayerAdd';
    import HomeComponent from './Components/Players/Home';
    import PlayerListComponent from './Components/Players/PlayerList';
    import PlayerEdit from './Components/Players/PlayerEdit';

    import HomeLayout from './Components/Layouts/HomeLayout'
    import HonorAddComponent from './Components/Honor/HonorAdd';
    import HonorListComponent from './Components/Honor/HonorList';
    import HonorEdit from './Components/Honor/HonorEdit';
    import Login from './Components/Login/Login'

    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={HomeLayout}>
                <IndexRoute component={HomeComponent} />
                <Route path="/player/add" component={PlayerAddComponent} />
                <Route path="/player/list" component={PlayerListComponent} />
                <Route path="/player/edit/:id" component={PlayerEdit} />
                <Route path="/honor/add" component={HonorAddComponent} />
                <Route path="/honor/list" component={HonorListComponent} />
                <Route path="/honor/edit/:id" component={HonorEdit} />
            </Route>
            <Route exact path="/login" component={Login} />
        </Router>
    ), document.getElementById('root'));



使用嵌套路由，path="/"渲染布局HomeLayout则不必在每个组件都引入HomeLayout，同时首页HomeComponent的渲染使用IndexRoute路由组件。login则不需要使用主题布局。


主体的布局已经完成，但是对于登陆页面^_^丑，则用antd美化一下：


    import React from 'react';
    import { Icon, Form, Input, Button, message } from 'antd';

    import { post } from '../../utils/request';

    import style from './login.less'

    const FormItem = Form.Item;

    class Login extends React.Component {
        constructor() {
            super();
            this.handleSubmit = this.handleSubmit.bind(this);
        }
        handleSubmit(event) {
            event.preventDefault();
            this.props.form.validateFields((err, values) => {
                if(!err) {
                    post('http://localhost:3000/login', values)
                        .then((res) => {
                            if(res) {
                                message.success('登陆成功')
                                this.context.router.push('/');
                            } else {
                                message.error('登陆失败，账号或者密码错误')
                            }
                        })
                }
            })
        }
        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return(
                <div className={style.container}>
                    <div className={style.login}>
                        <header className={style.header}>
                            球员管理系统
                        </header>
                        <section className={style.section}>
                            <form onSubmit={this.handleSubmit}>
                                <FormItem>
                                    {getFieldDecorator('account', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入账号',
                                                type: 'string'
                                            }
                                        ]
                                    })(
                                        <Input type="text" addonBefore={<Icon type="user"/>} />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入密码',
                                                type: 'string'
                                            }
                                        ]
                                    })(
                                        <Input type="password" addonBefore={<Icon type="lock"/>} />
                                    )}
                                </FormItem>
                                <div>
                                    <Button className={style.btn} htmlType="submit" type="primary">登陆</Button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            )
        }
    }

    Login.contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    Login = Form.create()(Login);

    export default Login;


Login组件是一个简单的表单，我们利用antd组件库表单提供的create来构建表单，而不在需要原来我们所写的formProvider组件，同时表单的验证也使用antd组件提供的getFieldDecorator方法来验证，getFieldDecorator出了用于验证，它还封装了表单提交时候的处理，比如，获取表单的值，所以，我们修改一下表单提交处理程序，不再需要手动去获取表单的值，而通过getFieldDecorator获取所需的值数据，同时在表单提交时获取表单的校验结果，所以，表单提交实际数据写在antd的表单form的validateFields中。


<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_12.png" align="center"></p>
</center>


以此，所有需要表单的地方，我们都可以使用antd的form表单代替，所以，修改PlayerEditor.js组件：


    import React from 'react';
    import { Form, Input, Button, InputNumber, message } from 'antd';
    import request, { get } from '../../utils/request';

    const FormItem = Form.Item;

    const FormLayout = {
        labelCol: {
            span: 4
        },
        wrapperCol: {
            span: 16
        }
    };

    class PlayerEditor extends React.Component {

        componentDidMount() {
            const { editTarget, form } = this.props;
            if (editTarget) {
                form.setFieldsValue(editTarget);
            }
        }

        // 表单提交处理程序
        handleSubmit(event) {
            event.preventDefault();
            const { form, editTarget } = this.props;
            form.validateFields((err, values) => {
                if (!err) {
                    let editType = "添加";
                    let apiUrl = 'http://localhost:3000/players';
                    let method = 'post';
                    if (editTarget) {
                        editType = "编辑";
                        apiUrl += '/' + editTarget.id;
                        method = 'put';
                    }
                    request(method, apiUrl, values)
                        .then((res) => {
                            if(res.id) {
                                message.success(editType + '球员成功！');
                                this.context.router.push('/player/list');
                            } else {
                                message.error(editType + '失败');
                            }
                        })
                        .catch((err) => {
                            message.error(err);
                        });
                } else {
                    message.warn(err);
                }
            });
        }
        render() {
            // 结构出所需要的值
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <div style={{width: '600px'}}>
                    <form onSubmit={(event) => this.handleSubmit(event)}>
                        <FormItem label="球员名字：" {...FormLayout}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入球员名字'
                                    },
                                    {
                                        pattern: /^.{1,32}$/,
                                        message: '名字最多32位'
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                        <FormItem label="球员年龄：" {...FormLayout}>
                            {getFieldDecorator('age', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入球员年龄',
                                        type: 'number'
                                    },
                                    {
                                        min: 19,
                                        max: 50,
                                        message: '请输入合法年龄',
                                        type: 'number'
                                    }
                                ]
                            })(
                                <InputNumber style={{width: '100%'}} />
                            )}
                        </FormItem>
                        <FormItem label="效力球队：" {...FormLayout}>
                            {getFieldDecorator('team', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入效力青队'
                                    },
                                    {
                                        pattern: /^.{1,32}$/,
                                        message: '名字最多32位'
                                    }
                                ]
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                        <FormItem label="球员身高：" {...FormLayout}>
                            {getFieldDecorator('size', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入球员年龄',
                                        type: 'number'
                                    },
                                    {
                                        min: 150,
                                        max: 300,
                                        message: '请输入合法身高',
                                        type: 'number'
                                    }
                                ]
                            })(
                                <InputNumber style={{width: '100%'}} />
                            )}
                        </FormItem>
                        <FormItem wrapperCol={{...FormLayout.wrapperCol, offset: FormLayout.labelCol.span}}>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </form>
                </div>
            );
        }
    }

    // 必须给PlayerAdd义一个包含router属性的contextTypes
    // 使得组件中可以通过this.context.router来使用React Router提供的方法
    PlayerEditor.contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    PlayerEditor = Form.create()(PlayerEditor)

    export default PlayerEditor;





对于以下代码：

    componentDidMount() {
        const { editTarget, form } = this.props;
            if (editTarget) {
                form.setFieldsValue(editTarget);
        }
    }

我们使用antd组件库form的setFieldsValue方法代替我们的setFormData方法，setFieldsValue是form创建之后才可调用该方法，所以需要在组件挂载之后再调用。

<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_13.png" align="center"></p>
</center>

然后再修改球员数据列表也，直接食用antd的表格来渲染数据：


    import React from 'react';
    import { message, Table, Button, Popconfirm } from 'antd';
    import request, { get, del } from '../../utils/request'

    class PlayerList extends React.Component {
        /**
         * [constructor description]
         * @param  {[type]} props [description]
         * @return {[type]}       [description]
         */
        constructor(props) {
            super(props);
            this.state = {
                PlayerList: []
            }
        }
        // 在组件挂载前请求数据，当然也可以在组件挂载完成后再请求数据
        componentWillMount() {
            /**
             * [description]
             * @param  {[type]} res [description]
             * @return {[type]}     [description]
             */
            get('http://localhost:3000/players')
                .then((res) => {
                    if (res) {
                        this.setState({
                            PlayerList: res
                        })
                    }
                });
        }
        /**
         * [fetchData description]
         * @param  {[type]} url [description]
         * @return {[type]}     [description]
         */
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
        /**
         * [handleDelete description]
         * @param  {[type]} player [description]
         * @return {[type]}        [description]
         */
        handleDelete(player) {
                del('http://localhost:3000/players/' + player.id)
                // .then(res => res.json())
                .then(res => {
                    this.setState({
                        PlayerList: this.state.PlayerList.filter(item => item.id !== player.id)
                    });
                    message.success('删除球员成功！');
                })
                .catch(err => {
                    console.error(err);
                    message.error('删除失败！')
                });
        }
        /**
         * [handleEdit description]
         * @param  {[type]} player [description]
         * @return {[type]}        [description]
         */
        handleEdit(player) {
            /**
             * 路由跳转到编辑页面即可
             */
            this.context.router.push('/player/edit/' + player.id);

        }

        render() {
            // 解构赋值提取数据
            const { PlayerList } = this.state;
            // 表头
            const columns = [
                {
                    title: '球员ID',
                    dataIndex: 'id'
                },
                {
                    title: '球员名字',
                    dataIndex: 'name'
                },
                {
                    title: '球员年龄',
                    dataIndex: 'age'
                },
                {
                    title: '效力球队',
                    dataIndex: 'team'
                },
                {
                    title: '球员身高',
                    dataIndex: 'size'
                },
                {
                    title: '操作',
                    render: (text, record) => (
                        <Button.Group type="ghost">
                            <Button size="small" onClick={() => this.handleEdit(record)}>编辑</Button>
                            <Popconfirm title="确定要删除吗？" onConfirm={() => this.handleDelete(record)}>
                                <Button size="small">删除</Button>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            ]
            return (
                    <Table columns={columns} dataSource={PlayerList} rowKey={row => row.id}/>
            )
        }
    }

    PlayerList.contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    export default PlayerList;



其中antd组件库的Table为我们提供了分页处理，具体的参数配置参考官网即可。



<center>
<p><img src="https://beyondouyuan.github.io/img/ant_admin/admin_14.png" align="center"></p>
</center>


对于球员荣誉部分，同样引入antd即可，大功告成哈！







