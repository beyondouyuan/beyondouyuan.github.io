---
layout: page
title: "NODEJS"
author: "beyondouyuan"
description: "墙里秋千墙外道，墙外行人墙里佳人笑。笑渐不问声渐消，多情却被无情恼。"
header-img: "img/green.jpg"
---


<center>
    <p><img src="https://beyondouyuan.github.io/img/ouyuan.jpg" align="center"></p>
</center>


<!-- 文章列表 -->
<ul class="listing">
{% for post in site.posts %}
<!-- 若含有node标签，则遍历初node的所有文章 -->
  {% if post.node %}
  <!-- 时间轴标记 -->
  	{% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
	  {% if year != y %}
	    {% assign year = y %}
	    <li class="listing-seperator list-item">{{ y }}  文章列表</li>
	  {% endif %}
	  <li class="listing-item list-item">
	  <!-- 时间轴-标题 -->
	    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
	    <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
	  </li>
	  <!-- 内容预览 -->
	  <div class="post-content-preview content-box">
            {{ post.content | strip_html | truncate:150 }}
      </div>
  {% endif %}
{% endfor %}
</ul>