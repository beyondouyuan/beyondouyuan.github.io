---
layout: post
title: React初成长(三)
author: beyondouyuan
date: 2016-10-23
tags: [React]
react: react
description: 年年才到花时候，风雨成旬，不肯开晴，误却寻花陌上人。今朝报道天晴也，花已成尘。寄语花神，何似当初莫做春。
---

###  写在前面 ###

工作即修行！


#### 接入数据模型 #### 

到目前为止，我们已经在源代码里面直接插入了评论数据。直接把数据放在代码里着实不高明，让我们渲染一小块JSON数据到评论列表。最终，数据将会来自服务器，但是现在，写在你的源代码中：


    // tutorial.js @version 1.4 接入数据模型  测试成功

    // data

    var data = [
        {author: "Ou Yuan", text: "This Ou Yuan papa comments"},
        {author: "Ou Jun Yuan", text: "This *Ou Jun Yuan lalala* comments"}
    ];

    // CommentBox

    var CommentBox = React.createClass({
        render: function(){
            return (
                <div className="commentBox">
                    <h1>Comments</h1>
                        <CommentList data={this.props.data} />
                    <CommentForm />
                </div>
            );
        }
    });

    // 动态渲染数据
    // CommentList

    var CommentList = React.createClass({
        render: function(){
            var commentNodes = this.props.data.map(function(comment){
                return (
                    <Comment author = {comment.author}>
                        {comment.text}
                    </Comment>
                );
            });
            return (
                <div className="commentList">
                    {commentNodes}
                </div>
            );
        }
    });

    // Comment
    // var converter = new Showdown.Converter();
    // 注：Showdown以小写开头，若是以大写开头将会报错，应该是版本的原因
    // Converter则是以答谢开头，若是以小写开头则亦报错

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
        <CommentBox data={data} />,
        document.getElementById('content')
    );

我们修改了COmmentBox和React.render方法，通过props传递数据dao CommentList。

就是这么简单：

<center>
<p><img src="https://beyondouyuan.github.io/img/react_9.png" align="center"></p>
</center>

无需怀疑，浏览器所展示的正是我们json数组中的数据！

#### 从服务器中获取数据 #### 


以上的的数据需要没有直接写在标签代码中，但是获取数据的JSON也一样实在代码中混合着，依旧不是最佳方式，我们应该是从服务器中获取这一类的数据，或者最好也该把数据分离出去。

所以，我们将使用从服务器获取的动态数据代替硬编码数据(我个人测试时仅仅是把json分离到了一个独立文件，然后用url引入该文件，并不是从服务器上获取，不过，这已经和从服务器上获取没有什么两样了)。我们移除数据属性，使用获取数据的URL方式代替之：

    // tutorial.js @version 1.5 从服务器中获取数据  测试成功
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


    // var Comment = React.createClass({
    //   render: function(){
    //     return (
    //       <div className="comment">
    //         <h2 className="commentAuthor">
    //           {this.props.author}
    //         </h2>
    //         <span>
    //            {this.props.children} // 不做markdown处理
    //         </span>
    //       </div>
    //     );
    //   }
    // });

    var CommentList = React.createClass({
      render: function(){
        var commentNodes = this.props.data.map(function(comment){
          return (
            <Comment author = {comment.author}>
              {comment.text}
            </Comment>
          );
        });
        return (
          <div className="commentList">
            {commentNodes}
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


    // CommentBox  测试成功
    // 笔记:CommentList data={this.state.data}
    // 错写为了CommentList data={this.status.data}，所以一直报错。。。。。
    // 笔记：ajax需要在服务器端(或者本地搭建的wamp服务器，否则报错)，其就像css3需要在服务器端才能运行
    // 即localhost//React   //可以成功
    // f:work//react     //则失败
    // 组件第一次加载以及之后每隔两秒钟，调用这个方法。尝试在你的浏览器中运行，
    // 然后改变 comments.json 文件；在两秒钟之内，改变将会显示出来！
    var CommentBox = React.createClass({
      getInitialState:function(){
        return{data:[]};
      },
      componentDidMount:function(){
        $.ajax({
          url:this.props.url,
          dataType:'json',
          success:function(data){
            this.setState({data:data});
          }.bind(this),
          error:function(xhr,status,err){
            console.error(this.props.url,status,err.toString());
          }.bind(this)
        });
      },
      render:function(){
        return(
          <div className="commentBox">
            <h1>Comments</h1>
            <CommentList data={this.state.data} />
            <CommentForm />
          </div>
        );
      }
    });


    React.render(
      <CommentBox url="comments.json" pollInterval={2000} />,
      document.getElementById('content')
    );


>
> 笔记：ajax需要在服务器端(或者本地搭建的wamp服务器，否则报错)，其就像css3需要在服务器端才能运行
> 
> 即localhost//React   //可以成功
> f:work//react     //则失败



comments.json是和index2.html统一级别的目录，comments.json内容如下：

    [
        {
            "id": 1,
            "author": "React",
            "text": "Hey there!"
        },
        {
            "id": 2,
            "author": "React JS",
            "text": "wow *great*!"
        },
        {
            "id": 3,
            "author": "小帅哥React",
            "text": "*abcd你是个小帅哥*"
        },
        {
            "id": 4,
            "author": "大帅哥React",
            "text": "*abcd你是个大帅哥*"
        },
        {
            "id": 5,
            "author": "小逗逼React",
            "text": "<a href=\"javascript:alert(10)\">小逗逼线</a>"
        },
        {
            "id": 6,
            "author": "大逗逼React",
            "text": "<a href=\"javascript:alert(10)\">大逗逼线</a>"
        }
    ]


以上，

每一个组件都根据自己的props渲染了自己一次。props是不可变的：它们从父节点传递过
来，被父节点“拥有”。为了实现交互，我们给组件引进了可变的 state。this.state 是组件私有的，可以通过调用this.setState()来改变它。当状态更新之后，组件重新渲染自己。

componentDidMount是一个在组件被渲染的时候React自动调用的方法。动态更新的关键点是调用this.setState()。我们把旧的评论数组替换成从服务器拿到的新的数组，然后UI自动更新。正是有了这种响应式，一个小的改变都会触发实时的更新。


我们在这里把AJAX调用移到一个分离的方法中去，组件第一次加载以及之后每隔两秒钟，调用这个方法。尝试在你的浏览器中运行，然后改变comments.json 文件；在两秒钟之内，改变将会显示出来！
刷新浏览器：


<center>
<p><img src="https://beyondouyuan.github.io/img/react_10.png" align="center"></p>
</center>


如此解耦就优雅得多了！

#### 添加新的评论 #### 

现在是时候构造表单了。我们的CommentForm组件应该询问用户的名字和评论内容，然后发送一个请求到服务器，保存这条评论：
    
    // tutorial.js @version 1.6 添加新的评论
    // 测试成功
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

    var CommentList = React.createClass({
      render: function(){
        var commentNodes = this.props.data.map(function(comment){
          return (
            <Comment author = {comment.author}>
              {comment.text}
            </Comment>
          );
        });
        return (
          <div className="commentList">
            {commentNodes}
          </div>
        );
      }
    });

    // var CommentForm
    // 构造表单，CommentForm组件应该询问用户的名字和评论内容，
    // 然后发送一个请求到服务器，保存这条评论


    var CommentForm = React.createClass({
      render:function(){
        return (
          <form className="commentForm">
            <input type="text" placeholder="你的姓名呢大哥"/>
            <input type="text" placeholder="说点什么鬼吧。。。"/>
            <input type="submit" value="提交"/>
          </form>
        );
      }
    });

    // 为了让表单可交互，当用户提交表单时，我们应该清空表单，
    // 提交一个请求到服务器，然后刷新评论列表
    // 监听表单的提交事件(onSubmint)并清空表单
    // React使用驼峰命名规范
    // 在事件回调中调用preventDefault()避免浏览器默认地提交表单
    // 使用ref属性给子组件命名，this.refs引用组件
    // 调用getDOMNode()获取浏览器本地的DOM元素

    var CommentForm = React.createClass({
      handleSubmit:function(e){
        e.preventDefault();
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        if (!text || !author) {
          return;
        }
        // 发送请求到服务器
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
      },
      render:function(){
        return (
          <form className="commentForm" onSubmint={this.handleSubmit}>
            <input type="text" placeholder="你的姓名" ref="author"/>
            <input type="text" placeholder="说点什么鬼吧。。。" ref="text"/>
            <input type="submit" value="提交"/>
          </form>
        );
      }
    });


    var CommentBox = React.createClass({
      getInitialState:function(){
        return{data:[]};
      },
      componentDidMount:function(){
        $.ajax({
          url:this.props.url,
          dataType:'json',
          success:function(data){
            this.setState({data:data});
          }.bind(this),
          error:function(xhr,status,err){
            console.error(this.props.url,status,err.toString());
          }.bind(this)
        });
      },
      render:function(){
        return(
          <div className="commentBox">
            <h1>Comments</h1>
            <CommentList data={this.state.data} />
            <CommentForm />
          </div>
        );
      }
    });


    React.render(
      <CommentBox url="comments.json" pollInterval={2000} />,
      document.getElementById('content')
    );


#### 事件 #### 

React使用驼峰命名规范的方式给组件绑定事件处理器。我们给表单绑定一个onSubmit 处理器，用于当表单提交了合法的输入后清空表单字段。

#### Refs #### 
我们利用Ref属性给子组件命名，this.refs引用组件。我们可以在组件上调用getDOMNode()获取浏览器本地的DOM元素。

<center>
<p><img src="https://beyondouyuan.github.io/img/react_11.png" align="center"></p>
</center>


我们不再是老兄，我们，是同志了！
