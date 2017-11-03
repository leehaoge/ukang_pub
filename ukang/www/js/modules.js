/* 业务模块 */
define([
    'health-card',          //健康卡片
    'personal-doctor',      //私人医师
    'more',                 //更多
    'intelligent-record',   //智能记录
    'personal-center'       //个人中心
], function(hc, pd, mr, ir, pc) {
    var modules = {
        healthCard: hc,
        personalDoctor: pd,
        more: mr,
        intelligentRecord: ir,
        personalCenter: pc
    };

    return modules;
});