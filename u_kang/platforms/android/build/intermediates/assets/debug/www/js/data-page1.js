define(['text!html/datapage.1.html', 'core/fragment', 'ukang-utils', 'ukang-app', 'pop-page', 'ukang-chart'],
    function (tpl, Fragment, UTILS, ukApp, popPage, UKangChart) {
        'use strict';

        var charFeatures = {
                valueRange: {
                    min: 30,
                    max: 80,
                    step: 5
                },
                //minValue: 'feature'          // 'feature' or 'data', default is 'data'
            },
            fakeData = {
                d: {
                    data: [{
                            date: '2017-12-07 10:23',
                            value1: '75'
                        },
                        {
                            date: '2017-12-07 07:20',
                            value1: '64'
                        },
                        {
                            date: '2017-12-07 13:13',
                            value1: '72'
                        },
                        {
                            date: '2017-12-07 14:15',
                            value1: '69'
                        },
                    ]
                },
                w: {
                    data: [{
                            date: '2017-12-07 10:23',
                            value1: '75'
                        },
                        {
                            date: '2017-12-07 07:20',
                            value1: '64'
                        },
                        {
                            date: '2017-12-07 13:13',
                            value1: '72'
                        },
                        {
                            date: '2017-12-07 14:15',
                            value1: '69'
                        },
                        {
                            date: '2017-12-03 18:10',
                            value1: '67'
                        },
                        {
                            date: '2017-12-03 09:10',
                            value1: '72'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '71'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '77'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '81'
                        },
                        {
                            date: '2017-12-05 18:10',
                            value1: '80'
                        },
                        {
                            date: '2017-12-06 18:10',
                            value1: '66'
                        },
                        {
                            date: '2017-12-06 18:10',
                            value1: '74'
                        },
                    ]
                },
                m: {
                    data: [{
                            date: '2017-12-07 10:23',
                            value1: '75'
                        },
                        {
                            date: '2017-12-07 07:20',
                            value1: '64'
                        },
                        {
                            date: '2017-12-07 13:13',
                            value1: '72'
                        },
                        {
                            date: '2017-12-07 14:15',
                            value1: '69'
                        },
                        {
                            date: '2017-12-03 18:10',
                            value1: '67'
                        },
                        {
                            date: '2017-12-03 09:10',
                            value1: '72'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '71'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '77'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '81'
                        },
                        {
                            date: '2017-12-05 18:10',
                            value1: '80'
                        },
                        {
                            date: '2017-12-06 18:10',
                            value1: '66'
                        },
                        {
                            date: '2017-12-06 18:10',
                            value1: '74'
                        },

                    ]
                },
                y: {
                    data: [{
                            date: '2017-12-07 10:23',
                            value1: '75'
                        },
                        {
                            date: '2017-12-07 07:20',
                            value1: '64'
                        },
                        {
                            date: '2017-12-07 13:13',
                            value1: '72'
                        },
                        {
                            date: '2017-12-07 14:15',
                            value1: '69'
                        },
                        {
                            date: '2017-12-03 18:10',
                            value1: '67'
                        },
                        {
                            date: '2017-12-03 09:10',
                            value1: '72'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '71'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '77'
                        },
                        {
                            date: '2017-12-04 18:10',
                            value1: '81'
                        },
                        {
                            date: '2017-12-05 18:10',
                            value1: '80'
                        },
                        {
                            date: '2017-12-06 18:10',
                            value1: '66'
                        },
                        {
                            date: '2017-12-06 18:10',
                            value1: '74'
                        },

                    ]
                }
            };

        function getChartData_fake(chartId) {
            if (fakeData[chartId]) {
                var ret = fakeData[chartId];
                if (ret['data'] && !_.isEmpty(ret['data'])) {
                    var dMin = _.min(ret.data, function (itm) {
                            return itm.value1;
                        }),
                        dMax = _.max(ret.data, function (itm) {
                            return itm.value1;
                        });
                    ret.min = dMin.value1;
                    ret.max = dMax.value1;
                }
                return ret;
            }
            return {
                data: []
            }
        }

        function getChartData(chartId, onData, refDate) {
            var filter = {
                    dataName: config.dataName
                }, cDate = refDate || new Date(),
                gotData = function(data) {
                    var ret = {data: data};
                    if (ret['data'] && !_.isEmpty(ret['data'])) {
                        var dMin = _.min(ret.data, function (itm) {
                                return itm.value1;
                            }),
                            dMax = _.max(ret.data, function (itm) {
                                return itm.value1;
                            });
                        ret.min = dMin.value1;
                        ret.max = dMax.value1;
                    }
                    onData(ret);
                };
            if ('d' == chartId) {
                filter.date = UTILS.DateUtils.format(cDate, 'yyyy-MM-dd');
                ukApp.get('dataOfDate', filter, gotData);
            } else
            if ('w' == chartId) {
                var day = cDate.getDay();
                cDate.setDate(cDate.getDate() - day);
                filter.startDate = UTILS.DateUtils.format(cDate, 'yyyy-MM-dd');
                cDate.setDate(cDate.getDate() + 6);
                filter.endDate = UTILS.DateUtils.format(cDate, 'yyyy-MM-dd');
                ukApp.get('getData', filter, gotData);
            } else
            if ('m' == chartId) {
                filter.month = UTILS.DateUtils.format(cDate, 'yyyy-MM');
                ukApp.get('getData', filter, gotData);
            } else
            if ('y' == chartId) {
                filter.year = UTILS.DateUtils.format(cDate, 'yyyy');
                ukApp.get('getData', filter, gotData);
            } 
        }

        var pageEl,
            config = {
                dataName: ''
            },
            dataPage = {
                showChart: function (chartId) {
                    getChartData(chartId, function(chartData) {
                        var chart = new UKangChart();
                        chart.initialize(document.getElementById('ukang-chart-pane'),
                            chartId, charFeatures);
                        chart.drawChart(chartData);
                    });
                },
                onLayoutLoaded: function () {
                    var self = this,
                        appModule = ukApp.currentModule();

                    if (appModule && appModule.config && appModule.config.pageFrom) {
                        $('#name-back-to').html(appModule.config.pageFrom.display);
                        $('#ln-hc-main').click(function () {
                            appModule.navigate(appModule.config.pageFrom.id);
                        });
                    } else {
                        $('#name-back-to').html('健康数据');
                        $('#ln-hc-main').click(function () {
                            appModule.navigate('');
                        });
                    }

                    $('#ln-data-input').click(function () {
                        $(document).one("pagechange", function (e, f) {
                            popPage.navigate("data-input", {
                                dataName: config.dataName
                            });
                        });
                        $.mobile.changePage('#app_pop_page_1', {
                            showLoadMsg: false
                        });
                    });

                    $('#ln-show-data').click(function () {
                        appModule.navigate("data-list");
                    });

                    $('.uk-period-block').click(function () {
                        var $this = $(this),
                            dataId = $this.attr('data-id');
                        $('.uk-period-block').removeClass('uk-data-period-selected');
                        $this.addClass('uk-data-period-selected');
                        self.showChart(dataId);
                    });

                    ukApp.get('collectTypes', {
                        dataName: config.dataName
                    }, function (data) {
                        config.collectInfo = data[0];
                        var $sw = $('#sw-collect');
                        $sw.val(config.collectInfo.collected == 1 ? 'on' : 'off');
                        $sw.change(function () {
                            var $this = $(this),
                                val = $this.val();
                            config.collectInfo.collected = val == 'on' ? 1 : 0;
                            ukApp.do('setCollect', {
                                key: {
                                    dataName: config.dataName
                                },
                                data: config.collectInfo
                            });
                        });
                    });

                    $(pageEl).trigger('create');
                    this.showChart('d');

                },
                show: function (mdlEl, dataName) {
                    pageEl = mdlEl;
                    var fragment = new Fragment(pageEl);
                    config = ukApp.typeData.indexed[dataName];
                    config.showUnit = "";
                    if (config && _.isEmpty(config.unitDisp)) config.showUnit = "hidden";
                    fragment.load(tpl, config, this.onLayoutLoaded.bind(this));
                },
                refreshView: function() {
                    $('.uk-data-period-selected').trigger('click');
                }
            };

        return dataPage;

    });