---
layout: post
title: vue权限路由菜单实现解决方案
author: beyondouyuan
date: 2018-03-10
categories: blog
tags: [vue, vuex, vue-router]
vue: vue
description: 蝴蝶儿，晚春时，阿娇初着淡黄衣，依春学画伊。
---

## 写在前面

通常的，管理系统都有权限的需求，也就是说不通用户登录系统后，根据用户的角色权限不通，显示不通的菜单。


在非前后端分离时代，这个需求很容易实现，因为后台通常式服务端直出，服务端将数据放在template中直接渲染就好。

而在前后端分离的模式下，视图和服务端没有直接关联，除了数据来源式服务器外，所有的控制主动权都在前端手上。
但不管时什么模式，需求必须满足，也不得不满足，因为这可能影响到使用体验甚至是系统安全。

## 解决方案

系统前后端分离下的权限菜单解决方式

### 方案一

系统使用vue构建前台，菜单数据的显示和访问也就是vue-router的控制问题，在不与后台关联倩况下，我们将在路由表中注册配置页面路由，同时，vue-router提供全局守卫的钩子函数，入beforeEach等，者给了我们找到解决需求的方案，在每个路由进入前，就调用beforeEach函数去拦截路由，判断是否有权限访问该路由，若有权限，那么ok，直接next()，没有权限呢？那就Toast用户，你没有权限。者也就是最简单的方式。


但是，我们的需求不单单是无权限就无法访问操作，而是，用户无权限就直接看不到路由/菜单，这也很好办：

1. 在注册路由表时，给路由对象添加一个meta，用来标示该路由的权限，如下注册路由

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import NotFound from '@/views/NotFound'
import MerchantsDetail from '@/views/MerchantsDetail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    component: Login,
    name: 'login',
    leaf: true,
    meta: {
        auth: false
    }
    hidden: true
  }, {
    path: '/',
    component: Home,
    name: '主页',
    leaf: false,
    hidden: true,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: Dashboard,
      name: '指示板',
      leaf: true,
      hidden: true,
    }],
    meta: {
        auth: true,
        role: ['super','admin']
    }
  }, {
    path: '/merchants',
    component: Home,
    name: '商户详情',
    leaf: false,
    hidden: true,
    children: [{
      path: 'detail/:id',
      component: MerchantsDetail,
      name: '指示板',
      leaf: true,
      hidden: true,
    }],
    meta: {
        auth: true,
        role: ['super','admin']
    }
  }, {
    path: '*', //使用path: '/*' 可以匹配404，但是会出现进入每一个页面（存在和不存在的）都首先闪现一下404页面
    // path: '/404', //使用path: '/404'输入不存在的路由 具体跳转在路由表拦截器处理
    component: NotFound,
    name: '404',
    leaf: true,
    hidden: true
  }]
})
```

2 渲染路由时，先判断是否需要路由鉴权，在判断meta.role中是否contains当前登录的路由，来决定菜单是否渲染该路由，类似如下的渲染组件

```html
<template>
  <div>
    <template v-for="(node,index) of nodes" v-if="!node.hidden && node.meta.role.contains(user.role)">
      <el-submenu :index="index+''" v-if="!node.leaf && node.children.length">
        <template slot="title">
          <i v-if="node.iconCls" :class="node.iconCls"></i>
          <i v-else class="el-icon-setting"></i>
          <span slot="title">{{node.name}}</span>
        </template>
        <menu-tree :nodes="node.children"></menu-tree>
      </el-submenu>
      <el-menu-item v-if="node.leaf" :index="node.path" :route="{name:node.name}">
        <i v-if="node.iconCls" :class="node.iconCls"></i>
        <i v-else class="el-icon-setting"></i>
          <span slot="title">{{node.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MenuTree',
  data() {
    return {

    }
  },
  props: {
    nodes: {
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>

```

如此，纯由前端控制的路由菜单也实现了。

但是，这也存在问题，当路由足够多时，一，不好管理，二，一旦有变动将会非常麻烦，比如，权限角色增加了或者变更了...，同时，这也不够安全，此时渲染不显示了部分没有权限的页面，但是，这一部分页面的路由我们也是注册好在路由表中的，一旦系统的用户遭到劫持修改了用户或者用户信息，页面也是会被访问到的。

那么有没有一种实现方式：当用户没有权限时，系统直接不显示也不注册这个路由，这样就相当于页面时404的！

亲，有的！


## 方案二

vue-router提供了addRoutes的api，允许开发者动态的添加路由，由此，我们的解决方案就呼之而出了，

- 用户登录后，向后台发起获取菜单列表数据的请求
- 后台会根据登录用户的权限发挥菜单数据给前端
- 前端节收到菜单数据，调用addRoutes将登录后的到的菜单数据追加到路由表中
- 这样一来，就对系统足够安全，对开发来说也就足够省时

使用方案二，则路由表初始化时只需要配置不需要的路由鉴权的部分即可：

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import NotFound from '@/views/NotFound'
import MerchantsDetail from '@/views/MerchantsDetail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    component: Login,
    name: 'login',
    leaf: true,
    hidden: true
  }, {
    path: '/',
    component: Home,
    name: '主页',
    leaf: false,
    hidden: true,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: Dashboard,
      name: '指示板',
      leaf: true,
      hidden: true,
    }]
  }, {
    path: '/merchants',
    component: Home,
    name: '商户详情',
    leaf: false,
    hidden: true,
    children: [{
      path: 'detail/:id',
      component: MerchantsDetail,
      name: '指示板',
      leaf: true,
      hidden: true,
    }]
  }, {
    path: '*', //使用path: '/*' 可以匹配404，但是会出现进入每一个页面（存在和不存在的）都首先闪现一下404页面
    // path: '/404', //使用path: '/404'输入不存在的路由 具体跳转在路由表拦截器处理
    component: NotFound,
    name: '404',
    leaf: true,
    hidden: true
  }]
})
```

然后修改登录页面以及登录逻辑：

```html
<template>
  <el-form :model="loginForm" :rules="rulesLogin" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">管理系统</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked"  :checked="checked" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { adminLogin, requestLogin, requestUserResAll } from '@/api'
  import NProgress from 'nprogress'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
  import MenuUtils from '@/utils/MenuUtils'
  const requestCode = '100'
  const userName = localStorage.getItem('rememberName')
  const userPass = localStorage.getItem('rememberPass')
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: userName ? userName : '',
          checkPass: userPass ? userPass : ''
        },
        rulesLogin: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    computed: {
      ...mapGetters([
        'routes'
      ]),
    },
    methods: {
      ...mapActions([
        'LoginAction'
      ]),
      rememberAccount() {
          if (this.checked) {
            localStorage.setItem('rememberName', this.loginForm.account)
            localStorage.setItem('rememberPass', this.loginForm.checkPass)
          } else {
            localStorage.removeItem('rememberName')
            localStorage.removeItem('rememberPass')
          }
      },
      handleReset() {
        this.$refs.loginForm.resetFields();
      },
      handleLogin(ev) {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            NProgress.start();
            const loginParams = { account: this.loginForm.account, password: this.loginForm.checkPass };
             this.LoginAction(loginParams).then((res) => {
                  if (res.code == requestCode) {
                    this.$notify.success({
                      title: "登录成功",
                      message: res.msg,
                      duration: 2000
                    })
                    this.logining = false
                    this.rememberAccount()
                    NProgress.done()
                    this.$router.push({ path: '/' })
                  } else {
                    this.logining = false
                    NProgress.done()
                    this.$notify.error({
                      title: "登录失败",
                      message: '帐号或密码错误，请重试！',
                      duration: 2000
                    })
                  }
              })
          } else {
            console.log('error submit!!')
            return false
          }
        });
      }
    }
  }
</script>
```
LoginAction是一个异步的vuex action，在这里会去执行登录请求，主要代码如下：

```javascript
export const LoginAction = ({commit}, accountData) => {
    const {account} = accountData
    return new Promise((resolve, reject) => {
        requestLogin(accountData).then(res => {
            const {tokenData, shiroSessionId} = res.responseData
            commit(types.SET_TOKEN, tokenData)
            setToken(tokenData)
            commit(types.SET_SHIRO, shiroSessionId)
            setShiro(shiroSessionId)
            commit(types.SET_ACCOUNT, account)
            resolve(res)
        }).catch(e => {
            console.log(e)
            resolve(e)
        })
    })
}
```

登录后，设置token等信息，跳转到主页，进入主页时，我们就需要去获取菜单数据来渲染左侧菜单了。

创建一个permission.js文件，用于路由拦截，其主要代码如下：

```javascript
/*
 * @Author: beyondouyuan
 * @Date:   2018-04-08 12:03:42
 * @Last Modified by:   beyondouyuan
 * @Last Modified time: 2018-05-15 11:04:35
 */
import router from '@/router/index'
import store from '@/store/index'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  getToken
} from '@/utils/auth'
import {
  reduceData
} from '@/utils'
router.beforeEach((route, redirect, next) => {
  NProgress.start()
  if (getToken() && route.path === '/login') {
    next()
    NProgress.done()
  }
  if (!getToken() && route.path !== '/login') {
    next({
      path: '/login'
    })
  } else {
    if (getToken()) {
      store.dispatch('GenerateRoutes')
        .then(() => {
          try {
            router.addRoutes(store.getters.routes) // 动态添加可访问路由表
          } catch (error) {
            console.log(error)
          }
        })
    }
    if (route.path) {
      next()
    } else {
      next({
        path: '/404'
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
```

等进入非/login路由时，调用router.beforeEach方法拦截路由，在进入每一个路由前，去判断客户端是否有token，进行路由鉴权，若未登录，让用户登录，若已经登录，则执行vuex的GenerateRoutes action，异步去获取菜单数据，GenerateRoutes主要代码如下：

```javascript
/**
 * 执行异步import路由组件
 *
 * @class      GenerateRoutes (name)
 * @param      {Object}    arg1         The argument 1
 * @param      {Function}  arg1.commit  The commit
 * @return     {Promise}   { description_of_the_return_value }
 */
export const GenerateRoutes = ({commit}) => {
    return new Promise(resolve => {
        requestUserResAll().then(res => {
            const routes = res.responseData
            sessionStorage.setItem("routes", JSON.stringify(routes));
        })
        setTimeout(() => {
            // 为防止用户手动刷新浏览器时vuex丢失数据，将路由休息存储一部分在session中
            const routers = JSON.parse(sessionStorage.getItem('routes'))
            let routes = []
            MenuUtils(routes, routers)
            commit(types.SET_ROUTER, routes)
            resolve()
        }, 300) // 必须是一个大于0的时间值，否则可能出现无法立刻加载出异步获取的路由的bug
    })
}

```

GenerateRoutes通过requestUserResAll接口获取菜单数据，并同时存储于vuex的state和sessionStorage中，主要是为了防止用户强制刷新，导致vuex数据丢失，其实我们可以使用vuex-persistedstate来实现数据持久化的，

requestUserResAll获取菜单数据之后，会调用MenuUtils(routes, routers)来解析菜单数据，

MenuUtils方法大致如下： 

```javascript
import AsyncRoutes from './AsyncRoutes'

export default (routers, data) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换
  generaMenu(routers, data)
}

function generaMenu(routers, data) {
  return new Promise((resolve, reject) => {
    data.forEach((item) => {
      let menu = Object.assign({}, item)
      menu.component = AsyncRoutes(menu.component)
      if (!item.leaf) {
        menu.children = []
        generaMenu(menu.children, item.children)
      }
      routers.push(menu)
    })
    resolve(routers)
  })
}

```

AsyncRoutes方法会动态import路由文件：

```javascript
export default (name) => () => {
    return new Promise((resolve, reject) => {
        // import (`@/views/${name}/${name}.vue`)
        // 若不指定文件名，webpack会自动加载目录下的index文件
        import (`@/views/${name}`)
        .then(res => {
            resolve(res)
        })
        // 无法找到对应前端组件模块
        .catch(err => {
            console.log('error')
            resolve(import (`@/views/Default`))
        })
    })
}
```


由此，基本实现鉴权路由菜单，当然，这一整套代码还是有许多可以优化的地方，比如，获取菜单数据到vuex的映射这一部分，可以做的优化还是很多的，但是由于当初刚使用vue和vuex，所以做的不够好，而后续也没有再发现问题，也就因为其他的项目问题暂时不再理会了。

