define(['text!html/datapage.1.html', 'core/fragment', 'ukang-app', 'chart', 'pop-page'],
function (tpl, Fragment, ukApp, Chart, popPage) {
    'use strict';

    var pageEl,
        config = {
            dataName: ''
        },
        dataPage = {
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

                $(pageEl).trigger('create');
                
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