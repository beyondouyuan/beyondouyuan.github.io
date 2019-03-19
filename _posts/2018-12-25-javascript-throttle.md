---
layout: post
title: 防抖动与节流函数实战
author: beyondouyuan
date: 2018-11-20
categories: blog
tags: [JavaScript]
javascript: javascript
description: 思悠悠，恨悠悠，恨到归时方始休。月明人倚楼。
---

## 写在前面

在前端页面上，常常需要对一些事件出处理，例如，视窗滚动时，做一些坏坏坏的事情，比如scroll时上报日志到服务器！好吧，其实还是项目需求，在用户华东屏幕到下一屏时做记录，即相当于用户翻页一次上报一次到服务器，记录用户翻页浏览到哪里了...

## 需求以及解决方案

但凡有一点经验的前端都知道，页面滚动或者说视窗滚动是一个高频触发的事件，对性能开销其实还是挺大，而且，即便不考虑性能开销，我们也不可能在每一次滚动都做处理。所以，我们希望可以优化视窗滚动时的处理事件，不想每一次都出发或者都处理，那就定时器吧！


## 节流

节流是我们常常使用的一个解决方案


所谓节流，就是提供一个阀门来控制事件


### Throttle 第一个人说了算

- throttle的主要思想在于：在某段时间内，不管你触发了多少次回调，都只认第一次，并在计时结束时给予响应
- 所谓的“节流”，是通过在一段时间内无视后来产生的回调请求来实现的。期间不管你注入了多少个事件，我都会无视你
- 每当用户触发了一次 scroll 事件，我们就为这个触发操作开启计时器。一段时间内，后续所有的 scroll 事件都会被当作“参赛者吃东西——它们无法触发新的 scroll 回调。直到“一段时间”到了，第一次触发的 scroll 事件对应的回调才会执行，而“一段时间内”触发的后续的 scroll 回调都会被节流阀无视掉。


```javascript

// handler是我们需要包装的事件回调, interval是时间间隔的阈值
function throttle(handler, interval) {
  // last为上一次触发回调的时间
  let starTime = 0
  
  // 将throttle处理结果当作函数返回
  return function () {
      // 保留调用时的this上下文
      let context = this
      // 保留调用时传入的参数
      let args = arguments
      // 记录本次触发回调的时间
      let endTime = +new Date()
      
      // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
      if (endTime - starTime >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
          starTime = endTime;
          handler.apply(context, args);
      }
    }
}

// 用throttle来包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)
```
## 防抖

防抖即是为了防止高频触发，造成队列抖动而提供的解决方案

### Debounce： 最后一个说了算

- 防抖的主要思想在于：我会等你到底。在某段时间内，不管你触发了多少次回调，我都只认最后一次。
- 而在此前的所有队列都将被清空
- Debounce的关键是清理定时器

```javascript
// handler是我们需要包装的事件回调, delay是每次推迟执行的等待时间
function debounce(handler, delay) {
  // 定时器
  let timer = null
  
  // 将debounce处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments

    // 每次事件被触发时，都去清除之前的旧定时器
    if(timer) {
        clearTimeout(timer)
    }
    // 设立新定时器
    timer = setTimeout(function () {
      handler.apply(context, args)
    }, delay)
  }
}

// 用debounce来包装scroll的回调
const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)

```

可见，防抖和节流都是可以满足我们的需求的，但是，他们两个都太霸道了，能不能中庸一点呢，在一定时间段内，如果有事件就排队，如果没有就立刻执行？


亲，有的呢！

- debounce 的问题在于它“太有耐心了”。试想，如果用户的操作十分频繁——他每次都不等 debounce 设置的 delay 时间结束就进行下一次操作，于是每次 debounce 都为该用户重新生成定时器，回调函数被延迟了不计其数次。频繁的延迟会导致用户迟迟得不到响应，用户同样会产生“这个页面卡死了”的观感。
- 为了避免弄巧成拙，我们需要借力 throttle 的思想，打造一个“有底线”的 debounce——等你可以，但我有我的原则：delay 时间内，我可以为你重新生成定时器；但只要delay的时间到了，我必须要给用户一个响应。这个 throttle 与 debounce “合体”思路，已经被很多成熟的前端库应用到了它们的加强版 throttle 函数的实现中：

```javascript
function throttling(handler, wait, delay) {
    let timeout = null,
        startTime = Date.parse(new Date);
    return function() {
        const context = this
        if(timeout !== null) clearTimeout(timeout);
        let curTime = Date.parse(new Date);
        if(curTime-startTime >= delay) { // 时间差>=delay秒直接执行
            handler,apply(context, arguments);
            startTime = curTime;
        } else { //否则延时执行，像滚动了一下，差值<1秒的那种也要执行
            timeout = setTimeout(() => {
                handler.apply(context, arguments)
            }, wait);
        }
    }
}
function handle() {
    console.log('hello')
}
// 监听
window.addEventListener('scroll', throttling(handle, 1000, 2000));
```
或者是这样的

```javascript
// handler是我们需要包装的事件回调, delay是时间间隔的阈值
function throttle(handler, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let startTime = 0, timer = null
  // 将throttle处理结果当作函数返回
  
  return function () { 
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let endTime = +new Date()
    
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (endTime - startTime < delay) {
    // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
       clearTimeout(timer)
       timer = setTimeout(function () {
          startTime = endTime
          handler.apply(context, args)
        }, delay)
    } else {
        // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
        startTime = endTime
        handler.apply(context, args)
    }
  }
}

// 用新的throttle包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)
```
