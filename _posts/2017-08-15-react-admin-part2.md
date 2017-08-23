---
layout: post
title: React全家桶之后台管理系统（中）
author: beyondouyuan
date: 2017-08-15
categories: blog
tags: [React]
react: react
description: 一寸柔肠情几许？薄衾孤枕，梦回人静。侵晓潇潇雨。
---

###  写在前面 ###

上一篇，初步的增删改查功能已完成！

### 关联

我们只是完成了一个简单的球员数据录入，然后，这也太单调了一些，一个球员本身不可能是一个单一的球员，总还有点相关性的--比如，荣誉。

每一个球员都会去到各自的荣誉，我们在db.json中也有一个honor对象，它应当与球员一一对应。我们需要将两者关联起来。
