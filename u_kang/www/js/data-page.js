define(['text!html/datapage.html', 'core/fragment', 'ukang-app', 'chart', 'pop-page'],
    function (tpl, Fragment, ukApp, Chart, popPage) {
        'use strict';

        // var chartData = {
        //     labels : ["January","February","March","April","May","June","July"],
        //     datasets : [
        //         {
        //             fillColor : "rgba(220,220,220,0.5)",
        //             strokeColor : "rgba(220,220,220,1)",
        //             pointColor : "rgba(220,220,220,1)",
        //             pointStrokeColor : "#fff",
        //             data : [65,59,90,81,56,55,40]
        //         },
        //         {
        //             fillColor : "rgba(151,187,205,0.5)",
        //             strokeColor : "rgba(151,187,205,1)",
        //             pointColor : "rgba(151,187,205,1)",
        //             pointStrokeColor : "#fff",
        //             data : [28,48,40,19,96,27,100]
        //         }
        //     ]
        // };

        var pageEl,
            config = {
                dataName: ''
            },
            dataPage = {
                onLayoutLoaded: function () {
                    var self = this,
                        appModule = ukApp.currentModule();
                    $('#ln-hc-main').click(function () {
                        appModule.navigate("");
                    });

                    $('#ln-data-input').click(function () {
                        $(document).one("pagechange", function (e, f) {
                            popPage.navigate("data-input", {dataName: config.dataName});
                        });
                        $.mobile.changePage('#app_pop_page_1', {
                            showLoadMsg: false
                        });
                    });

                    $('#ln-show-data').click(function () {
                        appModule.navigate("data-list");
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


                    // var ctx = document.getElementById('data-chart').getContext('2d');

                    // var myChart = new Chart(ctx,{
                    //     type: 'line',
                    //     data: {
                    //         datasets: [{
                    //             label: 'First dataset',
                    //             data: [0, 20, 40, 50]
                    //         }],
                    //         labels: ['January', 'February', 'March', 'April']
                    //     },
                    //     options: {
                    //         scale: {
                    //             ticks: {
                    //                 suggestedMin: 50,
                    //                 suggestedMax: 100
                    //             }
                    //         }
                    //     }
                    // });
                },
                show: function (mdlEl, dataName) {
                    pageEl = mdlEl;
                    var fragment = new Fragment(pageEl);
                    config = ukApp.cache['types'][dataName];
                    fragment.load(tpl, config, this.onLayoutLoaded.bind(this));
                    $(pageEl).trigger('create');
                }
            };

        return dataPage;

    });