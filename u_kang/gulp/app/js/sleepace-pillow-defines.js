define([], function() {
    'use strict';


    var SleepaceDefines = {
            "STATE_IDLE": '0',
            "STATE_COLLECTING": '1',
            state: {}
    };


    SleepaceDefines.state[SleepaceDefines.STATE_IDLE] = '未采集';
    SleepaceDefines.state[SleepaceDefines.STATE_COLLECTING] = '采集中';

    return SleepaceDefines;
    
});