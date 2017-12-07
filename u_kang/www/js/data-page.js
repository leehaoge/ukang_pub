define(['text!html/datapage.html', 'core/fragment', 'ukang-app', 'pop-page'],
    function (tpl, Fragment, ukApp, popPage) {
        'use strict';

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