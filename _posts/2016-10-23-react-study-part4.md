---
layout: post
title: React初成长(四)
author: beyondouyuan
date: 2016-10-23
tags: [React]
react: react
description: 江头又见新秋，几多愁。塞草连天，何处是神州？英雄恨，古今泪，水东流。惟有渔竿，明月上瓜洲。
---

###  写在前面 ###

是的！男人就是要快！

#### 回调函数作为属性 #### 

    //  tutorial.js @version 1.7
    
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

    // CommentForm
    
    var CommentForm = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var author = this.refs.author.getDOMNode().value.trim();
            var text = this.refs.text.getDOMNode().value.trim();
            if (!text || !author) {
                return;
            }
            this.props.onCommentSubmit({ author: author, text: text });
            this.refs.author.getDOMNode().value = '';
            this.refs.text.getDOMNode().value = '';
            return;
        },
        render: function() {
            // return ( <form className = "commentForm"
            //     onSubmit = {this.handleSubmit}>
            //     placeholder = "请输入你的姓名"
            //     ref = "author" />
            //     <input type = "text"
            //     placeholder = "说点什么鬼吧..."
            //     ref = "text" />
            //     <input type = "submit"
            //     value = "提交" />
            //     </form>
            // );
            //
            // 注意html标签书写，留意换行，如以上，将会报错，
            // 修改如下：
            return (
            <form className = "commentForm" onSubmit = {this.handleSubmit}>
                <input placeholder = "请输入你的姓名" ref = "author" />
                <input type = "text" placeholder = "说点什么鬼吧..." ref = "text" />
                <input type = "submit" value = "提交" />
              </form>
            );
        }
    });

    // CommentBox
    // 用户提交评论时，刷新评论列表以添加此条评论
    // 在CommentBox中完成所有逻辑(CommentBox拥有代表评论列表的状态state)

    // 需要从子组件传回数据到副组件
    // 在父组件的render方法中处理此事(传回数组)：
    // 传递一个新的回调函数(handleCommentSubmit)到子组件，
    // 绑定他到子组件的onCommentSubmit事件

    var CommentBox = React.createClass({
        loadCommentsFromServer: function() {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function(data) {
                    this.setState({ data: data });
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        handleCommentSubmit: function(comment) {
            // TODO: submit to the server and refresh the list
            // 提交一个请求到服务器，然后刷新评论列表
        },
        getInitialState: function() {
            return { data: [] };
        },
        componentDidMount: function() {
            this.loadCommentsFromServer();
            setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        },
        render: function() {
            return (<div className = "commentBox">
                <h1> Comments </h1> <CommentList data = { this.state.data }
                /> <CommentForm onCommentSubmit = { this.handleCommentSubmit }
                /> </div>
            );
        }
    });


    React.render(
      <CommentBox url="comments.json" pollInterval={2000} />,
      document.getElementById('content')
    );

以上，
当用户提交表单时，在CommentForm中调用回调函数(handleCommentSubmit)。

注意html标签书写，留意换行，如以下，将会报错。
    *return ( 
    <form className = "commentForm"
        onSubmit = {this.handleSubmit}>
        placeholder = "请输入你的姓名"
        ref = "author" />
        <input type = "text"
        placeholder = "说点什么鬼吧..."
        ref = "text" />
        <input type = "submit"
        value = "提交" />
    </form>
    );*
            
修改如下：         

    return (
        <form className = "commentForm" onSubmit = {this.handleSubmit}>
            <input placeholder = "请输入你的姓名" ref = "author" />
            <input type = "text" placeholder = "说点什么鬼吧..." ref = "text" />
            <input type = "submit" value = "提交" />
        </form>
    );



- 用户提交评论时，刷新评论列表以添加此条评论
- 在CommentBox中完成所有逻辑(CommentBox拥有代表评论列表的状态state)

- 需要从子组件传回数据到副组件
- 在父组件的render方法中处理此事(传回数组)：
- 传递一个新的回调函数(handleCommentSubmit)到子组件，
- 绑定他到子组件的onCommentSubmit事件




- 回调函数如以上以准备到位，将其评论提交到服务器，然后刷新列表。
- 回调函数作为属性。

tutorial.js @version 1.8 测试成功

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


        // CommentForm
        // 当用户提交表单时，在CommentForm中调用回调函数(handleCommentSubmit)

        var CommentForm = React.createClass({
            handleSubmit: function(e) {
                e.preventDefault();
                var author = this.refs.author.getDOMNode().value.trim();
                var text = this.refs.text.getDOMNode().value.trim();
                if (!text || !author) {
                    return;
                }
                this.props.onCommentSubmit({ author: author, text: text });
                this.refs.author.getDOMNode().value = '';
                this.refs.text.getDOMNode().value = '';
                return;
            },
            render: function() {
                return (
                
                    <form className = "commentForm" onSubmit = {this.handleSubmit}>
                        <input placeholder = "请输入你的芳名" ref = "author"/>
                        <input type = "text" placeholder = "说点什么鬼吧..." ref = "text" />
                        <input type = "submit" value = "提交" />
                    </form>
                );
            }
        });

        // CommentBox

        var CommentBox = React.createClass({
            loadCommentsFromServer: function() {
                $.ajax({
                    url: this.props.url,
                    dataType: 'json',
                    success: function(data) {
                        this.setState({ data: data });
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
            },
            handleCommentSubmit: function(comment) {
                $.ajax({
                    url: this.props.url,
                    dataType: 'json',
                    type: 'POST',
                    data: comment,
                    success: function(data) {
                        this.setState({ data: data });
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
            },
            getInitialState: function() {
                return { data: [] };
            },
            componentDidMount: function() {
                this.loadCommentsFromServer();
                setInterval(this.loadCommentsFromServer, this.props.pollInterval);
            },
            render: function() {
                return (
                    <div className = "commentBox">
                      <h1>Comments</h1>
                      <CommentList data = { this.state.data }/>
                      <CommentForm onCommentSubmit = { this.handleCommentSubmit }/>
                    </div>
                );
            }
        });



        React.render(
          <CommentBox url="comments.json" pollInterval={2000} />,
          document.getElementById('content')
        );



#### 优化 #### 
以上版本代码：在评论出现在列表之前，必须等待请求完成，将会感觉很慢。提前更新，使应用感觉更快。

    tutorial.js @version 1.9 测试成功

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


    // CommentForm

    var CommentForm = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var author = this.refs.author.getDOMNode().value.trim();
            var text = this.refs.text.getDOMNode().value.trim();
            if (!text || !author) {
                return;
            }
            this.props.onCommentSubmit({ author: author, text: text });
            this.refs.author.getDOMNode().value = '';
            this.refs.text.getDOMNode().value = '';
            return;
        },
        render: function() {
            return (
              <form className = "commentForm" onSubmit = {this.handleSubmit}>
                <input placeholder = "请输入你的芳名" ref = "author"/>
                <input type = "text" placeholder = "说点什么鬼吧..." ref = "text" />
                <input type = "submit" value = "提交你妹" />
              </form>
            );
        }
    });

    // CommentBox

    var CommentBox = React.createClass({
        loadCommentsFromServer: function() {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function(data) {
                    this.setState({ data: data });
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        handleCommentSubmit: function(comment) {
            var comments = this.state.data;
            var newComments = comments.concat([comment]);
            this.setState({ data: newComments });
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                type: 'POST',
                data: comment,
                success: function(data) {
                    this.setState({ data: data });
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },
        getInitialState: function() {
            return { data: [] };
        },
        componentDidMount: function() {
            this.loadCommentsFromServer();
            setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        },
        render: function() {
            return (
              <div className = "commentBox">
                <h1>Comments</h1>
                  <CommentList data = { this.state.data }/>
                  <CommentForm onCommentSubmit = { this.handleCommentSubmit }/>
                </div>
            );
        }
    });


    React.render(
      <CommentBox url="comments.json" pollInterval={2000} />,
      document.getElementById('content')
    );



<center>
<p><img src="https://beyondouyuan.github.io/img/react_12.png" align="center"></p>
</center>

呼呼！下一站，天后！
