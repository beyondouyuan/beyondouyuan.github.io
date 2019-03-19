---
layout: post
title: Koa2 + React构建类豆瓣电影管理系统
author: beyondouyuan
date: 2019-01-21
categories: blog
tags: [NodeJs, Koa2, React]
node: node
react: react
description: 小山重叠金明灭，鬓云欲度香腮雪。
---


### 写在前面

此前都在用express和vue以及mogodb，这一次就是想玩玩koa和react以及mysql

## [film-system-api](https://github.com/beyondouyuan/film-system-api.git)

## API服务

- Node/Npm/Koa2
- Mysql

- 启动film-system-api后可在[管理后台](https://github.com/beyondouyuan/film-system-admin.git)管理数据



## 安装

```shell
$ git clone https://github.com/beyondouyuan/film-system-api.git

$ npm install
```

## 初始化数据

- 安装mysql并启动
- 进入数据库创建数据库
- 在./config/index.js中配置对应的数据库名称和数据登陆密码
- 将./init.sql拖动到数据库或者用cmd命令打开init.sql初始化数据库

## 运行

```shell
$ npm start
```

## jsDOC

- conf.json配置 jsDOC
- run jsdoc

### 例子：

要将/test目录下所有js文件生成文档至docs
若conf.json没有 `"include": ["test"]` 的配置项
shell如下
```shell
 jsdoc test -r -c ./conf.json -d docs
```
若conf.json有 `"include": ["test"]` 的配置项
shell如下
```shell
jsdoc -d docs -c conf.json -r
```
若在conf.json中还配置了opts配置选项(指定输出目录以及递归)，则shell如下：
```shell
jsdoc -c conf.json
```

[jsDOC参考文档](https://www.html.cn/doc/jsdoc/about-configuring-jsdoc.html)

## 目录结构

```
    /api
        *.js                     API
        collect.js               电影收藏相关API
        comment.js               电影评论相关API
        like.js                  电影评分相关API
        movies.js                读写电影相关API
        rank.js                  电影排行相关API
        search.js                搜索电影相关API
        upload.js                图片上传相关API
        user.js                  用户相关API
        ...
    /cofig
        *.js                    mysql配置
        ...
    /middlewares
        *.js                    校验中间件
        ...
    /public
        **                      koa服务器静态目录
        ...
    /sql
        *.js                    sql语句操作相关
        ...
    /utils
        *.js                    公用工具函数
        ...
    /.app.js                    服务器入口文件
    /.init.sql                  mysql数据表初始化文件
    /.router.js                 api路由入口


```

## 功能特性

### 后台api

- 登陆
- 注册
- 会员列表
- 电影上传
- 评论列表
- 图片上传
- excel导入导出电影

### 前台api

- 登陆
- 注册
- 头像上传/更新
- 正在热映电影
- 即将上映电影
- 电影排行
- 收藏(想看)
- 评论
- 电影搜索


### 管理后台效果图


<center>
<p><img src="https://beyondouyuan.github.io/img/koafilm/1.png" align="center"></p>
</center>


<center>
<p><img src="https://beyondouyuan.github.io/img/koafilm/2.png" align="center"></p>
</center>

## API调用示例

/=============== 用户相关API ===============/

### 登陆

说明 : 调用此接口 , 可登录用户
**必选参数 :** `userName` : 用户名字 `password` : 用户密码

**接口地址 :** `/api/user/login`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/user/login`
axios.post(url, {userName: 'member', password: '123456'}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "登录成功",
    "request_time": 1550713050311,
    "data": {
        "id": 2,
        "userName": "member",
        "avatar": "https://beyondouyuan.github.io/img/ouyuan.jpg",
        "role": 1,
        "createTime": 1546532547214,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoxLCJ1c2VyTmFtZSI6Im1lbWJlciIsImlhdCI6MTU1MDcxMzA1MCwiZXhwIjoxNTUzMzA1MDUwfQ.eajUhc7TFAwgUmJXqZR4g2J1cjK95yywQvHu2joK-_0"
    }
}
```

### 注册

说明 : 调用此接口 , 可注册会员。后台账户不允许网络创建 需手动在数据库中插入

**必选参数 :** `userName` : 用户名字 `password` : 用户密码

**接口地址 :** `/api/user/register`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/user/register`
axios.post(url, {userName: 'member', password: '123456'}).then(function() {
  // do what you want
})

// 结果
{
    "status": 101,
    "code": 101,
    "success": false,
    "message": "该用户名已经注册",
    "request_time": 1550713116295,
    "data": {}
}

{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "注册成功",
    "request_time": 1550713230411,
    "data": {}
}
```

### 会员用户列表

说明 : 调用此接口 , 可获取会员用户列表
**可选参数 :** `page` : 当前页码

**接口地址 :** `/api/user/`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/user/?page=1`
axios.get(url).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "用户列表获取成功",
    "request_time": 1550713508732,
    "data": {
        "list": [
            {
                "id": 1,
                "userName": "admin",
                "avatar": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "role": 0,
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}
```

### 删除会员

说明 : 调用此接口 , 可删除会员 管理员不可被删除

**必选参数 :** `id` : 会员id

**接口地址 :** `/api/user/:id`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/user/1`
axios.delete(url).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "删除成功",
    "request_time": 1550713230411,
    "data": {}
}
```

/=============== 喜欢（即评分）相关API ===============/

### 提交评分

说明 : 调用此接口 , 可对电影进行评分

**必选参数 :** `uid` : 会员id `movieId` : 电影id `star` : 分数


**接口地址 :** `/api/like/:id`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/like`
axios.post(url, {uid: '1', movieId: '2', star: '7.7'}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "评论提交成功",
    "request_time": 1550714313314,
    "data": {}
}
```
### 评分/喜欢的电影

说明 : 调用此接口 , 可对电影进行评分

**可选参数 :** `movieId` : 电影id `uid` :  会员id 二者必传一个


**接口地址 :** `/api/like/?uid=2` 我喜欢的电影

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/like/?uid=2`
axios.get(url).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取我喜欢的电影列表成功",
    "request_time": 1550715481950,
    "data": {
        "list": [
            {
                "id": 1,
                "isLike": "1",
                "star": "8.0",
                "movieId": "1",
                "movieName": "流浪地球",
                "movieCover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "uid": "2",
                "userName": "member",
                "avatar": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}
```
**接口地址 :** `/api/like/?movieId=2` 喜欢该电影人/列表

**axios调用示例**

```javascript

// 例子
const url = `http://127.0.0.1:8889/api/like/?movieId=2`
axios.get(url).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取评分列表成功",
    "request_time": 1550715623210,
    "data": {
        "list": [
            {
                "id": 2,
                "isLike": "1",
                "star": "8.2",
                "movieId": "2",
                "movieName": "飞驰人生",
                "movieCover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "uid": "2",
                "userName": "member",
                "avatar": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}


```

/=============== 评论相关API ===============/


### 获取该电影评论列表

说明 : 调用此接口 , 可获取该电影的评论列表

**必选参数 :** `id` : 电影id


**接口地址 :** `/api/comment/:id`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/comment/1`
axios.get(url).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取评论列表成功",
    "request_time": 1550715858467,
    "data": {
        "list": [
            {
                "id": 1,
                "movieId": "1",
                "uid": "2",
                "userName": "member",
                "avatar": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "content": "评论",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}

```

### 评论该电影

说明 : 调用此接口 , 可评论该电影

**必选参数 :** `movieId` : 电影id `uid` : 评论用户 `content`: 评论内容


**接口地址 :** `/api/comment`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/comment/1`
axios.post(url, {movieId: 2, uid: 2, content: '相当不错哦'}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "评论提交成功",
    "request_time": 1550716133304,
    "data": {}
}
```

### 更新评论

说明 : 调用此接口 , 可更新该评论

**必选参数 :** `id` : 评论id `uid` : 评论用户 `content`: 评论内容


**接口地址 :** `/api/comment`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/comment`
axios.put(url, {id: 2, uid: 2, content: '相当不错哦'}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "评论更新成功",
    "request_time": 1550716426336,
    "data": {}
}
```
      
### 删除评论

说明 : 调用此接口 , 可删除该评论

**必选参数 :** `id` : 评论id `uid` : 评论用户


**接口地址 :** `/api/comment`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/comment`
axios.delete(url, {id: 2, uid: 2}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "评论删除成功",
    "request_time": 1550716635595,
    "data": {}
}
```

/=============== 电影相关API ===============/

### 电影列表

说明 : 调用此接口 , 可获取电影列表

**可选参数 :** `status` : 电影状态(0:正在热映 1: 即将上映) `classify` :  数据类型(0:电影 1:电视剧) `type`: 电影类型  不传任何查询参数则获取所有电影


**接口地址 :** `/api/movie`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/movie?status=1`
axios.get(url).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取1电影列表成功",
    "request_time": 1550717348553,
    "data": {
        "list": [
            {
                "id": 1,
                "name": "流浪地球",
                "country": "中国",
                "classify": "电影",
                "releaseTime": '2019/02/04',
                "cover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "link": "http://www.baidu.com",
                "star": "7.9",
                "timeLong": "190分钟",
                "type": "科幻/灾难",
                "actors": "吴京/韩多多",
                "director": "导演甲",
                "status": 1,
                "description": "描述描述描述"
            }
        ],
        "total": 1
    }
}
```
### 单条电影

说明 : 调用此接口 , 可获取该电影详情

**必选参数 :** `id` : 电影id


**接口地址 :** `/api/movie/:id`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/movie/1`
axios.delete(url, {id: 2, uid: 2}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取电影成功",
    "request_time": 1550717509311,
    "data": {
        "id": 1,
        "name": "流浪地球",
        "country": "中国",
        "classify": "电影",
        "releaseTime": 1546532515378,
        "cover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
        "link": "http://www.baidu.com",
        "star": "7.9",
        "timeLong": "190分钟",
        "type": "科幻/灾难",
        "actors": "吴京/韩多多",
        "director": "导演甲",
        "status": 1,
        "description": "描述描述描述"
    }
}
```

### 上传电影

说明 : 调用此接口上传电影, 只有管理员有权限

**必选参数 :** `uid` : 用户id 用于检查权限 `name`: 电影名 `country`; 拍摄国家 `classify`: 数据类型（电影/电视剧/动漫）`releaseTime`: 上映时间 `cover`: 电影海报 `link` : 电影链接  `timeLong`: 时长 `type`: 电影类型 `actors` : 演员 `director`: 导演 `status` : 电影状态 `description` : 电影简述

**可选参数 :** `star`: 电影初始评分(默认0)

**接口地址 :** `/api/movie`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/movie`
axios.post(url, {
      name: '流浪地球',
      country: '中国',
      classify: '电影',
      releaseTime: '2019/01/24',
      cover: 'http://www.images/i.jpg',
      link: 'http://www.baidu.com',
      star: '7.7',
      timeLong: '130分钟',
      type: '科幻/灾难',
      actors: '吴京/韩朵朵',
      director: '不认识的导演',
      status: '0',
      description: '宇宙末日',
      uid: 2}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "电影上传成功",
    "request_time": 1550718765214,
    "data": {}
}
```

### 删除电影

说明 : 调用此接口可删除该电影, 只有管理员有权限

**必选参数 :** `id` : 电影id `uid` : 用户id 用于检查权限


**接口地址 :** `/api/movie`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/movie`
axios.delete(url, {id: 2, uid: 2}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "删除电影成功",
    "request_time": 1550718442305,
    "data": {}
}
```

/=============== 收藏（即想看）相关API ===============/

### 我的收藏列表

说明 : 调用此接口 , 获取收藏的电影列表

**必选参数 :** `uid` : 用户id


**接口地址 :** `/api/collect/:uid`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/collect/1`
axios.get(url).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取收藏列表成功",
    "request_time": 1550731858300,
    "data": {
        "lsit": [
            {
                "id": 1,
                "isCollected": "1",
                "movieId": "1",
                "movieName": "流浪地球",
                "movieCover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "uid": "2",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}
```

### 收藏电影

说明 : 调用此接口 , 收藏电影 标识为想看

**必选参数 :** `uid` : 用户id `movieId` 电影id


**接口地址 :** `/api/collect`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/collect`
axios.post(url, {uid: '1', movieId: '2'}).then(function() {
  // do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "收藏电影成功",
    "request_time": 1550732041213,
    "data": {}
}
```

/=============== 图片上传相关API ===============/


### 上传图片

说明 : 调用此接口 , 可为用户上传头像 为电影添加海报

**必选参数 :** `uid` : 用户id `type`: 图片分类 avatar为头像 cover为电影海报 `file` : base64的图片数据格式


**接口地址 :** `/api/upload`

**axios调用示例**

```html
<div class="upload-container">
    <div class="preview-box">
      <img v-if="show" :src="preview">
      <img v-else :src="defaultSrc">
    </div>
    <input
      @change="handleFileChange($event)"
      :id="upload"
      :ref="upload"
      accept="image/*"
      type="file"
      style="display: none" />
    <div class="add" @click="handleChooseImage">
      <div class="add-image" align="center">
        <i class="fa fa-camera-retro fa-5x"></i>
        <p class="font13">{{text}}</p>
      </div>
    </div>
</div>
```


```javascript
// 例子
handleFileChange(event) {
    const file = event.target.files[0]
    // 预览
    this.handleTransforPreview(file)
}
// 预览图片并提交值服务器
handleTransforPreview(file) {
    const self = this
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
    // 此处this指向reader回调结果哦
    // this.result即为图片数据
    self.preview = this.result
    self.show = true
    const url = `http://127.0.0.1:8889/api/upload`
    axios.post(url, {uid: '1', type: 'avatar', file: this.result}).then(function() {
              // do what you want
        })
    }
}
// 模拟触发input文件上传动作
handleChooseImage() {
    document.getElementById(this.upload).click()
}

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "图片上传成功",
    "request_time": 1550732041213,
    "data": {
        'src': 'http://127.0.0.1:8889/upload/images/avatar/avatar-xxx-xxx.png'
    }
}
```
/=============== 排行榜相关API ===============/

### 本周口碑榜单

说明 : 调用此接口, 获取本周时间段内按评分排行

**必选参数 :** 无
**可选参数 :** 无


**接口地址 :** `/api/rank/week`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/rank/week`
axios.get(url).then(function() {
                  // do what you want
})
// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取本周电影列表成功",
    "request_time": 1550731858300,
    "data": {
        "lsit": [
            {
                "id": 1,
                "isCollected": "1",
                "movieId": "1",
                "movieName": "流浪地球",
                "movieCover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "uid": "2",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}
```

### 本周口碑榜单

说明 : 调用此接口 , 获取本周时间段内按上映时间排行

**必选参数 :** 无
**可选参数 :** 无


**接口地址 :** `/api/rank/newest`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/rank/newest`
axios.get(url).then(function() {
                  // do what you want
})
// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取本周最新电影列表成功",
    "request_time": 1550731858300,
    "data": {
        "lsit": [
            {
                "id": 1,
                "isCollected": "1",
                "movieId": "1",
                "movieName": "流浪地球",
                "movieCover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "uid": "2",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}
```

### 豆瓣评分高于8以上榜单

说明 : 调用此接口 , 获取豆瓣评分高于8以上榜单

**必选参数 :** 无
**可选参数 :** 无


**接口地址 :** `/api/rank/top`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/rank/top`
axios.get(url).then(function() {
                  // do what you want
})
// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取豆瓣top电影列表成功",
    "request_time": 1550731858300,
    "data": {
        "lsit": [
            {
                "id": 1,
                "isCollected": "1",
                "movieId": "1",
                "movieName": "流浪地球",
                "movieCover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "uid": "2",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}
```
### 北美票房榜单

说明 : 调用此接口 , 获取北美票房榜单 目前仅包括美国加拿大墨西哥

**必选参数 :** 无
**可选参数 :** 无


**接口地址 :** `/api/rank/box`

**axios调用示例**

```javascript
// 例子
const url = `http://127.0.0.1:8889/api/rank/box`
axios.get(url).then(function() {
// do what you want
})

// 结果
{
    "status": 200,
    "code": 200,
    "success": true,
    "message": "获取北美票房电影列表成功",
    "request_time": 1550731858300,
    "data": {
        "lsit": [
            {
                "id": 1,
                "isCollected": "1",
                "movieId": "1",
                "movieName": "流浪地球",
                "movieCover": "https://beyondouyuan.github.io/img/ouyuan.jpg",
                "uid": "2",
                "createTime": 1546532515378
            }
        ],
        "total": 1
    }
}
```


