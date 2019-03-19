---
layout: post
title: Express + Nuxt构建CMS
author: beyondouyuan
date: 2018-12-22
categories: blog
tags: [express, vue]
javascript: express
description: 人言落日是天涯，望极天涯不见家。
---

### 写在前面

cms是我们常用的应用，管理系统、公司官网管理。

vue提供nuxt框架实现服务端渲染，大大满足了对SEO有需求应用解决方案

## [LightCMS](https://github.com/beyondouyuan/LightCMS.git)


LightCMS采用前后端分离的模式，数据使用express提供restful接口。mongodb作为持久化数据库
前端使用nuxt实现服务端渲染。

### 参考

[express](http://www.expressjs.com.cn/)
[mongodb](https://www.mongodb.com/)
[nuxt](https://zh.nuxtjs.org/)


## Light开发说明

### API服务

- Node/Npm/Express
- Mongodb

### 前端仕途

- Vue/Nuxt/Vuex

### 开发

backpack整合express和nuxt

### 安装开发

``` bash
git clone https://github.com/beyondouyuan/LightCMS.git
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```

### 目录结构

```
    /api
        /admin                  管理后台相关api
        /web                    前台相关api
        ...                     前端调用api入口
    /components
                                组件
    /cofig
        *.js                    配置
        ...
    /layouts                    nuxt布局相关
    /logs                       log4js日志
    /middlewares
        *.js                    nuxt校验中间件
        ...
    /pages
        **                      nuxt路由系统即页面
        /admin                  管理后台仕途
        ...                     前台视图
        ...
    /plugins                    nuxt插件配置入口
    /server                     服务端
        /api                    restful api 入口
            /admin              管理后台使用的api
            /web                前台使用的api
        /controllers            控制器
        /middleware             服务端校验
        /models                 mongodb模型
        /utils                  服务端工具库
        /index.js               服务端入口                    
    /store                      Vuex配置
    /utils
        *.js                    公用工具函数
        ...


```


## 功能设计

### 后台api

- 登陆
- 注册
- 用户管理
- 文章管理
    - 文章编辑 支持markdown
    - 文章删除
- 评论管理
- 收藏管理
- 标签管理
- 广告管理
- 友链接=管理
- 图片上传

### 功能特性

- 支持权限系统
- 支持markdown
- 支持自定义标签，标签作为前台的菜单
- session维护登录状态


### 前台api

- 会员登录
- 会员注册
- 发布文章
- 收藏文章
- 评论文章
- 广告banner
- 菜单标签获取
- 关注会员
- 更新用户信息
- 头像上传

### 功能特性

- 游客状态可预览前台数据
- 会员登录后可发布、评论、收藏文章
- 可关注其他会员


### 效果图

- 游客状态前台


<center>
<p><img src="https://beyondouyuan.github.io/img/lightcms/1.png" align="center"></p>
</center>


- 会员登录后前台

<center>
<p><img src="https://beyondouyuan.github.io/img/lightcms/2.png" align="center"></p>
</center>


- 管理后台

<center>
<p><img src="https://beyondouyuan.github.io/img/lightcms/3.png" align="center"></p>
</center>

<center>
<p><img src="https://beyondouyuan.github.io/img/lightcms/4.png" align="center"></p>
</center>

