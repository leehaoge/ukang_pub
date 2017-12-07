define(['text!html/datapage.1.html', 'core/fragment', 'ukang-app', 'pop-page', 'ukang-chart'],
    function (tpl, Fragment, ukApp, popPage, UKangChart) {
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
                        {
                            date: '2017-12-07 18:10',
                            value1: '85'
                        },
                    ]
                },
                w: {
                    data: []
                },
                m: {
                    data: []
                },
                y: {
                    data: []
                }
            };

        function getChartData(chartId) {
            if (fakeData[chartId]) {
                var ret = fakeData[chartId];
                if (ret['data'] && !_.isEmpty(ret['data'])) {
                    var dMin = _.min(ret.data, function(itm) {
                        return itm.value1;
                    }), dMax = _.max(ret.data, function(itm) {
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


        var pageEl,
            config = {
                dataName: ''
            },
            dataPage = {
                showChart: function (chartId) {
                    var chartData = getChartData(chartId);
                    var chart = new UKangChart();
                    chart.initialize(document.getElementById('ukang-chart-pane'), 
                            chartId, charFeatures);
                    chart.drawChart(chartData);
                },
                onLayoutLoaded: function () {
                    var self = this,
                        appModule = ukApp.currentModule();

                    this.charts = {};

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
                }
            };

        return dataPage;

    });