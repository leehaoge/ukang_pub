define(['text!html/healthcard.html', 'ukang-app', 'core/fragment', 'core/base-module', 'data-page'],
    function (tpl, ukApp, Fragment, BaseModule, dataPage) {
        'use strict';

        const tplGroup = '\
        <div>\
            <div class="uk-group-title"><%=title%></div>\
            <%=data%>\
        </div>\
        ',
            tplSample = '\
        <div class="uk-highlight-data ui-body-a ui-corner-all uk-data-link" data-id="<%=dataName%>">\
            <div class="uk-highlight-dataname"><%=dataName%></div>\
                <div class="uk-highlight-data-content">\
                    <div><span class="uk-highlight-data-value"><%=value%></span><span class="uk-highlight-data-unit"><%=unit%></span></div>\
                <div class="uk-time-small"><%=d%> <%=t%></div>\
            </div>\
        </div>\
        <div class="sep_v_3"></div>\
        ',
            tplRests = '\
        <div>\
            <div class="uk-group-title">没有已记录的数据</div>\
            <ul id="hc-lv-01" data-role="listview">\
                <%=list%>\
            </ul>\
        </div>\
        ',
            tplRestItem = '\
        <li><a href="#" class="uk-data-link" data-id="<%=dataName%>"><%=dataName%></a></li>';

        var module = new BaseModule();
        var funcGroup = _.template(tplGroup),
            funcSample = _.template(tplSample),
            funcRests = _.template(tplRests),
            funcRestItem = _.template(tplRestItem);

        function getGroupContent(group, ident, data) {
            var ret = '',
                records = data.hasData[ident];
            if (records && _.isArray(records) && !_.isEmpty(records)) {
                var dataContent = '';
                for (var i in records) {
                    var record = records[i];
                    dataContent += funcSample(record);
                }
                ret = funcGroup({
                    title: group,
                    data: dataContent
                });
            }
            return ret;
        }

        function setDataLinks() {
            var intoDataView = function () {
                var self = this,
                    $this = $(this),
                    dataName = $this.attr('data-id');
                if (dataName && module.el) {
                    dataPage.show(module.el, dataName);
                }
            };
            $('.uk-data-link').click(intoDataView);
        }

        var onHighlightData = function (data) {
                var infoContent = '',
                    hcEl = document.getElementById('hc-main-pane'),
                    hcFragment = new Fragment(hcEl);
                if (data) {
                    if (data.hasData) {
                        infoContent += getGroupContent('个人收藏', 'collected', data);
                        infoContent += getGroupContent('今天', 'today', data);
                        infoContent += getGroupContent('本周', 'thisweek', data);
                        infoContent += getGroupContent('今年', 'thisyear', data);
                        infoContent += getGroupContent('更早', 'specified', data);
                    }
                    if (data.rests && _.isArray(data.rests) && !_.isEmpty(data.rests)) {
                        if (infoContent.length > 0) infoContent += '\
                            <div class="sep_v_10"></div>\
                    ';
                        var restList = '';
                        for (var i in data.rests) {
                            restList += funcRestItem(data.rests[i]);
                        }
                        infoContent += funcRests({
                            list: restList
                        });
                    }
                }
                hcFragment.load(infoContent, {}, setDataLinks);
            },
            loaded = function () {
                ukApp.get('highlights', null, onHighlightData);
            };


        $.extend(module, {
            tpl: tpl,
            config: {},
            onloaded: loaded
        });

        return module;
    });