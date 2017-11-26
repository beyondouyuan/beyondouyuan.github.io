---
layout: post
title: Webpack + Vue + Vue-Router + Vuex + Express博客管理系统
author: beyondouyuan
date: 2017-11-26
categories: blog
tags: [JavaScript]
javascript: javascript
description: 陌上人如玉，公子世无双。
---


### 写在前面

不得不说，Vue相对于React来说学习曲线是更加平滑的一个框架，初上手React的第一感觉是“犀利”，初上手Vue的第一感觉确实“温文尔雅”。若说最近前端框架的绝对双骄那便是React和Vue了，个人而言，React是“翩若惊鸿，碗若游龙”，Vue便是“陌上人如玉”了。

### 为什么又是博客

demo只足以了解某一些知识点，再多的demo也不是系统性的学习方式，学习技术最适合的方式莫过于实战，而先通过简易又不失系统性的项目是最好不过的选择了。博客系统是包含前后端开发的很好的切入点。

### 构想

借鉴了部分同行在社区的分享，再加上自己胡思乱想一番，算是形成了超简易的一个项目了，首先拟定项目整个结构构架，对于博客而言，需要展示博客文章，博客文章由后端提供数据接口，然后按照约定去请求数据，就这么简单，这就可以达到学习的目的了，前端Vue承担一切，包括页面构建、页面路由切换以及状态管理，全家桶也就都用上了。数据交互，主要便是增删改查即可满足学习过程了。所以Express可以满足快速搭建和提供服务。这样，通过简易博客管理系统，逐个功能开发，实现逐个而相对系统的学习Vue的每一个知识点。

### Vue CMS

实现功能

- 简易博客内容管理系统
- 增、删、改、查、登入、登出
- 账户管理

### 项目github地址

[仓库地址](https://github.com/beyondouyuan/vue-blog-cms)

### 技术栈

涉及前后端的开发

### 前端

使用Vue全家桶

- Vue.js
- Vuex
- Vue-Router
- Vue-Resource

### 后端

选择Node的Express快速搭建后端服务器

- Node.js
- MongoDB+mongose
- Express

### 构建工具

选用Webpack加载ES6，PostCSS选用Sass

- Webpack
- ES
- Sass

### 模式

采用前后端分离模式，服务端仅提供数据API，路由全权交给前端，由Vue-Router实现路由控制

项目结构

    ./vue-blog-cms
        ./dist                                  打包文件
        ./server                                服务器
            ./api                               数据接口
                ./index.js
            ./config                            数据库配置
                ./db.js
            ./mock                              模拟数据
                ./mock.json
            ./models                            数据模型
                ./index.js
            ./index.js                          服务端入口
        ./src                                   前端
            ./assets                            静态文件
                ./css
                ./fonts
                ./img
                ./js
            ./components                        Vue组件
                ./admin                         后台组件
                    ./Account.vue               账号组件
                    ./Article.vue               文章组件
                    ./Aside.vue                 侧边栏
                    ./Editor.vue                编辑组件
                    ./Home.vue                  后台主页容器
                    ./Login.vue                 登陆组件
                    ./Message.vue               头部组件
                    ./OverView.vue              预览组件
                ./common                        公用组件
                    ./Dialog.vue                弹窗组件
                    ./Loading.vue               加载组件
                    ./Particle.vue              点Canvas
                    ./StarCanvas.vue            星空Canvas
                ./website                       前台组件
                    ./Archive.vue               归档组件
                    ./Article.vue               文章组件
                    ./Blog.vue                  前台主页容器
            ./router                            前端路由
                ./index.js
            ./store                             Vuex
                ./actions.js
                ./getters.js
                ./index.js
                ./mutations.js
            ./style                             全局样式
                ./common.scss                   rest
                ./constant.scss                 sass常量
                ./includes.scss                 sass mixin
                ./index.scss                    样式主文件
            ./main.js                           Vue主文件(入口)
            ./register.js                       注册页面入口
        .babelrc                                babel配置
        .gitignore
        ./index.html                            应用主页入口
        ./package.json
        ./README.md
        ./register.html                         注册页面
        ./webpack.config.js                     webpack配置

### 效果图

先看看效果图

#### 登陆界面


<center>
<p><img src="https://beyondouyuan.github.io/img/vue/login.png" align="center"></p>
</center>


#### 后台主页

<center>
<p><img src="https://beyondouyuan.github.io/img/vue/admin.png" align="center"></p>
</center>


#### 前台主页

<center>
<p><img src="https://beyondouyuan.github.io/img/vue/blog.png" align="center"></p>
</center>

超级简易，但也五脏俱全。

### 知识点

简单记录一下学习路线和过程，首先当然是Vue.js基础语法，然后逐渐进入Vue的生态圈了，本次学习大题经历Vue全家桶了，Vue基础支撑前端搭建，Vur-Router控制前端路由，实现页面切换，Vuex掌控状态管理，Vue-Resource提供http请求。

## vue.js

[官网](https://cn.vuejs.org/v2/guide/)

Vue核心只关注视图层，其足够轻量且API设计也简单易上手，更可以在不使用全家桶时便可无缝衔接到大部分现有项目中，这也是现在大多数团队选择Vue的重要出发点。

### Vue基础语法


#### 声明式渲染

    <template>
        <div id="app">
            {{message}}
        </div>
    </template>
    <script>
        export default {
            name: 'app',
            data() {
                return {
                    message: 'Hello Vue'
                }
            }
        }
    </script>

以上时组件式声明，页面将会输出Hello Vue，值得注意的是，当采用组件式声明时，数据即data属性需要写成函数形式，否则报错。而若是在实例中声明data属性时则为对象形式：

    <div id="app">
        {{message}}
    </div>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue'
            }
        })
    </script>

#### 数据绑定

1.文本插值

    {{message}}

2.html插值

    <div v-html="testHtml"></div>

3.属性绑定

    <div v-bind:title="message"></div>
    <div :title="message">缩写方式</div>

Vue中，使用带有v前缀的部分即为Vue指令，以此来表示他们是Vue提供的特殊属性，指令作用与所渲染的DOM上，用于响应式行为，以官方简单的描述就是，其作用是将改元素节点的某个属性与Vue实例的属性保持一致，(此处将div元素的的title保持与Vue实例的message属性一致)

#### 指令

Vue通过v前缀表明Vue指令，指令用于响应。

1.条件指令

v-if和v-show均用于根据条件控制组件或者元素的渲染


    <div class="container">
        <h2 v-if="yes">Yes</h2>
        <div v-if="Math.random() > 0.5">
            你可以看见
        </div>
        <div v-else>
            你看不到
        </div>
        <div v-show="ok">Are You OK? Ok</div>
    </div>

v-if和v-show的区别

两者均为条件指令，却有所区别，v-show可以这样简单的理解，使用v-show的元素，在实例初始化时被渲染到DOM中，v-show中ok值的真假只是简单的用于切换css的display属性，而v-if的条件在切换时，会伴随组件的销毁和重建：

    <div class="container">
        <div v-show="show" id="app1">
            
        </div>
        <div v-if="show" id="app2">
            
        </div>
    </div>

以上简单来说，当show为true时

    <div class="container">
        <div id="app1"></div>
        <div id="app2"></div>
    </div>

两者似乎没什么却别，然后如果show为false时，

    <div class="container">
        <div id="app1" style="display: none"></div>
    </div>

即，v-if控制的元素或者组件压根就没被渲染为dom！而v-show控制的元素或者组件只是display属性为node，节点依然在！

2.循环

v-for指令可以绑定数组数据渲染一个列表：

    <ul id="list">
        <li v-for="item in itmes">
            {{item.message}}
        </li>
    </ul>
    <script>
        export default {
            name: 'list',
            date() {
                return {
                    items: [{
                        message: 'hello vue'
                    }, {
                        message: 'hello react'
                    }]
                }
            }
        }
    </script>


以上将渲染出两个li并分别显示hello vue和hello react


3.绑定事件

v-on指令用于绑定事件，通过此语句调用定义在methods中的方法：

    <div id="app">
        <button v-on:click="clickHandle">按钮</button>
        <button @click="clickHandle">按钮</button>
    </div>
    <script>
        export default {
            name: 'event',
            methods: {
                clickHandle: function() {
                    alert('Hello')
                }
            }
        }
    </script>

v-on:event可缩写为@event。

4.事件修饰符

当我们需要在自定义的方法中去调用一些特殊的原生事件时，如阻止冒泡，可以通过使用事件修饰符实现：

    <div id="app">
        <!-- 阻止冒泡 -->
        <a @click.stop="clickHandle"></a>
        <!-- 链式调用修饰符 -->
        <a @click.stop.prevent="clickHandle"></a>
        <!-- 阻止重载 -->
        <form @submit.prevent="submitHandle"></form>
        <!-- 禁用修饰符不执行具体方法 -->
        <form @submit.prevent></form>
    </div>

5.表单输入绑定

v-model指令可以实现表单输入和应用状态之间的双向绑定：

>
v-model会忽略表单的value、checked、selected等特性的舒适之，它只根据Vue实例数据作为具体值，所以，需要设定初始值时应该是在data函数中声明初始值。
>


    <div id="app">
        <p>{{message}}</p>
        <input v-model="message">
    </div>
    <script>
        export default {
            name: 'model',
            data() {
                return {
                    message: 'hi'
                }
            }
        }
    </script>

当用户在input输入框输入内容时，p中的文本将随之改变，这对于响应交互是非常常用的应用场景。


#### 计算属性

在模版内直接使用表达式很便利，但是耦合太多业务逻辑，当项目及业务较复杂时，对于代码的可读性和可维护性都是比较不利的，对于复杂的业务逻辑，计算属性cmoputed是不二的选择！

    <div id="app">
        <p>init message: {{message}}</p>
        <p>reversed message: {{reversedMessage}}</p>
    </div>
    <script>
        export default {
            name: 'message',
            data() {
                return {
                    message: 'hello vue'
                }
            },
            computed: {
                reversedMessage: function() {
                    return this.message.split('').reverse().join('')
                }
            }
        }
    </script>

reversedMessage依赖于message属性，当message发生改变，依赖reversedMessage的绑定也会更新

计算属性的函数改为定义在methods中作为一个方法，可以达到相同的结果：

    <div id="app">
        <p>init message: {{message}}</p>
        <p>reversed message: {{reversedMessage()}}</p>
    </div>
    <script>
        export default {
            name: 'message',
            data() {
                return {
                    message: 'hello vue'
                }
            },
            methods: {
                reversedMessage: function() {
                    return this.message.split('').reverse().join('')
                }
            }
        }
    </script>

这两种方式可以得到相同的结果，然而他们之间却有所不同，计算属性基于其依赖进行缓存，仅在其相关依赖发生改变时才会重新求值，即，只要依赖message未发生改变，则多次访问reversedMessage会立刻返回之前的计算结果，而无需像methods一样，需要再次执行函数。

#### 侦听属性

vue通过侦听属性watch来观察和形影Vue实例的数据变动，当一些数据需要随着其他数据变动而变动时，可以选择侦听属性实现，例如，在验证输入有效内容时，提示信息一句输入框的内容而改变：

    <div id="app">
        <input name=""
            v-model="name"
        >
        <input name=""
            v-model="password"
        >
        <p class="info">{{info}}</p>
    </div>
    <script>
        export default {
            name: 'login',
            data() {
                name:'',
                password: '',
                info: ''
            },
            methods: {
                doLogin() {
                    if (!this.name.length) return this.info = '请输入正常的用户名'
                    if (!this.pwd.length) return this.info = '请输入正常的密码'
                },
                clear() {
                    this.info = ''
                }
            },
            watch: {
                name: 'clear',
                password: 'clear'
            }
        }
    </script>

#### 计算属性的setter

默认属性只有getter，在需要时，也可以提供setter方法，比如，在博客的marked输入时，需要根据计算属性在预览区域实时显示编辑效果时：

    <div id="">
        <input name=""
            v-model="title"
        >
        <textarea v-model="content"></textarea>
        <article id="article" v-html="markedContent"></article>
    </div>

    <script>
        export default {
            name: 'article',
            computed: {
                title: {
                    get(){
                        return this.$store.state.article.title
                    },
                    set(value){
                        this.$store.commit('UPDATE_TITLE', value)
                    }
                }
            }
        }
    </script>


#### 绑定class与style

class是元素的一个属性，当我们直接在元素或者组件上写上class时，这个class将始终存在：

    <div id="app">
        <p class="info"></p>
    </div>

即info样式始终伴随p，它是一个静态属性。

而当我们需要动态切换class时，如，侧边栏的弹出和收缩，根据条件来设置侧边栏的弹出和收缩的样式。在普通的DOM中，我们会直接获取样式名，通过addCLass护着toggleClass来切换属性，但是，Vue或者React中我们不必再去直接操作DOM，我们可以根据条件来动态切换class。

    <div id="app">
        <p class="static"
            :class="isActive ? 'active' : 'disable'"
        ></p>
    </div>
    <script>
        export default {
            data() {
                return {
                    isActive: true
                }
            }
        }
    </script>

    isActive为true以上渲染为：

    <div id="app">
        <p class="static active"></p>
    </div>

    若isActive为false则渲染为：

    <div id="app">
        <p class="static disable"></p>
    </div>


通过v-bind:class(以上使用了:class的缩写)，除了可以传入字符串外，还可以传入对象，以此可以为元素或者组件传入多个class

    <div id="app">
        <div :class="classList"></div>
    </div>
    <script>
        export default {
            name: 'class',
            data() {
                return {
                    classList: {
                        active: true,
                        'text': false
                    }
                }
            }
        }
    </script>

v-bind:style显而易见，用于绑定内联属性，其为对象语法，与CSS很像，但实际上是一个JavaScript对象，CSS的属性名可以采用驼峰式或者短横线分割，且使用短横线时需单引号引注。

    <div id="app">
        <p :style="{color: activeColor, fontSize: fontSize + 'px'}"></p>
        <p :style="styleObject"></p>
    </div>
    <script>
        export default {
            data() {
                return {
                    activeColor: 'red',
                    fontSize: 20,
                    styleObject: {
                        color: 'red',
                        fontSize: '30px'
                    }
                }
            }
        }
    </script>



### 组件

组件化是当前前端的趋势，组件化通过封装，在很大程度上实现了代码的重用，比如，在博客中，新增文章和编辑文章完全可以通过封装实现重用，而不是去重复写几乎一样的代码。

#### 全局组件

新建一个文件Mycomponent.vue，并写入模版：

    <template>
        <div id="container">
            <p>{{message}}</p>
        </div>
    </template>
    <script>
        export default {
            name: 'myComponent',
            data() {
                return {
                    message: 'Hello'
                }
            }
        }
    </script>

此即为全局组件，页面中需要始终这个组件，直接用import MyComponrnt from './components/Mycomponent.vue'引入即可。

#### 局部组件即嵌套组件

在一个主组件中使用嵌套子组件，被嵌套的子组件被视作主组件的局部组件引入：

新建App.vue

    <template>
        <section>
            <my-submenu />
            <my-header />
            <my-main />
            <my-footer />
        </section>
    </template>
    <script>
        import MySubmenu from './components/MySubmenu.vue'
        import MyHeader from './components/Header.vue'
        import MyMain from './components/MyMain.vue'
        import MyFooter from './components/Footer.vue'

        export default {
            name: 'App',
            components: {
                MySubmenu,
                MyHeader,
                MyMain,
                MyFooter
            }
        }
    </script>


新建MyMain.vue组件

    <template>
        <section>
            <my-top />
            <my-left />
            <my-right />
        </section>
    </template>
    <script>
        import MyTop from './components/MyTop.vue'
        import MyLeft from './components/MyLeft.vue'
        import MyRigh from './components/MyRigh.vue'

        export default {
            name: 'Main',
            components: {
                MyTop,
                MyLeft,
                MyRigh,
            }
        }
    </script>

在一个组件中需要使用其他组件时，必须预先import进来才可使用。以上这样的组件嵌套，使得我们可以将整个应用拆分成一个一个零件来声明和构建，构建完成后再组装拼接成一个完整的应用，如此就不会出现App.vue变成这样：

    <template>
        <section>
            <my-submenu />
            <my-header />
            <section>
                <my-top />
                <my-left />
                <my-right />
            </section>
            <my-footer />
        </section>
    </template>
    <script>
        import MySubmenu from './components/MySubmenu.vue'
        import MyHeader from './components/Header.vue'
        import MyTop from './components/MyTop.vue'
        import MyLeft from './components/MyLeft.vue'
        import MyRigh from './components/MyRigh.vue'
        import MyFooter from './components/Footer.vue'

        export default {
            name: 'App',
            components: {
                MySubmenu,
                MyHeader,
                MyTop,
                MyLeft,
                MyRight,
                MyFooter
            }
        }
    </script>


>
TIPS:以上一如Header和Footer组件文件为何不直接命名为更加语义化的Header和Footer而是加My前缀并以'<my-header> </my-header>'这样的方式使用呢？因为...，html标签中有header和footer！组件名称与html标签重名将会报错，虽然，最终还是正确的渲染了。不过可能在某些浏览器可能就无法渲染了。
>

>
TIPS:组件中的data属性必须写为data()函数形式！写为模版中的data: {}vue将会报错并停止执行！
>

### 生命周期

每个Vue实例在被窗前都会经过一系列的初始化过程，通常，当我们需要做一些事情的时候，我们会选择在响应的生命周期钩子函数中写下我们的业务代码，

Vue主要包含以下几个生命周期：

- created 组件创建
- mounted 组件挂载到DOM后
- updated 组件更新
- destroyed 组件销毁



## Vue-Router

Vue-router将组件components映射到路由，并按一定规则将组件渲染出来。

### 配置路由

要使用Vue-Router则需要引入依赖以及组件，Vue-Router依赖于Vue，所以在实例化Vue-Router时需要首先引入Vue。同时再讲需要映射到路由的组件引入，形如以下。

    import Vue from 'vue'
    import VueRouter from 'vue-router'

    import Login from './components/Login.vue'
    import Register from './components/Register.vue'

    const routes = [
        { pathe: './login', component: Register },
        { pathe: './register', component: Register }
    ]

    const router = new VueRouter({
        routes
    })

    const App = new Vue({
        router
    }).$mount('#app')


>
当应用中，<router-link>对应的路由匹配成功，vue将自动设置其class属性值为.router-link-active
>

### 动态路由匹配

有时，我们需要把某种模式匹配到的所有路由，全部映射到同一个组件中，如，我们有一个文章组件，对于数据库中查询到id不相同的文件，都将会渲染到这个组件中，则，动态路径参数可以达到此效果。

动态路径参数以冒号开头：

    const router = new VueRouter({
        routes: [
            { path: '/article/:id', component: Article }
        ]
    })


当vue匹配到一个路由时，参数值将会被设置到this.$router.params，则可在每个组件中使用：

    conts Article = {
        template: '<div>文章id：{{ $router.params.id }}</div>'
    }

Vue-Router除提供$.router.paramsAPI外，还提供其他的很有用的API，如当路由/URL中带有查询参数?，则$router.query就可以获得查询参数?后的信息，而$router.hash则可获取地址栏#后的参数。

### 响应路由参数

当使用路由参数时，如，路由从article/1导航到article/2时，实际上，这两个文章1和2使用的是同一个Article组件，即组件实例被复用，正是这种复用方式将我们从DOM中解放了出来，但是，复用组件意味着组件没有重复经历创建=>销毁=>创建这个过程，也就是说，组件的生命周期钩子不会再次被带调用，这样以来我们在生命周期内定义的一些事务就达不到响应的效果，这就需要我们去监控$router对象的变化，从而做出响应了。

watch可以做到：

    <template>
        <div id="app">
            {{message}}
        </div>
    </template>

    <script>
        export default {
            data() {
                return {
                    message: 'Router'
                }
            },
            watch: {
                '$router' (to, from) {
                    //..doSomething
                }
            }
        }
    </script>


但是，watch也不可滥用了，这可能会增大性能开销，我们可以使用beforeRouterUpdate来实现这个效果：

    <template>
        <div id="app">
            {{message}}
        </div>
    </template>

    <script>
        export default {
            data() {
                return {
                    message: 'Router'
                }
            },
            beforeRouteUpdate(to, from, next) {
                //..doSomething
                //别忘了调用next()
            }
        }
    </script>



### 嵌套路由

通过chidren参数配置嵌套路由

路由入口文件如下：

    ./router
        ./index.js

    import Vue                          from 'vue'
    import Router                       from 'vue-router'

    import Blog                         from '../components/website/Blog.vue'
    import Article                      from '../components/website/Article.vue'
    import Archive                      from '../components/website/Archive.vue'


    import Home                         from '../components/admin/Home.vue'
    import Login                        from '../components/admin/Login.vue'
    import Editor                       from '../components/admin/Editor.vue'
    import Account                      from '../components/admin/Account.vue'
    import Articles                     from '../components/admin/Articles.vue'


    Vue.use(Router)

    export default new Router({
        mode: 'history',
        routes: [{
                path: '/',
                name: 'Login',
                component: Login
            },
            {
                path: '/login',
                name: 'login',
                component: Login
            },
            {
                path: '/blog',
                name: 'blog',
                component: Blog,
                children: [
                    { path: '', component: Archive },
                    { path: 'article', name: 'article',component: Article }
                ]
            },
            {
                path: '/admin',
                component: Home,
                children: [
                    { path: '', component: Articles },
                    { path: 'articles', name: 'articles', component: Articles },
                    { path: 'editor', name: 'editor', component: Editor },
                    { path: 'account', name: 'account', component: Account }
                ]
            }

        ]
    })

Home.vue如下：

    <template>
        <section class="container">
            <Submenu></Submenu>
            <over-view></over-view>
        </section>
    </template>
    <script>
        import Submenu              from './Aside.vue'
        import OverView             from './OverView.vue'

        export default {
            name: 'Home',
            components: {Submenu, OverView}
        }
    </script>
    <style lang="sass" rel="stylesheet/scss" scoped>
        section.container {
            height: 100%;
            min-height: 800px;
            display: flex;
        }
    </style>

根据以上，当路由匹配为/admin时，Articles组件将会在Home.vue的<router-view>中被渲染，而当路由匹配为/admin/account时，则是Account组件在Home.vue的<router-view>中被渲染，由此即可实现路由的切换，

>
TIPS：以上几处需要注意：

    {
        path: '/admin', ==>>表示以下所有路径匹配皆以此为基础，即/admin/xx
        component: Home, ==>>表示children中的组件都是在Home的<router-view>中渲染
        children: [
            { path: '', component: Articles },==>>表示仅匹配/admin时的默认渲染的组件
            { path: 'articles', name: 'articles', component: Articles }, =>/admin/articles
            { path: 'editor', name: 'editor', component: Editor },=>/admin/editor
            { path: 'account', name: 'account', component: Account }=>/admin/account
        ]
    }

另一个，在Home.vue中有一个Message组件，并不需要经过new VueRouter实例化和配置，因为这只是一个普通的子组件，它不是zai<router-view>中渲染以达到切换路由，所以，他不是路由，只是淡村的组件
>


