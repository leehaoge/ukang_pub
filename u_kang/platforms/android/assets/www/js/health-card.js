define(['text!html/healthcard.html', 'ukang-app', 'core/core', 'core/fragment', 'core/base-module', 'data-page', 'data-list', 
    'calendar', 'gym-record', 'think-trainning', 'nutritions', 'sleeping-info', 'health-record', 'body-measurement', 'reproductive',
    'data-result', 'heart-info', 'body-charactor', 'data-page1', 'bluetooth-scan', 'sleepace-pillow'],
    function (tpl, ukApp, CORE, Fragment, BaseModule, dataPage, dataList, calendar, gymRecord, thinkTrainning, nutritions, 
        sleepingInfo, healthRecord, bodyMeasurement, reproductive, dataResult, heartInfo, bodyCharactor, dataPage1, bluetoothScan,
        sleepacePillow) {
        'use strict';

        const tplGroup = '\
        <div>\
            <div class="uk-group-title"><%=title%></div>\
            <%=data%>\
        </div>\
        ',
            tplSample = '\
        <div class="uk-highlight-data ui-body-a uk-data-link" data-id="<%=dataName%>">\
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
            funcRestItem = _.template(tplRestItem),
            ym;

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
                    module.config.dataName = dataName;
                    module.config.pageFrom = {
                        id: "",
                        display: "健康数据"
                    };
                        module.navigate("data-page");
                }
            };
            $('.uk-data-link').click(intoDataView);
            $('#ln-hc-calendar').click(function () {
                module.navigate("calendar");
            });
            $('#lh-pc-main').click(function() {
                $('#ln-personal-center').trigger('click');
                // ukApp.navigate('personalCenter', "");
            });
            $('#hc-main-type-list a').click(function () {
                var $this = $(this), pageId = $this.attr('data-id');
                module.navigate('type-' + pageId);
            });

            var theDate = module.config.date || new Date();
            var today = (typeof theDate == "string") ? CORE.DateUtils.parse(theDate) : theDate,
                days = CORE.DateUtils.sameWeekDays(today),
                weekDay = today.getDay(),
                dd = {},
                sToday = CORE.DateUtils.format(today, 'yyyy年MM月dd日') + ' ' + CORE.DateUtils.locale.dayNames[weekDay];

            ym = today.getFullYear() + '-' + (today.getMonth() + 1) + '-';

            for (var i in days) {
                dd['d' + i] = days[i];
            }

            CORE.DomUtil.setValue(document.getElementById('hc-main-cal'), dd);

            document.getElementById('hc-main-today').innerHTML = sToday;

            $('#hc-main-cal .uk-hc-weekday-display').each(function () {
                var $this = $(this);
                if ($this.attr('data-id') == 'd' + weekDay) $this.addClass('uk-hc-current');
                else $this.removeClass('uk-hc-current');

                $this.click(function() {
                    module.navigate("", {date: ym + $this.html()});
                });
            });


        }

        var onHighlightData = function (data) {
                var infoContent = '    <div id="hc-main-cal" class="uk-hc-week-cal">\
                <div class="uk-hc-weekday-a">日</div>\
                <div class="uk-hc-weekday-b">一</div>\
                <div class="uk-hc-weekday-c">二</div>\
                <div class="uk-hc-weekday-d">三</div>\
                <div class="uk-hc-weekday-e">四</div>\
                <div class="uk-hc-weekday-f">五</div>\
                <div class="uk-hc-weekday-g">六</div>\
                <div class="uk-hc-weekday-display uk-hc-weekday-a" data-id="d0"></div>\
                <div class="uk-hc-weekday-display uk-hc-weekday-b" data-id="d1"></div>\
                <div class="uk-hc-weekday-display uk-hc-weekday-c" data-id="d2"></div>\
                <div class="uk-hc-weekday-display uk-hc-weekday-d" data-id="d3"></div>\
                <div class="uk-hc-weekday-display uk-hc-weekday-e" data-id="d4"></div>\
                <div class="uk-hc-weekday-display uk-hc-weekday-f" data-id="d5"></div>\
                <div class="uk-hc-weekday-display uk-hc-weekday-g" data-id="d6"></div>\
            </div>\
            <div class="text-center" id="hc-main-today"></div>',
                    hcEl = document.getElementById('hc-main-pane'),
                    hcFragment = new Fragment(hcEl);
                if (data) {
                    if (data.hasData) {
                        infoContent += getGroupContent('个人收藏', 'collected', data);
                        infoContent += getGroupContent('当天', 'today', data);
                        // infoContent += getGroupContent('本周', 'thisweek', data);
                        // infoContent += getGroupContent('今年', 'thisyear', data);
                        // infoContent += getGroupContent('更早', 'specified', data);
                    }
                    // if (data.rests && _.isArray(data.rests) && !_.isEmpty(data.rests)) {
                    //     if (infoContent.length > 0) infoContent += '\
                    //         <div class="sep_v_10"></div>\
                    // ';
                    //     var restList = '';
                    //     for (var i in data.rests) {
                    //         restList += funcRestItem(data.rests[i]);
                    //     }
                    //     infoContent += funcRests({
                    //         list: restList
                    //     });
                    // }
                }
                hcFragment.load(infoContent, {}, setDataLinks);
                $(hcEl).trigger('create');
            },
            loaded = function () {
                $('.uk-hc-img-li').click(function() {
                    var $this = $(this), pageId = $this.attr('data-id');
                    module.navigate(pageId);
                });
                $('#hc-main-type-list a').click(function() {

                });

                ukApp.get('highlights', {
                    date: module.config.date || new Date()
                }, onHighlightData);
            },
            pages = {
                "data-page": function () {
                    dataPage1.show(module.el, module.config.dataName);
                },
                "data-list": function () {
                    dataList.show(module.el, module.config.dataName);
                },
                "calendar": function () {
                    calendar.show(module.el);
                },
                "gym": function() {
                    gymRecord.show(module.el);
                },
                "think": function() {
                    thinkTrainning.show(module.el);
                },
                "nutritions": function() {
                    nutritions.show(module.el);
                },
                "sleeping": function() {
                    sleepingInfo.show(module.el);
                },
                "health-record": function() {
                    healthRecord.show(module.el);
                },
                "type-hr": function() {
                    healthRecord.show(module.el);
                },
                "type-bm": function() {
                    bodyMeasurement.show(module.el);
                },
                "type-re": function() {
                    reproductive.show(module.el);
                },
                "type-dr": function() {
                    dataResult.show(module.el);
                },
                "type-ht": function() {
                    heartInfo.show(module.el);
                },
                "type-bc": function() {
                    bodyCharactor.show(module.el);
                },
                "bt-scan": function() {
                    bluetoothScan.show(module.el);
                },
                "sleepace-pillow": function() {
                    sleepacePillow.show(module.el);
                },
                "refresh-view": function() {
                    dataPage1.refreshView();
                }
            };


        $.extend(module, {
            tpl: tpl,
            config: {},
            pages: pages,
            onloaded: loaded
        });

        return module;
    });