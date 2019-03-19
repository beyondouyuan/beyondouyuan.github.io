---
layout: post
title: 记录Taro开发小程序天坑过程
author: beyondouyuan
date: 2019-01-03
categories: blog
tags: [Reatc, Taro, 小程序]
React: React
Javascript: Javascript
description: 红酥手，黄縢酒，满城春色宫墙柳。
---

## 写在前面

小程序蓬勃发展已经三年多时间，在这个过程中陆陆续续做了两款小程序，踩到的坑也不少。
此次是做一个知识付费类的小程序，包括，音视频播放、分享、支付等功能


## 为什么Taro

Taro是一个多端统一的框架，包括小程序、h5、app，使用Taro主要是偷懒，也是为了后续产品的扩展性考虑。


## Taro组件

Taro按照React风格，支持组件化，使用Taro组件有以下一点坑：

### 组件定义defaultProps

若不定义defaultProps默认属性，在开环境下满屏的黄色waring，着实不舒服

### 组件使用全局外部的样式

需要在组件配置声明

```javascript
static options = {
    addGlobalClass: true
  }
```
### Taro尚未支持使用Function组件

Taro还不支持使用Function类的声明来定义无状态组件，因而还是使用class extend的方式声明组件

### map循环

map循环需要给item添加key属性，最好是唯一标示，除了去掉开发时的waring，key属性更大作用是用于diff计算时首尾的比对(React的diff是这样的，小程序具体原理还待探究)

map循环中无法使用if条件语句，尽量使用三元运输

### 绑定事件

Taro的所有事件都需要以on开头，且尽量不要使用匿名函数

### 向事件处理程序传递参数

通常我们会为事件处理程序传递额外的参数。例如，若是 id 是你要删除那一行的 id，以下两种方式都可以向事件处理程序传递参数

```html
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

### 路由传参

我自己多加了一层封装用来传参：

```javascript
const formatParams = params => {
  let arr = [];
  for (let name in params) {
    arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(params[name]));
  }
  return arr.join("&")
}

export const handleTaroNavigateTo = navigate => {
  const {
    path,
    params
  } = navigate
  Taro.navigateTo({
    url: `${path}?${formatParams(params)}`
  })
}
```

获取参数

```javascript
this.$router.params
```


## 尺寸

```
在 Taro 中尺寸单位建议使用 px、 百分比 %，Taro 默认会对所有单位进行转换。在 Taro 中书写尺寸按照 1:1 的关系来进行书写，即从设计稿上量的长度 100px，那么尺寸书写就是 100px，当转成微信小程序的时候，尺寸将默认转换为 100rpx，当转成 H5 时将默认转换为以 rem 为单位的值。

如果你希望部分 px 单位不被转换成 rpx 或者 rem ，最简单的做法就是在 px 单位中增加一个大写字母，例如 Px 或者 PX 这样，则会被转换插件忽略。

结合过往的开发经验，Taro 默认以 750px 作为换算尺寸标准，如果设计稿不是以 750px 为标准，则需要在项目配置 config/index.js 中进行设置，例如设计稿尺寸是 640px，则需要修改项目配置 config/index.js 中的 designWidth配置为 640：
```

## 静态资源

小程序默认是不能以静态方式引用资源的，一般是网络资源，
Taro中对于图片做了一层处理，以import的方式引入静态图片

```javascript
import image from '../../assets/iamges/1.png' 
```


## 媒体

### 音频

使用小程序音频api时，需要在app.js中加入一下配置声明：

```javascript
requiredBackgroundModes: ["audio"],
```

### getBackgroundAudioManager和createInnerAudioContext

- getBackgroundAudioManager是小程序后台管理器，在退出小程序到微信界面时，依然有效且具有控制能力
- createInnerAudioContext退出小程序到微信界面时将会失效，

在使用过程中发现createInnerAudioContext无法正确的刷新音频进度，需要连续触发两次才会更新进度，而getBackgroundAudioManager却是可以正确的到进度的。


### 视频

Vedio组件作为原生组件，具有最高层级，当我们想在视频组件上添加自定义的一些元素时，将会被覆盖掉，所以微信又提供了cover-view来解决这一需求，但是cover却是有条件限制的，其内只允许是，cover-view\image\button等，其他元素将会失效，所以，当你想在视频组件上使用slider自定义进度条时，他是无效的，只能使用其他解决方案
