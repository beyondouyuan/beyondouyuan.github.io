---
layout: post
title: 记录一次在小程序中使用Object.defineProperty的过程
author: beyondouyuan
date: 2018-11-20
categories: blog
tags: [JavaScript]
javascript: javascript
description: 一向年光有限身，等闲离别易销魂，酒筵歌席莫辞频。
---


## 写在前面

小程序的APP周期是异步的，页面的page也是异步的，这样子有期好处，那就是页面不必等待整个应用的数据周期完成后再渲染。

但是他也有造成不好的地方，当一个页面中的数据是依赖APP场景的数据时，就必须等到APP场景数据获取之后再去渲染。小程序有提供回调获取数据的方式来解决，但是在本人的开发过程中回调函数也一直拿不到目标数据，只能另寻他法了。


## 场景描述

小程序分享到微信群中，微信群里的用户打开小程序海报进入到小程序的排行页面，这个排行页面是仅仅对该群里的程序进行排行输出，而不是所有用户成员，所以就必须要拿到群id再去获取数据。

小程序onLaunch或者onShow的option中可以获取option.shareTicket的到群id，页面拿到option.shareTicket换取群opengid的标示，想后台发起数据请求，根据opengid的到群排名。


### 过程

起初，我的代码是类似于这样的：

app.js中：


```javascript

onLaunch: function(option) {
        const self = this
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
            console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(function() {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })

        })
        if (option.scene == 1044) {
            wx.getShareInfo({
                shareTicket: option.shareTicket,
                success: function(res) {
                    self.globalData.shareInfo = res
                    if (self.opengIdReadyCallback) {
                        self.opengIdReadyCallback(res)
                    }

                },
                fail: function(res) {
                    console.log(res)
                }
            })
        }
    }
```

opengIdReadyCallback是排行页面传入的回调函数用于获取opengid


排行页面rank.js中：

```javascript
onLoad: function(option) {
    opengIdReadyCallback(res => {
      const shareInfo = res.shareInfo
    // 根据shareInfo获取opengid再调用fetchData获取排行数据
      requestOpenidGid({shareInfo: shareInfo}).then(res => {
          const {
            opengid
          } = res
          self.setData({
            opengid: opengid
          }, () => {
            self.fetchData()
          })
        })
    })
```

实际上，我的opengIdReadyCallback总是获取不到shareInfo，则回调方案被pass掉了


不行？那就换一种方式呗！

## 万能的定时器和延时器

不管了不了解Event-loop，再异步场景中定时器和延时器都是我们脑海中挥之不去的一个光点


rank.js中:


```javascript
onReady: function() {
    let run = true
    const self = this
    let t =0
    let awaits = setInterval(function() {
      console.log(t)
      t++
      if(t == 10) {
        clearInterval(awaits)
      }
      const shareInfo = app.globalData.shareInfo
      if (shareInfo && self.data.sessionId) {
        run = false
        if (!run) {
          clearInterval(awaits)
        }
        const {
          encryptedData,
          iv
        } = shareInfo
        const {
          sessionId
        } = self.data
        const params = {
          encryptedData: shareInfo.encryptedData,
          iv: shareInfo.iv,
          sessionId
        }
        requestOpenidGid(params).then(res => {
          const {
            opengid
          } = res
          app.globalData.opengid = opengid
          wx.setStorageSync('opengid', opengid)
          self.setData({
            opengid: opengid
          }, () => {
            self.fetchData()
          })
        })
      }
    }, 1000)
    if (!run) {
      clearInterval(awaits)
    }
  },
```


如果获取不到那就用定时器去查询，直到拿到为止！嘿！还真别说，这么简单粗暴的方式居然做到了！


但是这个代码也太笨了些，也极其不优雅！有没有别的方式可以呢？怎么不能像vue那样可以响应式的的到数据呢....咦！vue！vue的watch！

所以，这边可以告诉您，有的呢，亲！


vue使用Object.defineProperty劫持数据，将data递归地转换getter和setter，同时向每一个数据属性都注入一个观察者或者说发布订阅者，从而实现所谓响应式数据。vue显然可以做到，且vue也有一个由美团提供的mpvue小程序开发框架，那不如直接转向mpvue吧！开玩笑，只差最后一个bug了，抛弃是不可能抛弃，代价也付不起，既然知道时Object.defineProperty就可以实现，拿不如自己实现一个吧


## 实现watcher
监听器的原理，将data中需监听的属性写在watch对象中，并给其提供一个方法，当被监听属性的值改变时，调用该方法。​​


[参考](https://blog.csdn.net/xuyangxinlei/article/details/81408200)

在app.js中或者utils/中封装watcher也可以，我直接在app.js中开始了

```javascript
/**
 * [setWatcher 设置监听器]
 * @method    setWatcher
 * @Author    beyondouyuan
 * @date      2019-03-20
 * @DateTime  2019-03-20T00:25:34+0800
 * @copyright All                  Rights Reserved      beyondouyuan
 * @version   1.0.0
 * @param     {[type]}                 page   [description]
 */
setWatcher(page) {
  let data = page.data;
  let watch = page.watch;
  Object.keys(watch).forEach(v => {
    let key = v.split('.'); // 将watch中的属性以'.'切分成数组
    let nowData = data; // 将data赋值给nowData
    for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
      nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
    }
    let lastKey = key[key.length - 1];
    // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
    let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
    let deep = watch[v].deep; // 若未设置deep,则为undefine
    this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
  })
}
/**
 * [observe  监听属性 并执行监听函数]
 * @method    observe
 * @Author    beyondouyuan
 * @date      2019-03-20
 * @DateTime  2019-03-20T00:25:58+0800
 * @copyright All                  Rights   Reserved      beyondouyuan
 * @version   1.0.0
 * @param     {[type]}                 obj      [description]
 * @param     {[type]}                 key      [description]
 * @param     {[type]}                 watchFun [description]
 * @param     {[type]}                 deep     [description]
 * @param     {[type]}                 page     [description]
 * @return    {[type]}                          [description]
 */
observe(obj, key, watchFun, deep, page) {
  var val = obj[key];
  // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
  if (deep && val != null && typeof val === 'object') {
    Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
      this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
    })
  }
  var that = this;
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set: function(value) {
      // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
      watchFun.call(page, value, val); // value是新值，val是旧值
      val = value;
      if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
        that.observe(obj, key, watchFun, deep, page);
      }
    },
    get: function() {
      return val;
    }
  })
}

```

rank.js中

```javascript
data: {
  opengid: globalData['opengid']
}
onLoad() {
    // 将页面注入到setWatcher中
    getApp().setWatcher(this)
  },
watch: {
    opengid(newVal, oldVal) {
        console.log('111::', newVal)
    }
}

```


哔哔哔，大功告成！

