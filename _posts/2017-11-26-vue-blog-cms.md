---
layout: post
title: Webpack + Vue + Vue-Router + Vuex + Express博客管理系统
author: beyondouyuan
date: 2017-09-02
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

## 学习时间轴







