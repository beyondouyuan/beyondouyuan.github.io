---
layout: post
title: JavaScript之JSON
author: beyondouyuan
date: 2016-10-24
categories: blog
tags: [JavaScript]
javascript: javascript
description: 花褪残红青杏小，燕子飞时，绿水人家绕。枝上柳绵吹又少，天涯何处无芳草。墙里秋千墙外道，墙外行人，墙里佳人笑。笑渐不闻声渐消，多情却被无情恼。
---
### 写在前面 ###

1024节日快乐！如果程序员节既不码代码，也不写点什么，那也太没意思了！


### JSON语法 ### 

JSON是一种比XML更简洁的结构化数据格式。

JSON有两种操作方法，解析和序列化。
很多语言都可以对JSON进行解析和序列化。

>
>
以JavaScript为例，解析就是将结构化了的JSON字符串取出，解析还原成JavaScript的原生值如JavaScript的简单值、数组、对象等类型。序列化这是恰恰相反：将JavaScriptd的对象、数组、普通值转化为JSON数据结构化的数据。
>

JSON语法可以表示三种类型的值：

1.简单值：可以在JSON中表示字符串、数值、布尔值和null，但是JSON不支持JavaScript中的特殊值underfined

2.对象：JSON的值可以是对象

3.数组：JSON的值可以是数组


&&1 简单值

100、'lee'这两个量就是JSON的表示方法，第一个是JSON的数值，第二个是JSON的字符串，布尔值和null也是有效的形式，只不过是在实际运用中要结合的对象或者数组。

&&2 对象

JavaScript对象字面量表示法：

    var people = {
        name:'Lee',
        age:100
    };

而JSON中的对象表示法需要加上引号，并且不存在赋值运算符号和分号：

    {
        "name":"Lee",//使用双引号引住键名，否则出错
        "age":100
    }

这就像键值对一样的格式。

Tips:JSON字符串最好是使用双引号引住而不推荐使用单引号，使用单引号可能在转换过程中出错。

而同样的，JSON数组表示法也没有变量赋值和分号。

    ["oy",100,true]

    /*
    *   Tips:JSON对象和数组比普通对象和数组，少了分号，少了变量赋值，
    *   而且本身在严格上应该是字符串表示方式(即加上引号)
    *   也就是说，定义结束时无需在最后使用分号结束
    *   JSON对象和数组无需作变量赋值:
    *   var obj = {obj code}    var arr = [arr code]    此即为变量赋值
    *   给变量赋值也就相当于给声明的对象和数组起一个名字一样
    *   这与函数相似，函数可以带名字也可以不带名字(匿名函数)
    *   则JSON格式的对象和数组无需起名字，就与匿名函数一样
    *   单纯保存为.json格式的文件时，最外层花括号或方括号不加引号
    **/

一般比较常用的一种复杂形式是数组结合对象的形式：

    [
        {
            "title":"a",
            "num":1
        },
        {
            "title":"b",
            "num":2
        },
        {
            "title":"c",
            "num":3
        }
    ]


以上的这个组合形式，在此处不会报错，然而此时也没有任何意义，因为！我们根本不知道怎样调用这一堆数据。

那么应该怎样调用这一堆数据呢？

Tips:一般的，我们可以把JSON结构数据保存到一个文件里，然后通过XMLHttpRequest对象去加载它，得到这串结构数据字符串，我们可以模拟这种过程。

模拟加载JSON文件数据，并赋值给变量：

    var _json = '[{"name":"a","age":1},{"name":"b","age":2}]';

以上代码模拟了var _json = $.get('json.json')的赋值过程。由于通过load加载的文件，不管内用是什么，都必须是字符串，所以两边都要加上引号。


    // 获取普通数组
    var jsonArr = [{"name":"a","age":1},{"name":"b","age":2}];
    alert(jsonArr);
    // 此时弹出信息为[object Object],[object:Object]
    // 因为jsonArr是个普通数组，普通数组也是对象
    // 以上没有毛病

    // 模拟加载JSON文件数据，并赋值给变量：
    // 将JSON字符串加载进来并且赋值给_json变量

    var jsJSON = '[{"name":"a","age":1},{"name":"b","age":2}]';//成功模拟加载JSON过程
    alert(jsJSON);
    alert(typeof jsJSON);// String
    // 此时弹出的是[{"name":"a","age":1},{"name":"b","age":2}]

    // 实际上，一般真正的加载json文件的形式如下：
    // 且在本地测试时不能直接从F:/study/json.html这样启动
    // 必须经过本地服务器，逗着无法加载json
    var _json = $.get('json.json');
    // 此处路径并不是json.js和json.json的相对路径
    // 而是加载引入json.js文件的json.html文件与json.json的相对路径
    console.log(_json);


其实JSON就是比普通数组多了两边的双引号，普通数据如下：

    var arr = [{name:'a',age:1},{name:'b',age:2}];


### 解析与序列化 ### 


若载入的是JSON文件，我们需要对其进行使用，那么就必须对JSON字符串解析成原生的JavaScript值(对象或者数组)。当然，若是原生的JavaScript对象或数组，也可以转换成JSON字符串。

JSON字符串解析为原生JavaScript值，相当于如下：

'[{"name":"a","age":1},{"name":"b","age":2}]' ==>>[{name:"a",age:1},{name:"b",age:2}]

是的，去掉不必要的括号(原生的数组或对象的键可以不加括号)而已，就是那么简单！

对于JSON字符串解析为JavaScript原生值，早期采用的是eval()函数，但是这是一种危险的方式(因为他执行了这个代码块)：

    var _json = '[{"name":"a","age":1},{"name":"b","age":2}]';
    alert(_json);// JSON字符串
    var json = eval(_json);//使用eval()解析

    alert(json);//得到JavaScript原生值

ECMAScript5对解析JSON的行为进行了规范，定义了全局对象JSON，支持这个对象的浏览器有IE+8、Firefox3.5+、Safari4+、Chrome和Opera10.5+，不支持的浏览器可以通过开原库json.js模拟执行。JSON对象提供了两个方法，一个实将原生的JavaScript值转换为JSON字符串：stringify()；另外一个是将JSON字符串转换为JavaScript原生值：parse()。

jsonArr为模拟的JSON字符串。

    var jsonArr = '[{"name":"a","age":1},{"name":"b","age":2}]';//注：键使用双引号
    alert(jsonArr);==>> [{"name":"a","age":1},{"name":"b","age":2}]
    var myJs = JSON.parse(jsonArr)//若jsonArr中的键不使用双引号，此处将会报错
    alert(myJs);// ==>>得到JavaScript原生值==>>[object Object],[object Object]

    var jsArr = [{name:"a",age:1},{name:"b",age:2}];// JavaScript原生值

    var myJSON = JSON.stringify(jsArr);//转换为JSON字符串

    alert(myJSON);
    // 得到JSON字符串==>>[{"name":"a","age":1},{"name":"b","age":2}], 
    // myJSON中已经自动添加了双引号


在序列化JSON字符串过程中，stringify()提供了三个参数，其中后两个为可选参数，，第一个可选参数可以是一个数组，也可以是一个对象，用于过滤结果。第二个可选参数则表示是否在JSON字符串中保留缩进
   
    // 第一个可选参数["age","height"]，用于过滤结果，得到我们想序列化的部分
    // 第二个参数可以是数字也可以是字符串，用于保留缩进，
    // 数字为表示缩进的空格数(默认为两格)，字符串这是以这个字符串填充缩进的空格

    var jsArr = [
        {name:"a",age:1,height:177},
        {name:"b",age:2,height:188}
    ];

    var myJSON = JSON.stringify(jsArr,["age","height"],4);

    alert(myJSON);

你看到了什么？没错，我们只把age和height序列化了，并且保留了格式缩进，而name没有被序列化出来。

    var myJSON = JSON.stringify(jsArr,["age","height"],'---');

    alert(myJSON);


    // 如果我们需要第二个可选参数，却不需要第一个可选参数，
    // 则将第一个可选参数设置为null即可，这样将会把所有数据序列化


    var myJSON = JSON.stringify(jsArr,null,4);

    alert(myJSON);


JSON还提供了另外一种方法，可以用于自定义过滤一些数据，使用toJSON()方法，可以将某一组对象指定返回某个值：

    var jsArr = [{
        name: "a",
        age: 1,
        height: 177,
        toJSON: function() {
            return this.name;
        }
    }, {
        name: "b",
        age: 2,
        height: 188,
        toJSON: function() {
            return this.age;
        }
    }];
    var myJSON = JSON.stringify(jsArr,null,4);

    alert(myJSON);


看起来很有趣！

以上，
可见序列化也有执行顺序，首先执行toJSON()方法，若是引用了第二个过滤参数，则执行这个方法；然后执行序列化过程。比如将键值对组合成合法的JSON字符串，比如加上双引号，若是加了缩进，再执行缩进操作。


解析JSON字符串也可以接收第二个参数，这样可以在还远JavaScript值的时候替换成自己想要的值：

    var myJSON = '[{"name":"a","age":1},{"name":"b","age":2}]';

    var myJS = JSON.parse(myJSON, function(key, value) {
        if (key == 'name') {
            return 'Mr ' + value;
        } else {
            return value;
        }
    });

    alert(myJS[0].name);

Yes Mr a
