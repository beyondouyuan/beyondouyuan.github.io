---
layout: post
title: 无缝轮播js-carousel
author: beyondouyuan
date: 2017-08-04
categories: blog
tags: [JavaScript]
javascript: javascript
description: 试问闲愁都几许！一川烟草，满城风絮，梅子黄时雨

---

### 写在前面 ###

无论是首页的的banner还是一些广告，常常需要的轮播，晚上有不少优秀的轮播的插件，轮播实现的方式可以有很多种，此处便以最渐渐的方式也来写一个轮播。

#### HTML结构

结构尽量简化，语义化与否不重要，重要的是原理以及思路

- 外层容器container
- 图片列表list
- 图片img
- 焦点容器，焦点项目根据图片数量动态生成
- 左右控制箭头

### HTML

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>carousel</title>
        <meta name="description" content="">
        <meta name="keywords" content="">
        <link href="styles/auto.css" rel="stylesheet">
    </head>

    <body>
        <section id="auto-play">
            <!-- container -->
            <div id="container" class="container">
                <!-- list -->
                <div id="list" class="list">
                    <img src="images/bank_serve_5.jpg" alt="5">
                    <img src="images/bank_serve_1.jpg" alt="1">
                    <img src="images/bank_serve_2.jpg" alt="2">
                    <img src="images/bank_serve_3.jpg" alt="3">
                    <img src="images/bank_serve_4.jpg" alt="4">
                    <img src="images/bank_serve_5.jpg" alt="5">
                    <img src="images/bank_serve_1.jpg" alt="1">
                </div>
                <!-- buttons -->
                <div id="buttons" class="buttons">
                </div>
                <!-- prev -->
                <a href="javascript:;" class="arrow prev" id="prev">&lt;</a>
                <!-- next -->
                <a href="javascript:;" class="arrow next" id="next">&gt;</a>
            </div>
        </section>
        <script src="scripts/auto.js"></script>
    </body>

    </html>


#### CSS部分

css写在auto.css样式表，样式也如HTML结构一般，一目了然。
- 最外层容器相对定位，
- 图片列表容器绝对定位，
- js修改图片容器的left属性，即可实现无缝轮播，
- css中不需设定固定的样式，样式也同样在js中计算，以达到响应式效果。




    html,
    body {
        font-size: 100px;
    }

    a {
        text-decoration: none
    }

    .container {
        /* 自适应样式 */
        /* width: 100%; */
        width: 50%;
        margin: 0 auto;
        /* 高度初始值 可以设置也可以去掉 */
        /* height: 2.87rem; */
        border: none;
        overflow: hidden;
        position: relative;
    }

    .list {
        position: absolute;
        z-index: 1;
        /* 添加过度属性 */
        transition: all 1.5s
    }
    .list img {
        float: left;
        /* 自适应宽度 */
        width: 100%;
        /* 高度初始值设置auto 则为图片原始值高度 100%则为容器高度，同样可以不设置 为保持兼容性 设置为佳 */
        /* height: auto; */
        max-width: 100%;
    }

    .buttons {
        position: absolute;
        overflow: hidden;
        bottom: 2%;
        left: 50%;
        transform: translateX(-50%);
        height: 20px;
        line-height: 20px;
        text-align: center;
        z-index: 100;
    }

    .buttons span {
        cursor: pointer;
        float: left;
        /* display: inline-block; */
        border: 1px solid #fff;
        width: 12px;
        height: 12px;
        margin-right: 5px;
        border-radius: 50%;
        background-color: #333;
    }

    .buttons .on {
        background-color: orangered
    }

    .arrow {
        cursor: pointer;
        display: none;
        color: #fff;
        text-align: center;
        font-weight: bold;
        position: absolute;
        /* 垂直居中 */
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        line-height: 50px;
        border-radius: 50%;
        font-size: 42px;
        /* 不垂直居中 占满高度 */
        /* width: .6rem;
        font-size: .6rem;
        height: 100%;
        vertical-align: middle; */
        background-color: rgba(0, 0, 0, .4);
        z-index: 2;
    }

    .arrow:hover {
        background-color: rgba(0, 0, 0, .7);
    }
    .container:hover .arrow {
        display: block;
    }

    .prev {
        left: 2%;
        /* left: 0; */
    }

    .next {
        right: 2%
        /* right: 0; */
    }

#### JS路基

即便写了博客笔记，个人还是习惯于代码中的参数注释或者功能说明。

- 1.动态获取视窗以及可见容器宽度，计算设置图片列表以及图片宽度等，以实现响应式
- 2.根据图片实际数量，动态生成焦点元素
- 3.首先实现按钮控制逻辑prev、next
- 4.左右按钮也即上一张下一张逻辑相似甚至相同，唯二不同的两个地方在于控制图片当前索引参数index以及图片列表偏移量，故将两个按钮的具体夜幕封装为一个animate函数
- 5.无缝轮播的逻辑根据左右按钮修改index，判断偏移量是否达到边缘，达到，则index以及left归位，否则，index以及left自增自减
- 6.index作为激活项索引，设置对应索引焦点跟随激活
- 7.遍历焦点，添加点击监听事件，出发图片轮播，并修改当前激活索引index
- 8.设置定时器
- 9.执行定时器，实现自动轮播
- 10.监听屏幕尺寸事件，重新获取容器宽高属性，实现响应式效果




    var playOptions = {
        containerID: 'container',
        list: 'list',
        buttons: 'buttons',
        prev: 'prev',
        next: 'next',
        timer: null
    };

    // var timer;

    window.onload = function() {
        carousel(playOptions, 10);
    };

    window.onresize = function() {
        clearTimeout(playOptions.timer);
        carousel(playOptions, 10);
    };

    function carousel(option, interval) {
        var $ = function(ele) {
            return document.getElementById(ele);
        };
        // 容器参数
        var container = $(option.containerID);
        var list = $(option.list),
            buttons = $(option.buttons),
            prev = $(option.prev),
            next = $(option.next);
        // 动画参数
        var animated = false,
            index = 1;
        // 图片参数
        var img = list.getElementsByTagName('img'),
            len = img.length;
            // width = parseInt((img[0].width)),
            // height = parseInt((img[0].height));
        var width,
            height;
        // 初始化容器大小

        function init() {
            container.style.width = width + 'px';
            container.style.height = height + 'px';
            list.style.width = width * len * 2 + 'px';
            list.style.height = height + 'px';
        }
        // init();
        // 或者根据最外层容器代谢哦啊自适应的设置图片大小
        function responseInit() {
            width = container.offsetWidth;
            height = parseInt((img[0].height));
            // 宽度睡视窗自适应
            list.style.left = -width + 'px';
            list.style.width = width * len + 'px';
            // 高度睡图片自适应
            container.style.height = height + 'px';
            list.style.height = height + 'px';
            for (var i = 0; i < len; i++) {
                img[i].style.width = parseInt(width) + 'px';
            }
        }
        responseInit();
        // 实际图片数量
        var size = parseInt(len - 2);
        // 创建dom片段
        var btns = document.createDocumentFragment();
        // 动态生成焦点按钮
        for (var i = 0; i < size; i++) {
            var span = document.createElement('span');
            span.setAttribute('index', (i + 1));
            if (i == 0) {
                span.className = 'on';
            }
            btns.appendChild(span);
        }
        // 清理焦点按钮
        buttons.innerHTML = '';
        buttons.appendChild(btns);
        // 上一页
        prev.onclick = function() {
            // 焦点跟随
            if (!animated) {
                if (index == 1) {
                    // 当焦点位于第一个span时，跳转至最后一个
                    index = size;
                } else {
                    index -= 1;
                }
                showButtons();
                animate(width);
            }
        };

        // 下一页
        next.onclick = function() {
            if (!animated) {
                if (index == size) {
                    // 当焦点位于最后一个span时，跳转至第1个
                    index = 1;
                } else {
                    index += 1;
                }
                showButtons();
                animate(-width);
            }
        };

        // 封装一个动画函数
        function animate(offset) {
            var time = 1000;
            var speed = offset / (time / interval);
            // 处于动画状态
            animated = true;
            var newLeft = parseInt(list.style.left) + offset;

            function go() {
                if ((speed > 0 && parseInt(list.style.left < newLeft) || speed < 0 && parseInt(list.style.left < newLeft))) {
                    list.style.left = parseInt(list.style.left) + speed + 'px';
                    // 递归
                    setTimeout(go, interval);
                } else {
                    animated = false;
                    list.style.left = newLeft + 'px';
                    if (newLeft > -width) {
                        list.style.left = -(width * size) + 'px';
                    }
                    if (newLeft < -(width * size)) {
                        list.style.left = -width + 'px';
                    }
                }
            }
            go();
        }
        // 焦点跟随激活
        var btn = buttons.getElementsByTagName('span');

        function showButtons() {
            for (var i = 0; i < btn.length; i++) {
                btn[i].className = '';
            }
            btn[index - 1].className = 'on';
        }

        // 点击焦点切换
        for (var i = 0; i < btn.length; i++) {
            btn[i].onclick = function() {
                // 点击当前激活项不做动画操作
                if (this.className == 'on') {
                    return;
                }
                // 点击焦点的索引
                var clickIndex = parseInt(this.getAttribute('index'));
                // 偏移量
                var offset = -width * (clickIndex - index);
                if (!animated) {
                    animate(offset);
                }
                // 修改当前激活项
                index = clickIndex;
                // 焦点跟随
                showButtons();
            };
        }

        // 自动循环播放
        function play() {
            option.timer = setInterval(function() {
                // 模拟点击事件
                next.onclick();
            }, interval * 500);
        }

        // 停止播放
        function stop() {
            clearTimeout(option.timer);
        }
        // 执行自动播放
        play();
        // 鼠标事件
        container.onmouseover = stop;

        container.onmouseout = play;

        window.addEventListener('resize', responseInit, false);
    }


### 轮播二
轮播一实际上是循环轮播，
修改js逻辑，实现视觉上无缝熏昏轮播，关键在于到达边缘时的逻辑控制：

- 首先边缘多出的一张继续以过度的形式轮播，
- 通过定时器延时（延时时间为动画过度的时间）重新定位到初始状态


    function carousel(option, interval) {
        var $ = function(ele) {
            return document.getElementById(ele);
        };
        // 容器参数
        var container = $(option.containerID);
        var list = $(option.list),
            buttons = $(option.buttons),
            prev = $(option.prev),
            next = $(option.next);
        // 动画参数
        var animated = false,
            index = 1;
        // 图片参数
        var img = list.getElementsByTagName('img'),
            len = img.length;
        // width = parseInt((img[0].width)),
        // height = parseInt((img[0].height));
        var width,
            height;
        // 初始化容器大小

        function init() {
            container.style.width = width + 'px';
            container.style.height = height + 'px';
            list.style.width = width * len * 2 + 'px';
            list.style.height = height + 'px';
        }
        // init();
        // 或者根据最外层容器代谢哦啊自适应的设置图片大小
        function responseInit() {
            width = container.offsetWidth;
            height = parseInt((img[0].height));
            // 宽度睡视窗自适应
            list.style.left = -width + 'px';
            list.style.width = width * len + 'px';
            // 高度睡图片自适应
            container.style.height = height + 'px';
            list.style.height = height + 'px';
            for (var i = 0; i < len; i++) {
                img[i].style.width = parseInt(width) + 'px';
            }
        }
        responseInit();
        // 实际图片数量
        var size = parseInt(len - 2);
        // 创建dom片段
        var btns = document.createDocumentFragment();
        // 动态生成焦点按钮
        for (var i = 0; i < size; i++) {
            var span = document.createElement('span');
            span.setAttribute('index', (i + 1));
            if (i == 0) {
                span.className = 'on';
            }
            btns.appendChild(span);
        }
        // 清理焦点按钮
        buttons.innerHTML = '';
        buttons.appendChild(btns);
        // 上一页
        prev.onclick = function() {
            // 焦点跟随
            if (!animated) {
                if (index == 1) {
                    // 当焦点位于第一个span时，跳转至最后一个
                    index = size;
                } else {
                    index -= 1;
                }
                showButtons();
                animate(width);
            }
        };

        // 下一页
        next.onclick = function() {
            if (!animated) {
                if (index == size) {
                    // 当焦点位于最后一个span时，跳转至第1个
                    index = 1;
                } else {
                    index += 1;
                }
                showButtons();
                animate(-width);
            }
        };

        // 封装一个动画函数
        function animate(offset) {
            var time = 1000;
            var speed = offset / (time / interval);
            // 处于动画状态
            animated = true;
            var newLeft = parseInt(list.style.left) + offset;
            // 做到边缘时重新无过度实行定位，弹道循环无缝的视觉效果
            function resetImg(index) {
                animated = true;
                list.style.left = -(width * index) + 'px';
                list.style.transition = 'all 0s';
                animated = false;
            }
            function go() {
                if ((speed > 0 && parseInt(list.style.left < newLeft) || speed < 0 && parseInt(list.style.left < newLeft))) {
                    list.style.left = parseInt(list.style.left) + speed + 'px';
                    // 递归
                    setTimeout(go, interval);
                } else {
                    animated = false;
                    // 重新设置过度属性
                    list.style.transition = 'all 1.5s';
                    list.style.left = newLeft + 'px';
                    // 左边缘
                    if (newLeft > -width) {
                        // 先有过度地完成动画动作 然后再无过度的重新定位，时间间隔为刚好等于动画transition时间
                        setTimeout(function() {
                            resetImg(size);
                        }, 1500);
                    }
                    // 右边缘
                    if (newLeft <= -(width * (size + 1))) {
                        setTimeout(function() {
                            resetImg(1);
                        }, 1500);
                    }
                }
            }
            go();
        }
        // 焦点跟随激活
        var btn = buttons.getElementsByTagName('span');

        function showButtons() {
            for (var i = 0; i < btn.length; i++) {
                btn[i].className = '';
            }
            btn[index - 1].className = 'on';
        }

        // 点击焦点切换
        for (var i = 0; i < btn.length; i++) {
            btn[i].onclick = function() {
                // 点击当前激活项不做动画操作
                if (this.className == 'on') {
                    return;
                }
                // 点击焦点的索引
                var clickIndex = parseInt(this.getAttribute('index'));
                // 偏移量
                var offset = -width * (clickIndex - index);
                if (!animated) {
                    animate(offset);
                }
                // 修改当前激活项
                index = clickIndex;
                // 焦点跟随
                showButtons();
            };
        }

        // 自动循环播放
        function play() {
            option.timer = setInterval(function() {
                // 模拟点击事件
                next.onclick();
            }, interval * 500);
        }

        // 停止播放
        function stop() {
            clearTimeout(option.timer);
        }
        // 执行自动播放
        play();
        // 鼠标事件
        container.onmouseover = stop;

        container.onmouseout = play;

        window.addEventListener('resize', responseInit, false);
    }
