---
layout: page
title: "Html/Css"
author: "beyondouyuan"
description: "深院静，小庭空。断续寒砧断续风。"
header-img: "img/tw_lan.jpg"
---


<center>
    <p><img src="https://beyondouyuan.github.io/img/ouyuan.jpg" align="center"></p>
</center>


### 你们是虫子 ###

<!-- 文章列表 -->
<ul class="listing">
{% for post in site.posts %}
  {% if post.htmlcss %}
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