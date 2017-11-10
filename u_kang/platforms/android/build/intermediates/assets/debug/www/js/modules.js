/* 业务模块 */
define([
    'health-card',          //健康数据
    'today',                //今天
    'datasource',           //数据来源
    'personal-center'       //个人中心
], function(hc, td, ds, pc) {
    var modules = {
        healthCard: hc,
        today: td,
        datasource: ds,
        personalCenter: pc
    };

    return modules;
});