---
layout: post
title: 常用dom-js
author: beyondouyuan
date: 2017-08-04
categories: blog
tags: [JavaScript]
javascript: javascript
description: 闺中少妇不知愁，春日凝妆上翠楼。忽见陌头杨柳色，悔教夫婿觅封侯。

---


### 写在前面 ###

转眼已是一年，I'm back！

### 为什么封装自己的js方法 ###

jquery已经为前端开发者提供的大量经过封装的api，将劳苦大众从繁杂的js兼容中解救出来，所以也难怪jquery曾经风靡一时，但，我们也许并不需要时时刻刻都需要引入jquery到我们的项目中去，比如，很多时候也只是用到其中的几个封装的方法而已，我们大可以自己封装一些常用的分发，减轻项目代码量的负担。


### dom相关 ###

废话太多了，直接上自己总结以及社区借鉴收藏的一些常用dom-js

#### 去除字符串空格

    // 使用正则表达式匹配出空格符即可
    function trim(str, type) {
        /*
         * @param type
         * @type : 1-所有空格 2-前后空格 3-前空格 4-后空格
         **/
        switch (type) {
            case 1:
                return str.replace(/\s+/g, "");
            case 2:
                return str.replace(/(^\s*)|(\s*$)/g, "");
            case 3:
                return str.replace(/(^\s*)/g, "");
            case 4:
                return str.replace(/(^\s*$)/g, "");
            default:
                return str;
        }
    }


#### 字母大小写切换

    function changeCase(str, type) {
        /*
         * @param type
         * @type
         * 1: 首字母大写
         * 2: 首字母小写
         * 3: 大小写转换
         * 4: 全部大写
         * 5: 全部小写
         **/
        function toggleCase(str) {
            let itemText = "";
            str.split("").forEach(item => {
                if (/^([a-z]+)/.test(item)) {
                    itemText += item.toUpperCase()
                } else if (/^([A-Z]+)/.test(item)) {
                    itemText += item.toLowerCase();
                } else {
                    itemText += item;
                }
            });
            return itemText;
        }

        switch (type) {
            case 1:
                return str.replace(/^(\w)(\w+)/, (v, v1, v2) => {
                    return v1.toUpperCase() + v2.toLowerCase();
                });
            case 2:
                return str.replace(/^(\w)(\w+)/, (v, v1, v2) => {
                    return v1.toLowerCase() + v2.toUpperCase();
                });
            case 3:
                return toggleCase(str);
            case 4:
                return str.toUpperCase();
            case 5:
                return str.toLowerCase();
            default:
                return str;
        }
    }


#### 字符串循环复制

    function repeatString(str, count) {
        /*
         * @param count
         * @count 循环次数
         **/

        let text = "";
        for (let i = 0; i < count; i++) {
            text += str;
        }
        return text;
    }


#### 字符串替换

    function replaceAll(str, targetStr, RepStr) {
        /*
         * @param str, targetStr, RepStr
         * @str 字符串
         * @targetStr 要替换的字符
         * @RepStr 替换成的结果
         **/
        let strRegExp = new RegExp(targetStr, "g");
        return str.replace(strRegExp, RepStr);
    }



#### 检测字符串-表单校验

    function checkType(str, type) {
        /*
         * @param type
         * @type 检测字符类型
         **/

        switch (type) {
            case 'email':
                return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
            case 'phone':
                return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
            case 'tel':
                return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
            case 'number':
                return /^[0-9]$/.test(str);
            case 'english':
                return /^[a-zA-Z]+$/.test(str);
            case 'chinese':
                return /^[\u4E00-\u9FA5]+$/.test(str);
            case 'lowser':
                return /^[a-z]+$/.test(str);
            case 'upper':
                return /^[A-Z]+$/.test(str);
            default:
                return true;
        }
    }


#### 检测密码强度

    function checkPassWord(str) {
        /*
         * @param str
         * @str 检测字符
         **/

        let nowLevel = 0;

        if (str.length < 6) {
            return nowLevel;
        }
        if (/[0-9]/.test(str)) {
            nowLevel++;
        }
        if (/[a-z]/.test(str)) {
            nowLevel++;
        }
        if (/[A-Z]/.test(str)) {
            nowLevel++;
        }
        if (/[\.|-|_]/.test(str)) {
            nowLevel++;
        }
        return nowLevel;
    }

#### 检测对象是否有类名

    function hasClass(targeEle, classStr) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         * @classStr 检测类名
         **/

        let arr = targeEle.className.split(/s+/); // 正则表达式匹配多个类名
        return (arr.indexof(className == -1) ? false : true);
    }

#### 添加类名

    function addClass(targeEle, classStr) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         * @classStr 添加类名
         **/

        if (!this.hasClass(targeEle, classStr)) {
            targetStr.className += " " + classStr;
        }
    }

#### 删除类名

    function removeClass(targeEle, classStr) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         * @classStr 删除类名
         * @replace(target, rep) target: 需要替换的内容 rep: 希望替换成的内容
         **/


        if (this.hasClass(targeEle, classStr)) {
            let reg = new RegExp('(\\s|^)') + classStr + '(\\s|$)'; // 正则表达式匹配需要删除的类名及其两端空格
            targeEle.className = targeEle.className.replace(reg, '');
        }
    }

#### 替换类名

    function toggleClass(targeEle, newClass, oldClass) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         * @newClass 替换后类名
         * @oldClass 替换前类名
         **/

        if (this.hasClass(targeEle, oldClass)) {
            removeClass(targeEle, oldClass);
            addClass(newClass);
        }
    }

#### 获取兄弟节点

    function getSiblings(targeEle) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         **/

        let arr = [] // 空数组用于存放目标对象的兄弟元素
        let p = targeEle.previousSibling; // 目标对象的上一个兄弟节点（哥哥们） p 表示previousSibling

        while (p) {
            if (p.nodeType === 1) {
                arr.push(p);
            }
            p = p.previousSibling; // 将上一个节点赋值给p，依次循环得到目标对象所有的之前的节点
        }
        arr.reverse(); //将数据反转，得到按先后排序的元素
        let n = nextSibling; // 目标元素的下一个兄弟节点（弟弟们）

        while (n) {
            if (n.nodeType === 1) {
                arr.push(n);
            }
            n = n.nextSibling; // 将下一个节点赋值给p，依次循环得到目标对象所有的之后的节点
        }
        return arr;
    }

#### 设置样式

    function css(targeEle, json) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         * @json 样式内容
         **/

        for (let attr in json) {
            targeEle.style[attr] = json[attr];
        }
    }

#### 设置文本内容

    function html(targeEle) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         **/


        if (arguments.length == 0) {
            return this.innerHTML;
        } else if (arguments.length == 1) {
            this.innerHTML = arguments[0];
        }
    }


#### 显示隐藏

    function show(targeEle) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         **/

        targeEle.style.display = "";
    }

    function hide(targeEle) {
        /*
         * @param targeEle
         * @targeEle 目标对象
         **/

        targeEle.style.display = "none";
    }

#### 设置cokkie

    function setCookie(name, value, iDate) {
        /*
         * @param array
         * @name cookie名
         * @value cookie值
         * @iDate 有效期
         **/

        let oDate = new Date();
        oDate.setDate(oDate.getDate() + iDate);
        document.cookie = name + '=' + value + '; expires=' + oDate;
    }

#### 获取cokkie

    function getCookie(name) {
        /*
         * @param name
         * @name cookie名
         **/

        let arr = document.cookie.split('; ');
        const len = arr.length;

        for (let i = 0; i < len; i++) {
            let arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return arr2[1];
            }
        }
        return '';
    }

#### 删除cookie

    function removeCokkie(name) {
        /*
         * @param name
         * @name cookie名
         **/

        setCookie(name, 1, -1);
    }

#### 获取 设置url参数

    function getUrlParam(url) {
        /*
         * @param url
         * @url 目标url
         **/

        url ? url : window.location.href;

        let _param = url.substring(url.indexof('?') + 1),
            _arrString = _param.split('&'),
            _rs = {};
        const len = _arrString.length;
        for (let i = 0; i < len; i++) {
            let pos = _arrString[i].indexof('=');
            if (pos == -1) {
                continue;
            }
            let name = _arrString.substring(0, pos),
                value = window.decodeURIComponent(_arrString.substring(pos + 1));
            _rs[name] = value;
        }
        return _rs;
    }


#### 设置url参数

    function setUrlParam(obj) {
        /*
         * @param obj
         * @obj 目标对象
         **/

        let _rs = [];

        for (let p in obj) {
            if (obj[p] != null && obj[p] != '') {
                _rs.push(p + '=' + obj[p]);
            }
        }

        return _rs.join('&');
    }

#### 倒计时

    function getEndTime(endTime) {
        /*
         * @param endTime
         * @endTime 结束时间
         * @startDate 开始日期
         * @endDate 结束日期
         * @dist 时间差
         **/

        var startDate = new Date();
        var endDate = new Date(endTime);
        var dist = endDate.getTime() - startDate.getTime();
        var date = 0,
            hour = 0,
            mim = 0,
            s = 0;

        if (dist > 0) {
            date = Math.floor(dist / 1000 / 3600 / 24);
            hour = Math.floor(dist / 1000 / 60 / 60 % 24);
            min = Math.floor(dist / 1000 / 60 % 60);
            s = Math.floor(dist / 1000 % 60);
        }

        return "剩余时间" + date + "天" + hour + "小时" + min + "分" + s + "秒";
    }

#### 动态适配REM

    function setFontSize(designSize) {
        /*
         * @param designSize
         * @designSize 设计稿尺寸
         * @resizeEvt 事件
         * @recale 设置字体尺寸函数
         **/

        const doc = document,
            win = window;
        const docEle = doc.documentElement;
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
        recale = function() {
            const clientWidth = docEle.clientWidth;
            if (!clientWidth) {
                return;
            }
            if (clientWidth > designSize) {
                clientWidth = designSize;
                docEle.style.fontSize = 100 * (clientWidth / designSize);
            }
            // 屏幕大小改变 或者横竖屏切换时触发函数
            win.addEventListener(resizeEvt, recale, false);
            // 文档加载完成时触发函数
            doc.addEventListener('DOMContentLoaded', recale, false);
        };
    }

#### 函数节流
    // 指定时间间隔内只会执行一次任务

    var throttle = function(fn, interval) {

        /*
         * @param fn
         * @fn 需要被延时执行的函数
         * @interval 延时时间
         * @_self 保存需要被延时执行的函数
         * @timer 定时器
         * @firstTime 是否第一次调用
         * @_args 缓存变量
         **/

        var _self = fn,
            timer,
            firstTime = true;
        // 返回一个匿名函数 形成闭包，持久化变量
        return function() {
            var _args = arguments,
                _me = this;
            // 若为第一次调用，则无需延迟执行fn
            if(firstTime) {
                _self.apply(_me, _args);
                return firstTime = false;
            }
            // 若定时器还在 说明上一次延迟执行还没有完成
            if (timer) {
                return false;
            }
            // 延迟一段时间执行fn
            timer = setTimeout(function() {
                clearTimeout(timer);
                timer = null;
                _self.apply(_me, _args);
            }, interval || 500);
        }
    };

#### 函数节流2
    // 函数节流即通过闭包保存一个标记(canRun = true)

    function throtting(fn, interval = 500) {
        let canRun = true;
        // 返回一个闭包（匿名函数），该闭包内需要使用到canRun变量，所以即便throtting执行完毕，canRun被闭包保持着应用，依然存在
        return function() {
            if (!canRun) {
                return;
            }
            // 当setTimeout未执行时，canRun始终未false，即延迟执行的任务未完成时始终无法执行下一次任务，即完成节流功能
            canRun = false;
            setTimeout(() => {
                fn.apply(this.arguments);
                // 调用成功后必须重新设置为true 表示可以执行下一次任务
                canRun = true;
            }, interval)
        }
    }


#### 函数防抖
    // 任务频繁触发情况下，只有任务触发的时间间隔超过指定间隔时候才会执行任务

    function debounce(fn, interval, immediate) {
        /*
         * @param fn
         * @fn 需要被延时执行的函数
         * @interval 延时时间
         * @immediate 判断是否立即执行
         * @timeout 定时器
         **/
        var timeout;
        // 返回一个闭包 保持变量的应用
        return function() {
            var context = this,
                args = arguments;
            // 封装稍后执行的代码
            var later = function() {
                // 成功调用后清除定时器
                timeout = null;
                // 不立即执行时才可调用later
                if (!immediate) {
                    fn.apply(context, args);
                }
            };
            // 判断是否立即调用，若定时器存在，则不立即调用
            // 若有timeout存在，则必不是第一次执行
            var callNow = immediate && !timeout;
            // 清除计时器
            clearTimeout(timeout);
            // 延迟执行
            timeout = setTimeout(later, interval);
            // 若为第一次触发且immeditate为true则立即执行
            if (callNow) {
                fn.apply(context, args)
            }
        }
    }

#### 函数防抖2
    // 函数防抖通过返回闭包，保存setTimeout返回值的标记实现防抖

    function debounceing(fn, interval = 500) {
        let timeout = null;
        return function() {
            clearTimeout(timeout);
            timeout= setTimeout(() => {
                // 注意箭头啊哈念书中的this指向不是指向全局
                fn.apply(this,arguments);
            }, interval)
        }
    }



函数节流以及防抖，关键均在于对setTimeout的使用


#### 时间格式化

    function timeTransform(dt) {
        /*
         * @param dt
         * @dt 时间戳
         * @dates 时间戳数值
         * @year 年
         * @month 月
         * @date 日
         **/

        let dates = new Date(dt);
        let year = dates.getFullYear();
        let month = dates.getMonth();
        month = month < 10 ? ('0' + month) : month;
        let date = dates.getDate();
        date = date < 10 ? ('0' + date) : date;
        return year + '-' + month + '-' + date;
    }

#### 插入元素到目标元素之后

    let insertAfter = (newEle, targetEle) => {
        let parentEle = targetEle.parentNode;
        // 若目标元素为其所在父级元素的最后一个字元素，者直接插入到最后
        if (parentEle.lastChild == targetEle) {
            parentEle.appendChild(newEle);
        } else {
            // 否则插入到目标元素的下一个兄弟元素之前
            parentEle.insertBefore(newEle, targetEle.nextSibling)
        }
    };

