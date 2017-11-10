define(['text!html/datapage.html', 'core/fragment', 'core/context', 'ukang-app', 'chart'],
    function (tpl, Fragment, context, ukApp, Chart) {
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

        var dataPage = {
            config: {
                dataName: ''
            },
            onLayoutLoaded: function () {
                var self = this;
                $('#ln-hc-main').click(function () {
                    var modules = context['app']['modules'];
                    if (modules && modules['healthCard']) {
                        modules['healthCard'].reload();
                    }
                });

                ukApp.get('collectTypes', this.config.dataName, function(data) {
                    self.config.collectInfo = data[0];
                    var $sw = $('#sw-collect');
                    $sw.val(self.config.collectInfo.collected == 1 ? 'on' : 'off');
                    $sw.change(function() {
                        var $this = $(this), val = $this.val();
                        self.config.collectInfo.collected = val == 'on' ? 1 : 0;
                        ukApp.do('setCollect', {
                            key: self.config.dataName,
                            data: self.config.collectInfo
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
                var el = mdlEl,
                    fragment = new Fragment(el);
                this.config = ukApp.cache['types'][dataName];
                fragment.load(tpl, this.config, this.onLayoutLoaded.bind(this));
                $(el).trigger('create');
            }
        };

        return dataPage;

    });