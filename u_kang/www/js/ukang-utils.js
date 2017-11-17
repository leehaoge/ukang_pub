define(['core/date-utils', 'ukang-constants'], function (DateUtils, CONSTS) {
    'use strict';

    var utils = {
        DateUtils: DateUtils,
        /**
         * 获取采样数据的时间显示内容
         */
        getSampleTimeDisplay: function (timeStr, cmpDate) {
            var sampleDate = DateUtils.parse(timeStr),
                now = cmpDate || new Date(),
                ret = {
                    kind: CONSTS.DT_SPECIFIED
                };

            if (DateUtils.sameDay(sampleDate, now)) {
                ret.kind = CONSTS.DT_SAMEDAY;
                ret.d = DateUtils.format(sampleDate, 'MM/dd')
                // ret.d = '今天';
            } else {
                ret.d = DateUtils.format(sampleDate, 'MM/dd')
                if (DateUtils.sameWeek(sampleDate, now)) {
                    ret.kind = CONSTS.DT_SAMEWEEK;
                } else
                if (DateUtils.sameYear(sampleDate, now)) {
                    ret.kind = CONSTS.DT_SAMEYEAR;
                } else {
                    ret.d = DateUtils.format(sampleDate, 'yy/MM/dd')
                }
            }

            ret.t = DateUtils.format(sampleDate, 'HH:mm');
            return ret;
        },
        dbDate: function(aDate) {
            var d = aDate;
            if (typeof aDate == 'string') {
                var d = DateUtils.parse(aDate);
            }
            return DateUtils.format(d, 'yyyy-MM-dd');
        },
        dbDatetime: function (aDate) {
            var d = aDate, now = new Date();
            if (typeof aDate == 'string') {
                var d = DateUtils.parse(aDate);
            }
            return DateUtils.format(d, 'yyyy-MM-dd HH:mm:ss');
        },
        displayDatetime: function(aDate) {
            var d = aDate, 
                pattern = 'yyyy-MM-dd HH:mm',
                now = new Date();
            if (typeof aDate == 'string') {
                var d = DateUtils.parse(aDate);
            }
            if (DateUtils.sameYear(d, now)) {
                pattern = 'MM-dd HH:mm';
            }
            return DateUtils.format(d, pattern);
        }
    };

    return utils;
});