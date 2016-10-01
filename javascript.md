---
layout: page
title: "Javascript"
author: "beyondouyuan"
description: "少年自负淩云笔，到而今，春华落尽，满怀萧瑟，常恨世人新意少，爱说南朝狂客！"
header-img: "img/zhihu.jpg"
---


<center>
    <p><img src="http://7xlfkx.com1.z0.glb.clouddn.com/white2.jpg" align="center"></p>
</center>


<!-- ###代表作：


- [《世界并非如你所见——用可供性来发现更大的世界》](http://www.jianshu.com/p/6f1404e0240d)

- [《如何正确地练习写作》](http://www.jianshu.com/p/2621444b619d)

- [《24款最值得推荐的中文字体》](http://cnfeat.com/blog/2015/05/22/a-24-chinese-fonts/) -->

### 2016/10/01 文章 ###

- [《Javascript初成长》](https://beyondouyuan.github.io/blog/2016/10/01/javascript-study-part1/)

Javascrip是一种具有面向对象能力的、解释性的程序设计语言，更具体一点，他是基于对象和事件驱动并具有相对安全性的客户端脚本语言。


- [《Javascript初成长》](https://beyondouyuan.github.io/blog/2016/10/01/javascript-study-part1/)

Javascrip是一种具有面向对象能力的、解释性的程序设计语言，更具体一点，他是基于对象和事件驱动并具有相对安全性的客户端脚本语言。

<!-- <div id='tag_cloud'>
{% for tag in site.tags %}
<a href="#{{ tag[0] }}" title="{{ tag[0] }}" rel="{{ tag[1].size }}">{{ tag[0] }}</a>
{% endfor %}
</div> -->

<div id='tag_cloud'>
<a href="#" title="" rel="">{{ post.title }}</a>
</div>

<ul class="listing">
{% for tag in site.tags %}
  <li class="listing-seperator" id="{{ tag[0] }}">{{ tag[0] }}</li>
{% for post in tag[1] %}
  <li class="listing-item">
  <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
  <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
{% endfor %}
</ul>

<script src="/media/js/jquery.tagcloud.js" type="text/javascript" charset="utf-8"></script> 
<script language="javascript">
$.fn.tagcloud.defaults = {
    size: {start: 1, end: 1, unit: 'em'},
      color: {start: '#f8e0e6', end: '#ff3333'}
};

$(function () {
    $('#tag_cloud a').tagcloud();
});
</script>



