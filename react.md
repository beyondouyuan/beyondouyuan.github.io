---
layout: page
title: "ReactJs"
author: "beyondouyuan"
description: "蝴蝶儿，晚春时，阿娇初着淡黄衣。倚窗学画伊。"
header-img: "img/blue.jpg"
---

<center>
    <p><img src="https://beyondouyuan.github.io/img/ouyuan.jpg" align="center"></p>
</center>

### 联系 ###

- [博客@小楼昨夜前端雨](https://beyondouyuan.github.io/)

- [微博@小欧小媛小](http://weibo.com/2331698453)

- [知乎@文小楼](http://www.zhihu.com/people/beyondouyuan)

- 公众号：yihongzuigongzi


<center>
    <p><img src="https://beyondouyuan.github.io/img/wechat.jpg" align="center"></p>
</center>



<!-- 文章列表 -->
<ul class="listing">
{% for post in site.posts %}
  {% if post.react %}
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


