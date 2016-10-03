---
layout: page
title: "ReactJs"
author: "beyondouyuan"
description: "蝴蝶儿，晚春时，阿娇初着淡黄衣。倚窗学画伊。 "
header-img: "img/blue.jpg"
---


<!-- <center>
    <p><img src="http://7xlfkx.com1.z0.glb.clouddn.com/white2.jpg" align="center"></p>
</center> -->

<!-- 我是beyondouyuan，每天千字践行者，践行时间：2014年02月10日至2015年02月23日，感谢这段经历，让我成为了现在的我。

现在研习 **认知写作学** 。

###坚信


- 元认知乃一切之源
- 学苟知本，六经皆我注脚 
- 一切技能皆可习得，包括写作
- 「持续」并不是坚持，写就是最好的回报


###关注：


- [元认知](http://www.mesule.com/)
- 写作
- Python
- [阳志平](http://www.yangzhiping.com/)
- [ZoomQuiet](http://blog.zoomquiet.io/)




###代表作：

- [《24款最值得推荐的中文字体》](http://cnfeat.com/blog/2015/05/22/a-24-chinese-fonts/)

- [《世界并非如你所见——用可供性来发现更大的世界》](http://cnfeat.com/blog/2015/05/01/affordance/)

- [《如何正确地练习写作》](http://cnfeat.com/blog/2015/03/02/how-to-write/)


###我的朋友们

- [YiLee](http://yilee.me)
- [Caos](http://caos.me)
- [BuzhiNote](http://BuzhiNote.com)
- [Azeril](http://azeril.me)

###联系

- [博客：beyondouyuan.github.io](beyondouyuan.github.io)

- [微博@小欧小媛小](http://weibo.com/207775270)

- [知乎@欧元](http://www.zhihu.com/people/Feat)

- [知乎专栏](http://zhuanlan.zhihu.com/cnfeat)

- 公众号：cnfeat

 -->
<center>
    <p><img src="http://i173.photobucket.com/albums/w63/cnfeat/2015-08-29-2_zpsqj7po8eo.png" align="center"></p>
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


