---
layout: page
title: "Javascript"
author: "beyondouyuan"
description: "北风有佳人，绝世而独立。一顾倾人城，再顾倾人国"
header-img: "img/zhihu.jpg"
---


<center>
    <p><img src="http://7xlfkx.com1.z0.glb.clouddn.com/white2.jpg" align="center"></p>
</center>


<!-- ###代表作：


- [《世界并非如你所见——用可供性来发现更大的世界》](http://www.jianshu.com/p/6f1404e0240d)

- [《如何正确地练习写作》](http://www.jianshu.com/p/2621444b619d)

- [《24款最值得推荐的中文字体》](http://cnfeat.com/blog/2015/05/22/a-24-chinese-fonts/) -->

<!-- ### 2016/10/01 文章 ### -->

<!-- - [《Javascript初成长》](https://beyondouyuan.github.io/blog/2016/10/01/javascript-study-part1/)

Javascrip是一种具有面向对象能力的、解释性的程序设计语言，更具体一点，他是基于对象和事件驱动并具有相对安全性的客户端脚本语言。 -->


<!-- 文章列表 -->
<ul class="listing">
{% for post in site.posts %}
  {% if post.javascript %}
  <!-- 时间轴标记 -->
  	{% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
	  {% if year != y %}
	    {% assign year = y %}
	    <li class="listing-seperator">{{ y }}  文章列表</li>
	  {% endif %}
	  <li class="listing-item">
	  <!-- 时间轴-标题 -->
	    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
	    <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
	  </li>
	  <!-- 内容预览 -->
	  <div class="post-content-preview">
            {{ post.content | strip_html | truncate:150 }}
      </div>
  {% endif %}
{% endfor %}
</ul>