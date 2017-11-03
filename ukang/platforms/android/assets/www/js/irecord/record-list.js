define([], function() {
    'use strict';

    var el = undefined, $el = undefined,
        ir_data = [
            {dev_name: '血糖仪', dev_val: '- -', dev_img_url: 'img/blood-sugar-machine.png'},
            {dev_name: '血压计', dev_val: '- -', dev_img_url: 'img/mc-blood-pressure.png'},
            {dev_name: '尿检仪', dev_val: '- -', dev_img_url: 'img/blood-sugar-machine.png'},
            {dev_name: '血糖仪', dev_val: '- -', dev_img_url: 'img/blood-sugar-machine.png'},
            {dev_name: '血压仪', dev_val: '- -', dev_img_url: 'img/blood-sugar-machine.png'},
            {dev_name: '体脂秤', dev_val: '- -', dev_img_url: 'img/blood-sugar-machine.png'},
            {dev_name: '运动手环', dev_val: '- -', dev_img_url: 'img/blood-sugar-machine.png'}
        ], 
        irRecordTpl = 
'<li><div class="ir-record">\
    <div class="ir-device-pane">\
        <br><span class="ir-device-name"><%=dev_name%></span><br>\
        <br><span class="ir-device-value"><%=dev_val%></span>\
    </div>\
    <div class="ir-device-desc">\
        <div><img src="<%=dev_img_url%>" class="ir-lv-device-pic"></div> \
    </div>\
</div></li>\
';

    function init(_el) {
        el = _el;
        $el = $(el);
    }

    function getContent() {
        var compiled = _.template(irRecordTpl),
        content = '';
        for (var i in ir_data) {
            var data = ir_data[i];
            content += compiled(data);
        }
        return content;
    }

    function show() {
        if (el) {
            $el.html(getContent());
            // $('.app').trigger('create');
        } 
    }

    function refresh() {
        show();
    }


    var module = {
        init: init,
        getContent: getContent,
        show: show,
        refresh: refresh
    };

    return module;
});