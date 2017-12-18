/**
 * 各种常数
 */
define([], function () {

    return {
        /* 日期类型 */
        DT_SAMEDAY: 1, //今天
        DT_SAMEWEEK: 2, //本周
        DT_SAMEYEAR: 3, //今年       
        DT_SPECIFIED: 4, //其他
        //----------------------

        VERSION: 0.2,   //版本号

        /** 数据库表名字 */
        "TB_基本数据类型": 'basic_data_type',
        "TB_健康数据类型": 'health_data_type',
        "TB_数据单位": 'data_unit',
        "TB_收藏": 'my_collection',
        "TB_测量数据": 'data_samples',
        "TB_系统配置": 'sys_settings',
        "TB_APP用户": 'app_user',
        //----------------------

        "ajax_root": 'http://192.168.31.58:8085/ukang',
        "ajax_ext": '.htmls',

        //-----------------------------
        DUMMY: ''
    };
});