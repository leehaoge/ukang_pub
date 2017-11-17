define(['text!html/datalist.html', 'core/fragment', 'ukang-app'], function (tpl, Fragment, ukApp) {
    'use strict';

    var tplDataItem = '<li>\
    <div class="ui-grid-a">\
        <div class="ui-block-a"><%=value1%>\
        </div>\
        <div class="ui-block-b text-right"><%=date%>\
        </div>\
    </li>';

    var pageEl, config = {},
        onLayoutLoaded = function () {
            var appModule = ukApp.currentModule();
            $('#ln-to-data').click(function () {
                appModule.navigate("data-page");
            });

            ukApp.get("getData", {
                dataName: config.dataName
            }, function (data) {
                if (_.isEmpty(data)) {
                    $('#nodata-pane').removeClass("hidden");
                } else {
                    var compiled = _.template(tplDataItem),
                        content = '';
                    for (var i in data) {
                        content += compiled(data[i]);
                    }
                    $('#datalist-ul').html(content);
                    $('#datalist-pane').removeClass('hidden');
                }
            });
        },
        module = {
            show: function (el, dataName) {
                pageEl = el;
                var fragment = new Fragment(pageEl);
                config = ukApp.cache['types'][dataName];
                fragment.load(tpl, config, onLayoutLoaded)
                $(pageEl).trigger('create');
            }
        };

    return module;

});