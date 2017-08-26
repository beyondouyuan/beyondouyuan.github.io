---
layout: post
title: React全家桶之后台管理系统（下）
author: beyondouyuan
date: 2017-08-25
categories: blog
tags: [React]
react: react
description: 一寸柔肠情几许？薄衾孤枕，梦回人静。侵晓潇潇雨。
---

###  写在前面 ###

界面部分已完成，对于React组件，大家又把React当作一个状态机，React组件dom树是否渲染／更新，由其自身维护的内部状态控制。在我们之前的学习中，都是基于state的状态管理，在组件较少的应用中，这不会有什么问题也足够优雅，但是随着应用的扩展，项目必然增大，组件的量也会随之增长，state光里状态将会变得比较混乱。那么，以某种方式统一管理React的状态久变得十分有必要。React推荐单项数据流的处理方式，其中官方维护的Flux以及圈内颇为受欢迎的Redux是很好的选择。我们选择Redux。

### Redux是什么

如果你用过React，那么一定听过Flux，也一定听过Redux，那么Redux是什么？

>
Redux是JavaScript状态容器，提供可预测化的状态管理，
可以让开发者构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），
并且易于测试。不仅于此，它还提供超爽的开发体验，比如有一个时间旅行调试器可以编辑后实时预览。
>

也就是说，Redux是一个“中心数据库”，我们可以把应用中的各种状态与数据存放在Redux中，并且可以通过Redux提供的方法对数据库中的数据进行更新，更新数据之后，通过诸如React Redu这样的工具来将数据的更新同步到UI上。

### Redux核心


Redux有三个核心的概念：Store、Action和Reducer。

#### Store

Store，顾名思义，存储，也即是我们以上提到的“数据库”，这个“数据库”是Redux用来存储各种数据和状态的的地方，并不是实际上的数据库。

Redux中只有一个Store，所有的，数据或者状态均在于此，所有的数据以一棵树的形式存储在Store中，这就使得我们在管理数据或者状态的时候，眼里只需要有Store而不需要四处跳转并且关注多个数据源。如下：


    const store = {
        players: {
            list: [...],
            editTarget: {
                id: 10000,
                name: '勒布朗·詹姆斯',
                ...
            }
        },
        honor: {
            list: [...],
            editTarget: {...}
        }
    };



对于我们构建的管理系统的状态可以食用这个结构的store对象来维护。

#### Action


Action即意为“行为动作”，在React维护的视图中，用户的交互动作引发数据／状态的更新，从而通知应用相应地更新识图界面。即所谓事件驱动。


在Redux中，每一个Action都是一个普通的对象JavaScript对象，这个对象必须带有一个名为type的字段(type的值一般是一个大写形式的唯一的字符串)用于表示当前的行为类型，同时还可以可选地带有其他字段用来更新Store(通常会将额外的数据统一放到名为payload的字段中)。


标准的Action模型如下：

    const action = {
        type: 'LOAD_PLAYERS_INFO',
        payload: {
            playerId: 10000
        }
    }



#### Reducer

Redux中，Reducer是一个普通的JavaScript方法，Reducer接收两个参数，state和action。


state表示Store或者Store的一部分，action即一个Action对象。

Redux中，每当有一个Action被触发，所有的Reducer都将会被执行。

若是Reducer方法接收到的Action是这个Reducer所期望的type，那么就可以根据state和action来生成并返回一个新的state。否则直接返回false。


此即所谓Redux的更新state的逻辑：action -> reducer -> new state



我们需要给Reducer的第一个参数state设置一个初始值，这个初始值最终会变成Store或Store中一个子树的初始值。


一般Reducer方法中都会有一个switch，通过switch来根据接收到的action.type来执行不同的更新操作，例如：


    function counter(state = 0, action) {
        switch (action.type) {
            // 增加
            case 'ADD': return state + 1;
            // 减少
            case 'SUB': return state - 1;
            // 默认
            default: return state;
        }
    }



以上：state表示Store或者Store的一部分，这是因为Redux通过Reducer来构建Store的结构（即state参数的初始值），当只有一个Reducer的时候，这个Reducer的state即为整个Store，而弱势有许多个Reducer时，每一个Reducer的state就表示这个树的子树或者子节点。这些节点组成的一整个树即为整个的Store树。

这样构造的优势就是，我们把Store这棵大树分割成了许许多多的小树，而每棵小树各自维护自身的状态，有木有很熟悉？没错，React组件化的思想不就在于此么！


那么，以一个模拟的Redux大概会是这样：

##### HTML

    <div id="container" class="container">
        <section>
            <p>Count: <span id="counter">0</span></p>
            <button id="add-btn">+1</button>
            <button id="sub-btn">-1</button>
        </section>
    </div>
    <script src="scripts/index.js"></script>

##### javaScript

    // Reducer
    function counter(state = 0, action) {
        switch (action.type) {
            case 'ADD' : return state + 1;
            case 'SUB' : return state - 1;
            default: return state;
        }
    }


    // store
    const { createStore } = Redux;

    const store = createStore(counter);

    // 监听Store

    state.subscribe(() => {
        setCounter(store.getState());
    })


    function setCounter(count) {
        document.getElementById('counter').innerHTML = count;
    }

    // 触发Action

    document.getElementById('add-btn').addEventListener('click', function () {
      store.dispatch({type: 'ADD'});
    });


    document.getElementById('sub-btn').addEventListener('click', function () {
      store.dispatch({type: 'SUB'});
    });

Redux的核心概念看似这么点知识，但是可研究学习之处却不少。


### React-Redux

在Redux的框架思想中，视图的变化就是数据的变化的表现。行为导致数据或者状态发生改变，数据状态改变则引起ui视图的变化。即action -> data/state -> ui。data可以是组件的新state，或者接收到的新props和context。

Redux和React并不是一个依赖关系，可以说他们时相互独立的，Redux中的数据和React组件的状态并无关联性。所以，想要在React中食用Redux，就需要一个桥梁将它们联系起来，React-Redux则是一个不错的桥梁。

react-redux为我们提供供的api有：Provider、connect、connectAdvanced。

#### Provider

Provider是一个React组件，它接受两个参数state和children，Provider的render方法返回props.children。

Provider的主要作用是提供在组件树的某一个节点通过context获取store的能力。


一般在项目中，会将Provider这个组件放在整个应用的最顶层，然后将使用Redux.createStore方法创建的store对象传给Provider：


    const store = createStore(rootReducer);

    ReactDOM.render((
        <Provider store={store}>
            <Router history={history}>
                <Route path="/">
                    {...}
                </Route>
            </Router>
        </Provider>
    ), document.getElementById('root'))

