---
layout: post
title: Express + Vue + Vuex构建简版类免展h5制作器
author: beyondouyuan
date: 2019-01-10
categories: blog
tags: [NodeJs, express, vue]
node: node
vue: vue
description: 团扇团扇，美人病来遮面。玉颜憔悴三年，谁复商量管弦。弦管，弦管，春草昭阳路断。
---

### 写在前面

厌倦了h5页面的开发？受够了产品经理要h5的demo？那就偷懒一下，写个h5制作器吧


## [LightCreater](https://github.com/beyondouyuan/LightCreater.git)

LightCreater是一个基于express vue vuex开发类似于免展h5简化版制作器


### 参考

- [express](http://www.expressjs.com.cn/)
- [mongodb](https://www.mongodb.com/)
- [vue](https://vuejs.bootcss.com/v2/guide/)


## Light开发说明

### API服务

- Node/Npm/Express
- Mongodb

### 前端视图

- Vue/Vue/Vuex


### 安装开发

``` bash
git clone https://github.com/beyondouyuan/LightCreater.git
# install dependencies
$ npm install # Or yarn install

# 启动服务端
$ npm run server

# 启动客户端
$ npm run dev
```

### 目录结构

```
    /client                     客户端
    /server                     服务端
        /api                    restful api 入口
            *.js
        /controllers            控制器
        /middleware             服务端校验
        /models                 mongodb模型
        /public                 静态文件
        /utils                  服务端工具库
        /app.js               服务端入口                    

```


## 功能设计

### api

- 登陆
- 注册
- 作品管理
- 作品编辑
- 图片上传

### 功能特性

- vuex管理编辑作品状态、包括元素动画、元素位置尺寸等属性
- animate和swiper作为动画库
- 服务端使用ejs将作品编译为html存储与服务端的静态文件中，后续即可访问作品
- 使用html5拖拽实现页面元素拖动编辑

效果图

- 作品列表

<center>
<p><img src="https://beyondouyuan.github.io/img/creater/1.png" align="center"></p>
</center>


- 编辑作品

<center>
<p><img src="https://beyondouyuan.github.io/img/creater/2.png" align="center"></p>
</center>
- 作品预览
<center>
<p><img src="https://beyondouyuan.github.io/img/creater/3.png" align="center"></p>
</center>
