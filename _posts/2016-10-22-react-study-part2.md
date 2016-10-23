---
layout: post
title: React初成长(二)
author: beyondouyuan
date: 2016-10-22
categories: blog
tags: [React]
react: react
description: 牡丹含露真珠颗，美人折向庭前过，含笑问檀郎，花强妾貌强？檀郎故相恼，须道花枝好。一面发娇嗔，碎挼花打人。
---

###  写在前面 ###

I'm back!


### 第一个组件 ###

我们将构建一个评论框，提供以下内容：

1.一个展示所有评论的视图

2.一个提交评论的表单

3.用于构建自定制后台的借口链接(hooks)

同时也会包含一些特性：

- 评论体验优化：评论在保存到服务器之前就展现在评论列表
- 实时更新：其他用户的评论将会实时展示
- markdown格式：用户可以使用MarkDown格式编辑文本


React中全是模块化、可组装的组件，以我们的评论框为例，将有如下组件结构：

    - CommentBox  评论框(container层)
     - CommentList  评论列表(list层)
      - Comment  评论内容(content层)
     - CommentForm  评论表单(form)


接下来，我们将构建我们的组件，不再像教程那样那么麻烦，我们直接采取文件分离的方式进行码代码：

首先构建如下一个html文件：

    <!DOCTYPE html>
    <html>

    <head>
        <title>Hello React</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <script src="build/jquery.min.js"></script>
        <script src="build/react.js"></script>
        <script src="https://cdn.bootcss.com/showdown/1.3.0/showdown.min.js"></script>
    </head>

    <body>
        <div id="content"></div>
        <script src="build/tutorial.js"></script>
    </body>

    </html>


如上结构图：

我们只需引入我们需要的库以及分离的文件tutorial.js。

tutorial.js文件实际上是是在src文件夹上创建的tutorial.js经过文件分离后在build转化为react的解析格式而得。

项目结构如下：

<center>
<p><img src="https://beyondouyuan.github.io/img/react_4.png" align="center"></p>
</center>

    // tutorial.js @version $1.0$

    // 1.CommentBox

    var CommentBox = React.createClass({
        render: function(){
            return (
                <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList />
                    <CommentForm />
                </div>
            );
        }
    });

    // 2.CommentList

    var CommentList = React.createClass({
        render: function(){
            return (
                <div className="commentList">
                    Hi! React! I'm your brother
                </div>
            );
        }
    });

    // 3.CommentForm
    var CommentForm = React.createClass({
        render: function(){
            return (
                <div className="commentForm">
                    Hello,React! I'm your old brother
                </div>
            );
        }
    });



    // React.render()方法要置于底部
    React.render(
        <CommentBox />,
        document.getElementById('content')
    );


以上，

CommentBox实际上就是一个div。

我们通过JavaScript对象传递一些方法到React.createClass()来创建一个新的React组件。其中最重要的方法是render，该方法返回一颗React组件树，这颗组件树最终将会渲染为HTML。

这个*<div>*实际上并不是真实的DOM节点；他们是React div组件的实例。我们没有必要返回基本的HTML，我们可以返回一个自己创建的组件树，这就使得React变得组件化。

>
>
组件化是前端维护的一个原则
>

React.render()实例化根组件，启动框架，注入标记到原始的DOM元素中，作为第一个参数提供。


同样地，CommentList和CommentForm也是一些简单的div。

ok！运行一下我们的html文件，浏览器上看到了什么？

<center>
<p><img src="https://beyondouyuan.github.io/img/react_5.png" align="center"></p>
</center>


没有错，通过浏览器显示的内容以及调试窗口的结构，这就是我们所期待的组件。

#### props传递数据 #### 

这和普通的HTML静态文件其实没什么两样，没什么了不起的，那么来点有趣些的。

我们在创建一个版本的Comment组件，我们想传递给他评论者的名字和评论文本，以便我们可以对每一个独立的评论重用相同的代码。废话不多说，直接上代码：


    // tutorial.js @version $1.1$

    var CommentBox = React.createClass({
        render: function(){
            return (
                <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList />
                    <CommentForm />
                </div>
            );
        }
    });


    // CommentList

    var CommentList = React.createClass({
        render: function(){
            return (
                <div className="commentList">
                    <Comment author="Ou Yuan">This is Ou Yuan comment</Comment>
                    <Comment author="Ou Jun Yuan">This is *Ou Jun Yuan* comment</Comment>
                </div>
            );
        }
    });

    // Comment
    // 使用props传递数据

    var Comment = React.createClass({
        render: function(){
            return (
                <div className="comment">
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    {this.props.children}
                </div>
            );
        }
    });

    // var CommentForm
    var CommentForm = React.createClass({
        render: function(){
            return (
                <div className="commentForm">
                    Hello,React! I'm your old brother
                </div>
            );
        }
    });



    React.render(
        <CommentBox />,
        document.getElementById('content')
    );


注：以上，我们从父节点CommentList组件传递给子节点Comment组件一些数据。例如，我们传递了*Ou Yuan*(通过一个属性)和*This is Ou Yuan comment*(通过类似于XML的子节点)给第一个COmment。从父节点传递到子节点的数据称为props，即属性properties的缩写。


通过props，Comment就能够从中读取到从CommentList传递过来的数据，然后渲染一些标记。
在JSX中，通过将JavaScript表达式放在大括号中(作为属性或者子节点)可以生成文本或者React组件到节点树中(就如jade等模板一般)我们访问传递给组件的命名属性(如author即为属性命名)作为this.props的键，任何内嵌的元素作为this.props.children。

此时再刷新下浏览器：

<center>
<p><img src="https://beyondouyuan.github.io/img/react_6.png" align="center"></p>
</center>


哎哟不错哦！

#### MarkDown #### 


在以上的评论中有一条如下内容：

This is “*Ou Jun Yuan*” comment。

通常的"**"是markdown语法中的斜体表示方式，那么，我们该怎样将markdown添加进来呢？

首先。你得有个女朋友，哦不，首先把第三方的Showdown库添加到项目中：

    <script src="https://cdn.bootcss.com/showdown/1.3.0/showdown.min.js"></script>

>
>
note:在这里被坑得挺惨，教程引用的第三方showdown库在我的项目里不起作用，于是我一怒之下直接把showdown库下载到本地后再链接到项目里，谁知浏览器一直还是报错，未能将此库加载，最后找到了现在项目中所用的CDN。
>

>
引入库之后,一直提示一个错误:*Uncaught ReferenceError: Showdown is not defined*，通常来说，这样的错误应该有两种可能，1.没有引入第三方库，2.变量定义出错。而找了许久也没有从这里找到原因，后来在某社区上看到了一个细微的差别：大小写！没错，教程里两个单词的大小写刚好放了过来！教程为var converter = new Showdown.converter();而那个社区上恰恰相反：var converter = new showdown.Converter();最终是以社区上的正确而结束，这应该是版本问题。
>


    // tutorial.js @version $1.2$  添加markdown  测试成功


    var CommentBox = React.createClass({
        render: function(){
            return (
                <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList />
                    <CommentForm />
                </div>
            );
        }
    });


    // CommentList

    var CommentList = React.createClass({
        render: function(){
            return (
                <div className="commentList">
                    <Comment author="Ou Yuan">This is Ou Yuan comment</Comment>
                    <Comment author="Ou Jun Yuan">This is *Ou Jun Yuan* comment</Comment>
                </div>
            );
        }
    });

    // Comment

    var converter = new showdown.Converter();
    var Comment = React.createClass({
        render: function(){
            return (
                <div className="comment">
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    {converter.makeHtml(this.props.children.toString())}
                </div>
            );
        }
    });

    // var CommentForm
    var CommentForm = React.createClass({
        render: function(){
            return (
                <div className="commentForm">
                    Hello,React! I'm your old brother
                </div>
            );
        }
    });



    React.render(
        <CommentBox />,
        document.getElementById('content')
    );


刷新浏览器：
<center>
<p><img src="https://beyondouyuan.github.io/img/react_7.png" align="center"></p>
</center>

花擦！身材不错，就是脸上痘痘太多！他把html标签都渲染都浏览器上了，这当然不是我们想要的，我们真正的期望是他想html那样渲染出来而不是把标签暴露出来。所以：

    // tutorial.js @version $1.3$ 将markdown转换为标准html标签 测试成功
    var CommentBox = React.createClass({
        render: function(){
            return (
                <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList />
                    <CommentForm />
                </div>
            );
        }
    });


    // CommentList

    var CommentList = React.createClass({
        render: function(){
            return (
                <div className="commentList">
                    <Comment author="Ou Yuan">This is Ou Yuan comment</Comment>
                    <Comment author="Ou Jun Yuan">This is *Ou Jun Yuan* comment</Comment>
                </div>
            );
        }
    });

    // Comment
    // var converter = new Showdown.Converter();
    // 注：Showdown以小写开头，若是以大写开头将会报错，应该是版本的原因
    // Converter则是以大写开头，若是以小写开头则亦报错

    var converter = new showdown.Converter();
    var Comment = React.createClass({
        render: function(){
            var rawMarkup = converter.makeHtml(this.props.children.toString());
            return (
                <div className="comment">
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    <span dangerouslySetInnerHTML={{__html:rawMarkup}} />
                </div>
            );
        }
    });

    // var CommentForm
    var CommentForm = React.createClass({
        render: function(){
            return (
                <div className="commentForm">
                    Hello,React! I'm your old brother
                </div>
            );
        }
    });



    React.render(
        <CommentBox />,
        document.getElementById('content')
    );


<center>
<p><img src="https://beyondouyuan.github.io/img/react_8.png" align="center"></p>
</center>


wow!丐帮里除了个黄蓉！我们加了"**"符号包裹的文字变成了斜体，其他的html标签也不再显示在浏览器了，而是被解析渲染成了真正的html。


>
>
node:教程里使用的dangerouslySetInnerHTML={{"{{"}}__html: rawMarkup}}不起作用，且浏览器报错，于是根据报错做了修改：dangerouslySetInnerHTML={{__html:rawMarkup}}，perfect!
>
