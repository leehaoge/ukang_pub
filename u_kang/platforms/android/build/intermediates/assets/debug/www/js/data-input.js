define(['text!html/datainput.html', 'core/fragment', 'core/core', 'ukang-utils', 'ukang-app'], function (tpl, Fragment, CORE, utils, ukApp) {
    'use strict';

    var config = {
            dataName: ''
        },
        module = {
            show: function (conf) {
                if ((conf && conf['dataName']))
                    config.dataName = conf.dataName;
                var el = document.getElementById('pop_page_frame'),
                    $el = $(el),
                    fragment = new Fragment(el),
                    now = new Date(),
                    sToday = utils.DateUtils.format(now, 'yyyy-MM-dd'),
                    sTime = utils.DateUtils.format(now, 'HH:mm'),
                    pageLoaded = function () {
                        $('#ln-di-add').click(function () {
                            var val = CORE.DomUtil.getValue(document.getElementById('uk-di-frame'));
                            if (!_.isEmpty(val['sampleDate']) && !_.isEmpty(val['sampleTime']) && !_.isEmpty(val['value1'])) {
                                var data = {
                                    dataName: config.dataName,
                                    date: val['sampleDate'] + ' ' + val['sampleTime'],
                                    value1: val['value1'],
                                    value2: null
                                };
                                ukApp.do('addData', data, function() {
                                    $(document).one('pagechange', function() {
                                        ukApp.currentModule().navigate('refresh-view');
                                    });
                                    $.mobile.changePage('#app_main_page', {
                                        showLoadMsg: false
                                    });
                                });
                            }
                        });
                    };

                fragment.load(tpl, {
                    dataName: config.dataName,
                    today: sToday,
                    nowtime: sTime
                }, pageLoaded);
                $el.trigger('create');
            }
        };

    return module;

});