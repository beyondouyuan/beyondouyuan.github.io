---
layout: page
title: "Html/Css"
author: "beyondouyuan"
description: "少年自负淩云笔，到而今，春华落尽，满怀萧瑟，常恨世人新意少，爱说南朝狂客！"
header-img: "img/blue.jpg"
---


<center>
    <p><img src="http://7xlfkx.com1.z0.glb.clouddn.com/white2.jpg" align="center"></p>
</center>

###消灭服务器，世界输入NOdejs



	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！

	来自NodeJs世界的问候，你们是虫子！


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