define(['text!html/personalcenter.html', 'text!html/personalinfo.html', 'core/fragment', 'core/base-module',
        'ukang-app', 'ukang-utils', 'edit-person-info'
    ],
    function (tpl, piHTML, Fragment, BaseModule, ukApp, utils, editInfo) {
        'use strict';

        var module = new BaseModule();

        var tplMain = '\
<div>\
    <div class="person-name-normal">\
        <%=name%>\
    </div>\
    <div class="person-birthday">\
        <%=birthday%> (\
            <%=age%>岁)</div>\
</div>\
<div class="sep_v_20"></div>\
<div class="uk-datalist-pane">\
    <div class="uk-data-title">\
        血型\
    </div>\
    <div class="uk-data-normal">\
        <%=bloodType%>\
    </div>\
</div>\
<div class="uk-datalist-pane">\
    <div class="uk-data-title">\
        体重\
    </div>\
    <div class="uk-data-normal">\
        <%=weight%>千克\
    </div>\
</div>\
<div class="uk-datalist-pane">\
    <div class="uk-data-title">\
        身高\
    </div>\
    <div class="uk-data-normal">\
        <%=height%>厘米\
    </div>\
</div>\
<%=moreinfo%>\
<div class="sep_v_10"></div>\
<div class="ui-grid-a">\
    <div class="ui-block-a">更新于\
        <br>\
        <%=lastUpdate%>\
    </div>\
</div>\
',
            tplItem =
            '<div class="uk-datalist-pane">\
    <div class="uk-data-title">\
        <%=name%>\
    </div>\
    <div class="uk-data-normal">\
        <%=value%>\
    </div>\
</div>';

        var config = {
            person: {
                id: 'default'
            }
        };

        /* 个人信息装入后处理 */
        function piLoaded() {
            $('#ln-pi-cancel').click(function () {
                module.navigate("");
            });
        }

        function infoLoaded() {

        }

        var loaded = function () {
            $('#ln-edit-person').click(function () {
                module.navigate('edit-person-info');
            });

            //div-person-info-disp
            var infoEl = document.getElementById('div-person-info-disp'),
                fragment = new Fragment(infoEl);
            ukApp.get('personInfo', {
                id: module.config.person.id
            }, function (data) {
                if (!_.isEmpty(data)) {
                    var info = data[0],
                        moreinfo = '',
                        itemFunc = _.template(tplItem);
                    module.config.person = info;
                    if (!_.isEmpty(info['medicalMemo'])) {
                        moreinfo += itemFunc({
                            name: '医疗状况',
                            value: info['medicalMemo']
                        });
                    }
                    if (!_.isEmpty(info['allergies'])) {
                        moreinfo += itemFunc({
                            name: '过敏反应',
                            value: info['allergies']
                        });
                    }
                    if (!_.isEmpty(info['medicines'])) {
                        moreinfo += itemFunc({
                            name: '药物使用',
                            value: info['medicines']
                        });
                    }
                    info['moreinfo'] = moreinfo;
                    info['lastUpdate'] = utils.displayDatetime(info['lastUpdate']);
                    fragment.load(tplMain, info, infoLoaded);
                    $(module.el).trigger('create');

                }
            });

        };

        var pages = {
            "edit-person-info": function () {
                editInfo.show(module.el, module.config.person);
            }
        }

        $.extend(module, {
            tpl: tpl,
            config: config,
            pages: pages,
            onloaded: loaded
        });

        return module;
    });