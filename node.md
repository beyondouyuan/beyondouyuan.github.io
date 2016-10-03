---
layout: page
title: "NodeJs"
author: "beyondouyuan"
description: "墙里秋千墙外道，墙外行人墙里佳人笑。笑渐不问声渐消，多情却被无情恼。"
header-img: "img/green.jpg"
---


<center>
    <p><img src="http://7xlfkx.com1.z0.glb.clouddn.com/white2.jpg" align="center"></p>
</center>

### 毁灭你，与你何干 ###


<!-- - [《NodeJs初成长》](https://beyondouyuan.github.io/blog/2016/09/30/nodejs-study-part1/) -->


<!-- 文章列表 -->
<ul class="listing">
{% for post in site.posts %}
<!-- 若含有node标签，则遍历初node的所有文章 -->
  {% if post.node %}
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