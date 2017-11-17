/* 业务模块 */
define([
    'health-card',          //健康数据
    'health-center',        //健康中心
    'datasource',           //数据来源
    'personal-center'       //个人中心
], function(hcard, hcenter, ds, pc) {
    var modules = {
        healthCard: hcard,
        healthCenter: hcenter,
        datasource: ds,
        personalCenter: pc
    };

    return modules;
});