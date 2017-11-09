define(['core/date-utils', 'ukang-constants'], function (DateUtils, CONSTS) {
    'use strict';

    var utils = {
        DateUtils: DateUtils,
        /**
         * 获取采样数据的时间显示内容
         */
        getSampleTimeDisplay: function (timeStr) {
            var sampleDate = DateUtils.parse(timeStr),
                now = new Date(),
                ret = {
                    kind: CONSTS.DT_SPECIFIED
                };

            if (DateUtils.sameDay(sampleDate, now)) {
                ret.kind = CONSTS.DT_SAMEDAY;
                ret.d = '今天';
            } else {
                ret.d = DateUtils.format(sampleDate, 'MM/dd')
                if (DateUtils.sameWeek(sampleDate, now)) {
                    ret.kind = CONSTS.DT_SAMEWEEK;
                } else
                if (DateUtils.sameYear(sampleDate, now)) {
                    ret.kind = CONSTS.DT_SAMEYEAR;
                }
            }

            ret.t = DateUtils.format(sampleDate, 'HH:mm');
            return ret;
        }
    };

    return utils;
});