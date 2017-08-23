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

每一个球员都会去到各自的荣誉，我们在db.json中也有一个honor对象，它应当与球员一一对应。我们需要将两者关联起来。我们可以使用owner_id将两者关联起来（数据模型设计得并不是很好，一版来说，不应该是所属owner而应该是标签tag，他们是一对多的关系）。

### 构建组件

球员荣誉与球员信息的管理方式如出一辙，也就是说，他们的组件也是高度相似甚至是可以重用的，在此处，暂时不再乎组件重用，将Players目录下的组件复制一份到Honor目录下，随后修改对应的字段以及路由和url等参数即可。所有参数修改后，到相应路由可以看到我们想要的效果！

这样就行了么？！以上提到过，一个球员除了基本信息，还要有相关信息，就如我们平时浏览新闻的时候可以看到新闻的归属活着类别标签，我们这里也有这么个关系，这些个荣誉活着新闻是属于哪一个球员呢？

我们当然可以在输入荣誉的时候输入关联标签或者所属id，但是，这是一个一对多的关系，一个球员可能有多个标签，或者说，虽然只关联一个id，但是，这个id太长，不宜于输入，所以。。。怎么办？是的，没错，提供一个下拉列表！搞定！这是我们以往的做法，提供一个原生的下拉标签，提供选项。

在React中，我们可以不必如此古板，我们只需要提供一个列表---不一定就是下拉列表selecte，我们完全可以用一个无序列表提供这样的功能，我们只需要再给这个无序列表的li添加相应的选择事件的监听处理程序即可。

我们将这个下拉列表命名为AutoComplete组件，意为根据输入的id进行譬如id_linke这样的模糊搜索，也即是党我们输入一个id时，发起一个请求，请求路径为http://localhost:3000/player?id_like=xxx这样的类型，请求得到的数组渲染在这个模拟下拉列表中，即相当于实现模糊搜索亦或事自动完成的功能。



将这个自动完成或者模拟搜索抽离成为一个组件，这个组件包括一个输入框用于用户输入，以及一个列表，用于渲染选择列表，选择列表的数据根据输入的值进行id_like模拟请求数据得到。


### 组件划分

通常的，当我们想写一个组件的时候，首先需要思考以下几个问题：

- 组件的结构该是怎样的
- 组件的逻辑是怎样的
- 是否需要有内部状态，有内部状态则使用class组件，组件的状态由组件自身维护。无则使用函数组件或者纯组件。
- 组件需要暴露那些接口给外界，即可通过props对象所暴露的属性有哪些


综上，可以首先确定我们的组件是一个输入框和一个无序列表：

    <div>
        <input type="" name="" />
        <ul>
            <li></li>
        </ul>
    </div>

思考我们组件的逻辑：

- input未输入时，就是一个普通的输入框
- input输入时，值改变，若根据输入的值可以模糊请求到数据，则将得到的数据渲染ul中
- 无序列表监听键盘方向键，以及点击事件，鼠标以及键盘移动，相应li变为激活项，鼠标点击相应项，则input的值编委该项的值


### 组件内部状态

组件通过state对象来维护内部状态，通常使用setState方法来更新state对象。默认情况下，state改变组件树会重新调用render方法渲染组件，但是，我们可以在componentShouldUpdate周期控制返回值来控制是否重新渲染组件。

### 组件实现

AutoComplete.js组件如下：


    /*
    * @Author: beyondouyuan
    * @Date:   2017-08-23 11:31:15
    * @Last Modified by:   beyondouyuan
    * @Last Modified time: 2017-08-23 15:06:52
    */

    import React from 'react';

    import { PropTypes } from 'react';

    import style from '../../styles/auto-complete.less'

    function getItemValue(item) {
        return item.value || item;
    }

    class AutoComplete extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                displayValue: '',
                activeIndex: -1
            };
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.handleLeave = this.handleLeave.bind(this);
        }
        // 输入处理程序
        handleChange(value) {
            this.setState({
                activeIndex: -1,
                displayValue: ''
            });
            this.props.handleChange(value);
        }
        handleKeyDown(event) {
            const { activeIndex } = this.state;
            const { options } = this.props;

            switch (event.keyCode) {
                // 回撤
                case 13: {
                    if (activeIndex >= 0) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.handleChange(getItemValue(options[activeIndex]))
                    }
                    break;
                }
                // 上下方向
                case 30:
                case 40: {
                    event.preventDefault();
                    this.updateItem(event.code === '30' ? 'up' : 'down');
                    break;
                }
                default:
                    break;
            }
        }
        handleEnter(index) {
            const currentitem = this.props.options[index];
            this.setState({
                activeIndex: index,
                displayValue: getItemValue(currentitem)
            })
        }
        handleLeave() {
            this.setState({
                activeIndex: -1,
                displayValue: ''
            })
        }
        updateItem(direction) {
            const { activeIndex } = this.state;
            const { options } = this.props;
            const lastIndex = options.length - 1;

            let newIndex = -1;

            // 根据键盘方向更新激活项索引
            if(direction === 'up') {
                // 若尚未选中，则默认选中最后一项，从下往上
                if (activeIndex === -1) {
                    newIndex = lastIndex;
                } else {
                    newIndex = activeIndex - 1;
                }
            } else {
                if(activeIndex < lastIndex) {
                    newIndex = activeIndex + 1;
                }
            }
            // 跟新输入框的值
            let newDisplayValue = '';
            if (newIndex >= 0) {
                newDisplayValue = getItemValue(options[newIndex]);
            }
            // 跟新状态
            this.setState({
                displayValue: newDisplayValue,
                activeIndex: newIndex
            });
        }
        render() {
            const { displayValue, activeIndex } = this.state;
            const { value, options } = this.props;

            return(
                <div className={style.wrapper}>
                    <input
                        value={displayValue || value}
                        onChange={(event) => this.handleChange(event.target.value)}
                        onKeyDown={this.handleKeyDown}
                    />
                    {
                        options.length > 0 && (
                            <ul
                                className={style.options}
                                onMouseLeave={this.onMouseLeave}
                            >
                                {
                                    options.map((item, index) => {
                                        return (
                                            <li
                                                key={index}
                                                className={activeIndex === index ? style.active : ''}
                                                onMouseEnter={() => this.handleEnter(index)}
                                                onClick={() => this.handleChange(getItemValue(item))}
                                                >
                                                { item.text || item }
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        )
                    }
                </div>
            );
        }
    }

    // 组件检验

    AutoComplete.propTypes = {
        value: PropTypes.number.isRequired,
        options: PropTypes.array.isRequired,
        handleChange: PropTypes.func.isRequired
    }



    export default AutoComplete;

### this绑定方式

以上，在constructor构造函数中有两句与句：

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleLeave = this.handleLeave.bind(this);

而在组件中还有诸如onClick事件的方法：

    onClick={() => this.handleChange(getItemValue(item))}


以上都出于相同的目的：绑定this。使用ES5语法书写的React组件会自动为我们将this指向到当前组件，而使用ES6语法书写的React组件则未自动为我们绑定this，所以我们需要手动绑定，使得this指向到当前组件，一版绑定由两种方式：

- 在构造函数constructor的super()方法之后绑定this
- 在组件内使用肩头函数，肩头函数本身并没有this，使用肩头函数即相当于自动的把this绑定到了当前组件对象
- 当组件的方法比较多，而我们又不想都适用肩头函数时，在constructor中一个一个的绑定太过于麻烦，所以我们还可以写一个公用的方法来遍历绑定this


HonorEditor.js组件输入owner_id的部分修改如下：

    <FormItem label="荣誉所属：" valid={owner_id.valid} error={owner_id.error}>
        <AutoComplete
            value={owner_id.value ? owner_id.value : 0}
            options={PlayerOptions}
            handleChange={value => this.handlePlayerOwnerIdChange(value)}
         />
    </FormItem>


表单其余部分不变。

getPlayerOptions方法为实现模糊搜索请求数据，得到下拉列表的的渲染的数据。
handlePlayerOwnerIdChange方法用于监听输入框，然后使用函数节流的方式去调用getPlayerOptions方法请求数据。

    getPlayerOptions(playerId) {
        fetch('http://localhost:3000/players?id_like' + playerId)
            .then((res) => res.json())
            .then((res) => {
                if (res.length === 1 && res[0].id === players) {
                    return;
                }
                this.setState({
                    PlayerOptions: res.map(item => {
                        return{
                            text: `${item.id} (${item.name})`,
                            value: item.id
                        }
                    })
                })
            })
    }
    timer = 0;
    handlePlayerOwnerIdChange(value) {
        this.props.handleChange('owner_id', value, 'number');
        this.setState({
            PlayerOptions: []
        });
        // 时间节流
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (value) {
            // setTimeout使用肩头函数自动绑定this指向当前组件对象
            this.timer = setTimeout(() => {
                this.getPlayerOptions(value);
                this.timer = 0;
            }, 800)
        }
    }

### 模块CSS

自动完成输入的列表未加入任何样式，太过于丑陋，添加一个auto-complete.less的样式，在AutoComplete组件中引入，并为组件添加样式类名：

    import style from '../../styles/auto-complete.less'

    className={style.wrapper}

在某个组件中引入样式表文件，而不是在程序应用的入口文件中引入样式表，则无需使用webpack的loader去加载文件，如此形成一个组件对应一个模块的样式表。


以上，未完待续。。。







