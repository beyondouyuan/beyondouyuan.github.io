---
layout: post
title: 常用array-js
author: beyondouyuan
date: 2017-08-04
categories: blog
tags: [JavaScript]
javascript: javascript
description: 欲减罗衣寒未去，不卷珠帘，人在深深处。红杏枝头花几许？

---


### 写在前面 ###

转眼已是一年，I'm back！

### 为什么封装自己的js方法 ###

某前端狗去面试，面试官，请写一个数组快速排序，一个数组去重，一个数组深度复制的方法，好像有点蒙蔽，不要慌张！just do it!


### 数组去重

#### ES5-方法一
    /*
    * 1 构建一个新数组用于存放结果
    * for循环每次从元数组中取出一个元素与结果数据对比
    * 若结果数组中无该元素，则将该元素存放至结果数据中
    * 缺点，不能去除数组中的应用类型和NAN
    **/
    function unique(array) {
        /*
        * @param array
        * @array 目标数组
        * @result 结果数组
        **/
        var result = [];
        for(var i = 0; i < array.length; i++) {
            if (result.indexof(array[i] == -1)) {
                result.push(array[i]);
            }
        }
        return result;
    }

#### 方法二 ES6-Set数据结构

    function removePeapetArray(array) {
        /*
         * @param array
         * @array 目标数组
         * 结合ES6的Array.from()方法以及Set数据结构实现数据去重
         **/

        return Array.from(new Set(array));
    }

#### ES6扩展运算符

    // 扩展运算符内部使用for of循环
    // 则另一种数组去重方法如下

    let repeatArr = [1,2,1,2,3,4,5,6,7,8,8,8,9];

    let unique = [...new Set(repeatArr)];


#### 打乱数据顺序

    function upseArray(array) {
        /*
         * @param array
         * @array 目标数组
         **/

        return array.sort(() => {
            return Math.random() - 0.5
        });
    }

#### 获取数组最大值

    function getMaxArray(array) {
        /*
         * @param array
         * @array 目标数组
         **/
        return Math.max.apply(null, array);
    }


#### 结合ES6扩展运算符

    function getMaxVal(arr) {
        return Math.max(...arr);
    }

#### 获取数组最小值

    function getMinArray(array) {
        /*
         * @param array
         * @array 目标数组
         **/
        return Math.min.apply(null, array);
    }


#### 获取数组总和

    function getSumArray(array) {
        /*
         * @param array
         * @array 目标数组
         **/
        let sum = 0;
        const len = array.length;
        for (let i = 0; i < len; i++) {
            sum += array[i];
        }
        return sum;
    }

#### 获取数组平均值

    function getCovArray(array) {
        /*
         * @param array
         * @array 目标数组
         **/
        let sumText = getSumArray(array);
        const len = array.length;
        let cov = sumText / len;
        return cov;
    }


#### 随机获取数组的元素

    function getRandomOneArray(array) {
        /*
         * @param array
         * @array 目标数组
         **/

        return array[Math.floor(Math.random() * array.length)];
    }

#### 获取数组(字符串)元素出现次数

    function getArrayEleCount(array, targeEle) {
        /*
         * @param array
         * @array 目标数组/字符串
         * @targeEle 目标元素
         **/

        let sum = 0;
        const len = array.length;
        for (let i = 0; i < len; i++) {
            if (targeEle == array[i]) {
                sum++;
            }
        }
        return sum;
    }

#### 数据快速排序

    function quickSort(array) {
        /*
         * @param array
         * @array 目标数组
         * @pivotIndex 数组索引的中间值
         * @pivot 数组索引中间值的成员元素
         * @left 小于目标数组中间值的集合
         * @right 大于目标数组中间值的集合
         **/
        var len = array.length;
        if (len <= 1) {
            return array;
        }

        var pivotIndex = Math.floor(len / 2);

        var pivot = array.splice(pivotIndex, 1)[0];

        var left = [];
        var right = [];

        for(let i = 0; i < len; i++) {
            if (array[i] < pivot) {
                left.push(array[i]);
            } else {
                right.push(array[i]);
            }
        }
        // 递归调用函数，对左右两个集合重复此操作，最后合并数组
        return quickSort(left).concat([pivot], quickSort(right));
    }


#### 插值排序


/*
* 算法描述
* 1，从第一个元素开始，该元素可以认为已经被排序
* 2，取出下一个元素，在已经排序的元素序列中从后向前扫描
* 3，若该元素（被对比的已排序的元素）大于新元素，这将该元素移动到下一个位置
* 4，重复3，直到找到已排序的元素的小于或者等于新元素的位置(1)
* 5，将新元素查到该位置(1)后
* 6，重复2-5
**/

let arr1 = [5, 6, 3, 1, 8, 7, 2, 4];

/*
* [5] 6 3 1 8 7 2 4 // 第一个元素被认为已经被排序
* [5,6] 3 1 8 7 2 4 // 6(新元素)与5(已经排序的序列)比较，放置在5后
* [3,5,6] 1 8 7 2 4 // 3与6和5相比较，都小，则将3移动到头部
* [1,3,5,6] 8 7 2 4 // 1与6和5和3相比较，都小，则将1移动到头部
* [1,3,5,6,8] 7 2 4 // 8与6和5和3和1相比较，都大，则将8移动到尾部
* [1,3,5,6,7,8] 2 4 // 7与8和6和5和3和1相比较，小于8，则将8移动到尾部，大于6，则不再移动
* [1,2,3,5,6,7,8] 4 // 2与8和7和6和5和3和1相比较，小于8,8,6,5,3，则将8,7,6,5,3移动到尾部，大于1，则不再移动
**/

/*
* 编程思路：双层循环，外部循环控制未排序的元素，内部循环控制已排序的元素，将未排序的元素设置为标杆基准，与已排序的元素对比，若未排序的元素小于已排序的元素，则交换位置，大于则不动
**/

#### 插值实现

    function insertSort(arr) {
        /*
        * @param arr
        * @arr 目标数组
        * @temp 未排序的标杆元素
        * @len 数组长度
        **/

        let temp,
            len = arr.length;
        // 将第一个元素(index=0)认为已经被排序了，故i从1开始
        for(let i = 1; i < len; i++) {
            temp = arr[i];
            // 已排序的序列从后往前扫描对比
            for(let j = i; j >=0; j--) {
                if (arr[j-1] > temp) {
                    // 交换位置
                    arr[j] = arr[j-1];
                } else {
                    arr[j] = temp;
                    break;
                }
            }
            return arr;
        }
    }

#### 冒泡排序

/*
* 1，比较相邻的元素，若第一个比第二个大，则交换他们两个
* 2，对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对，这一点，最后的元素极为最大的元素
* 3，针对所有的元素重复以上的操作，除了最后一个
* 4，持续每次对越来越少的元素重复以上工作，直到没有任何一对数字需要比较
**/

/*
* 5 6 3 1 8 7 2 4
* [5 6] 3 1 8 7 2 4
* 5 [6 3] 1 8 7 2 4
* 5 3 [6 1] 8 7 2 4
* 5 3 1 [6 8] 7 2 4
* 5 3 1 6 [8 7] 2 4
* 5 3 1 6 7 [8 2] 4
* 5 3 1 6 7 2 [8 4]
* 5 3 1 6 7 2 4 8
**/

/*
* 编程思路：外层循环控制需要比较的元素，比如第一次排序后，最后一个元素就无需再比较了
* 内部循环着负责两两比较
**/

#### 冒泡实现

    function bubbleSort(arr) {
        let len = arr.length;

        for(let i = len - 1; i > 0; i--) {
            for(let j = 0; j < i; j++) {
                if(arr[j] > arr[j+1]) {
                    let temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
        return arr;
    }

#### 数组遍历

    let animals = ['dog','cat','mouse'];

    animals.forEach(item => {
        console.log(item);
    });

    animals.map(item => {
        console.log(item);
    });


#### 克隆字符串 数字 数组 对象

    function cloneItem(items) {
        /*
         * @param items
         * @items 目标数组/字符串
         * @newItem 存储新数组/对象/字符串
         **/
        let newItem;

        if (!(typeof items === 'object')) {
            newItem = items;
        } else {
            if (Array.isArray(items)) {
                newItem = [];
                // items.map(item => {
                //     newItem.push(item);
                // });
                // 结合ES6
                return newItem = Array.from(new Set(array));
            } else {
                // 一般写法
                // newItem = items;
                // ES6 assign()方法将所有可对象枚举属性复制到目标对象
                newItem = {};
                Object.assign(newItem, items);
            }
        }
        console.log(newItem);
        return newItem;
    }


#### 获取数据中出现次数最多的元素以及出现的次数

使用hash对象，数组元素作为hash的键，数组索引作为hash的值

    let arr = ['a', 'a', 'b', 'c', 'b', 'a', 'd'];
    let getMost = function(arr) {
        let hash = {};
        let maxNum = 0;
        let maxEle = null;
        const len = arr.length;
        for (let i = 0; i < len; i++) {
            var el = arr[i];
            hash[el] === undefined ? hash[el] = 1 : (hash[el]++);
            hash[el] >= maxNum && (maxEle = el);
        }
        return console.log(hash[el], hash, el, maxEle);
    };
    getMost(arr);
    let findeMost = function(arr) {
        if (!arr.length) {
            return;
        }
        if (arr.length === 1) {
            return 1;
        }
        let result = {};
        // 遍历数组
        for (let i = 0, len = arr.length; i < len; i++) {
            if (!result[arr[i]]) {
                result[arr[i]] = 1;
            } else {
                result[arr[i]]++;
            }
        }
        // 遍历对象
        let keys = Object.keys(result);
        let maxNum = 0,
            maxEle;
        for (let i = 0, len = keys.length; i < len; i++) {
            if (result[keys[i]] > maxNum) {
                maxNum = result[keys[i]];
                maxEle = keys[i];
            }
        }
        return maxEle;

    };
        
