define(['text!html/datapage.html', 'core/fragment', 'core/context', 'chart'],
    function (tpl, Fragment, context, Chart) {
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
                $('#ln-hc-main').click(function () {
                    var modules = context['app']['modules'];
                    if (modules && modules['healthCard']) {
                        modules['healthCard'].reload();
                    }
                });

                var ctx = document.getElementById('data-chart').getContext('2d');

                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ["0", "3", "6", "9", "12", "15", "18", "21", "0"],
                        datasets: [{
                                fillColor: "rgba(220,220,220,0.5)",
                                strokeColor: "rgba(220,220,220,1)",
                                pointColor: "rgba(220,220,220,1)",
                                pointStrokeColor: "#fff",
                                lineTension: 0,
                                data: [65, 59, 90, 81, 56, 55, 40]
                            },
                            {
                                fillColor: "rgba(151,187,205,0.5)",
                                strokeColor: "rgba(151,187,205,1)",
                                pointColor: "rgba(151,187,205,1)",
                                pointStrokeColor: "#fff",
                                data: [38, 48, 40, 19, 96, 27, 100]
                            }
                        ]
                    },
                    options: {
                        elements: {
                            line: {
                                tension: 0, // disables bezier curves
                            }
                        },
                        scales: {
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        },
                        animation: {
                            duration: 0, // general animation time
                        },
                        hover: {
                            animationDuration: 0, // duration of animations when hovering an item
                        },
                        responsiveAnimationDuration: 0, // animation duration after a resize
                    }
                });
            },
            show: function (mdlEl, dataName) {
                var el = mdlEl,
                    fragment = new Fragment(el);
                this.config.dataName = dataName;
                fragment.load(tpl, this.config, this.onLayoutLoaded.bind(this));
                $(el).trigger('create');
            }
        };

        return dataPage;

    });