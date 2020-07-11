---
layout: page
title: "JavaScript"
author: "beyondouyuan"
description: "北方有佳人，绝世而独立。一顾倾人城，再顾倾人国。宁不知倾城与倾国，佳人难再得。"
header-img: "img/zhihu.jpg"
---


<center>
    <p><img src="https://beyondouyuan.github.io/img/ouyuan.jpg" align="center"></p>
</center>



<!-- 文章列表 -->
<ul class="listing">
{% for post in site.posts %}
  {% if post.javascript %}
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