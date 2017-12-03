define([], function() {
    'use strict';

    var types = {
        data: [
            {dataName: "步行和跑步距离", unitDisp: "公里"},
            {dataName: "锻炼分钟数", unitDisp: "分钟"},

            {dataName: "划水次数", unitDisp: "次"},
            {dataName: "活动能量", unitDisp: "千卡"},
            {dataName: "健身记录", unitDisp: ""},
            {dataName: "静息能量", unitDisp: "千卡"},
            {dataName: "轮椅距离", unitDisp: "公里"},
            {dataName: "骑车距离", unitDisp: "公里"},
            {dataName: "体能训练", unitDisp: ""},
            {dataName: "推动次数", unitDisp: "次"},
            {dataName: "游泳距离", unitDisp: "米"},
            {dataName: "站立小时", unitDisp: ""},
            {dataName: "最大摄氧量", unitDisp: "毫升/(千克*分钟)"},
            {dataName: "NikeFuel", unitDisp: ""},

            {dataName:"饱和脂肪", unitDisp:"克"},
            {dataName:"单元不饱和脂肪", unitDisp:"克"},
            {dataName:"蛋白质", unitDisp:"克"},
            {dataName:"碘", unitDisp:"微克"},
            {dataName:"多元不饱和脂肪", unitDisp:"克"},
            {dataName:"泛酸", unitDisp:"毫克"},
            {dataName:"钙", unitDisp:"毫克"},
            {dataName:"铬", unitDisp:"微克"},
            {dataName:"核黄素", unitDisp:"毫克"},
            {dataName:"钾", unitDisp:"毫克"},
            {dataName:"咖啡因", unitDisp:"毫克"},
            {dataName:"磷", unitDisp:"毫克"},
            {dataName:"硫胺", unitDisp:"毫克"},
            {dataName:"氯化物", unitDisp:"毫克"},
            {dataName:"镁", unitDisp:"毫克"},
            {dataName:"锰", unitDisp:"毫克"},
            {dataName:"钼", unitDisp:"微克"},
            {dataName:"纳", unitDisp:"毫克"},
            {dataName:"膳食胆固醇", unitDisp:"毫克"},
            {dataName:"膳食能量", unitDisp:"千卡"},
            {dataName:"膳食糖", unitDisp:"克"},
            {dataName:"生物素", unitDisp:"微克"},
            {dataName:"水", unitDisp:"毫升"},
            {dataName:"碳水化合物", unitDisp:"克"},
            {dataName:"铁", unitDisp:"毫克"},
            {dataName:"铜", unitDisp:"毫克"},
            {dataName:"维生素 A", unitDisp:"微克"},
            {dataName:"维生素 B12", unitDisp:"微克"},
            {dataName:"维生素 B6", unitDisp:"毫克"},
            {dataName:"维生素 C", unitDisp:"毫克"},
            {dataName:"维生素 D", unitDisp:"微克"},
            {dataName:"维生素 E", unitDisp:"毫克"},
            {dataName:"维生素 K", unitDisp:"微克"},
            {dataName:"硒", unitDisp:"微克"},
            {dataName:"纤维", unitDisp:"克"},
            {dataName:"锌", unitDisp:"毫克"},
            {dataName:"烟酸", unitDisp:"毫克"},
            {dataName:"叶酸", unitDisp:"微克"},
            {dataName:"总脂肪", unitDisp:"克"},
            
            {dataName:"睡眠分析", unitDisp:""},
            
            {dataName:"步行平均心率", unitDisp:"每分钟次数"},
            {dataName:"心率", unitDisp:"每分钟次数"},
            {dataName:"血压", unitDisp:"毫米汞柱"},
            {dataName:"静息心率", unitDisp:"每分钟次数"},
            {dataName:"心率变异性", unitDisp:"毫秒"},
            {dataName:"心率升高通知", unitDisp:""},


            {dataName: "步数", unitDisp: "步"},
            {dataName: "已爬楼层", unitDisp: "层"},
            {dataName: "身高", unitDisp: "厘米"},
            {dataName: "去脂体重", unitDisp: "公斤"},
            {dataName: "身高体重指数", unitDisp: "身高体重指数"},
            {dataName: "体脂率", unitDisp: "百分比"},
            {dataName: "腰围", unitDisp: "厘米"},

            {dataName: "性行为", unitDisp: ""},
            {dataName: "点滴出血", unitDisp: ""},
            {dataName: "宫颈粘液质量", unitDisp: ""},
            {dataName: "基础体温", unitDisp: "摄氏度"},
            {dataName: "体温", unitDisp: "摄氏度"},
            {dataName: "排卵测试结果", unitDisp: ""},
            {dataName: "月经", unitDisp: ""},

            {dataName: "呼吸速率", unitDisp: "每分钟呼吸次数"},
            
            {dataName: "血糖", unitDisp: "毫摩尔/升"},
            {dataName: "第一次用力呼气量", unitDisp: "公升"},
            {dataName: "呼气流量峰值", unitDisp: "公升/分钟"},
            {dataName: "末梢灌注指数", unitDisp: "百分比"},
            {dataName: "皮电活动", unitDisp: "微西"},
            {dataName: "摔倒次数", unitDisp: ""},
            {dataName: "吸入剂用量", unitDisp: ""},
            {dataName: "血氧饱和度", unitDisp: "百分比"},
            {dataName: "血液酒精浓度", unitDisp: "百分比"},
            {dataName: "胰岛素输注", unitDisp: "胰岛素单位"},
            {dataName: "紫外线指数", unitDisp: ""},
            {dataName: "最大肺活量", unitDisp: "公升"},
            
            {dataName: "体重", unitDisp: "公斤"}
        ],
        indexed: {}
    };

    types.indexed = _.indexBy(types.data, 'dataName');

    return types;
});