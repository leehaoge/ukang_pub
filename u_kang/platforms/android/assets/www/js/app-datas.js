define(['core/data-store', 'core/mock-data'], function(dataStore, MockData) {
    'use strict';

    dataStore.registerItem('健康数据类型', new MockData([
        {dataName:'身高',unit:'厘米'},
        {dataName:'体重',unit:'公斤'},
        {dataName:'血糖',unit:'mmol/L',type:'single'},  //<--- type如果不指定就是single，单一数据
        {dataName:'血压',unit:'毫米汞柱',type:'updown'},
        {dataName:'心率',unit:'次每分钟'},
        {dataName:'体脂率',unit:'%'},
        {dataName:'脱脂体重',unit:'公斤'},
        {dataName:'睡眠',unit:'？'}
    ]));

    dataStore.registerItem('测量数据', new MockData([
        {dataName:'身高', data:[
            {date:'2017-07-10 12:30', value: 176},
            {date:'2017-11-06 00:21', value: 176}
        ]},
        {dataName:'体重', data:[
            {date:'2017-11-09 05:20', value: 76}
        ]},
        {dataName:'血糖', data:[
            {date:'2017-11-05 21:30', value: 18},
            {date:'2017-11-06 17:02', value: 17.2},
            {date:'2017-11-07 18:10', value: 15.3},
            {date:'2017-11-08 18:20', value: 15.5},
            {date:'2017-11-09 09:15', value: 16.6}
        ]}        
    ]));

    dataStore.registerItem('收藏', new MockData([
        {sort:2, dataName:'血糖'}
    ]));
});