define([], function() {
    'use strict';

    var el = undefined, $el = undefined,
        ir_data = [
            {record_type: '血糖', record_time: '2017-10-28 10:35:02', sample_desc: '晚餐前', sample_value: '20.0', sample_unit: 'mmol/L'},
            {record_type: '血压'},
            {record_type: '运动'},
            {record_type: '饮食'},
            {record_type: '体重', record_time: '2017-10-28 15:24:59', sample_desc: '超重', sample_value: '78.0', sample_unit: 'kg'},
            {record_type: '睡眠'},
            {record_type: '情绪'},
            {record_type: '其他'},
            {record_type: '糖化血红蛋白'}
        ], 
        irRecordTpl = 
'<div class="ir_m_record">\
<table border="0" width="100%">\
    <tr>\
        <td width="80px"></td>\
        <td><div class="ir-mrecord-pane">\
            <div><%=record_time%></div>\
            <div><%=record_type%>﹒<%=sample_desc%></div>\
            <div><%=sample_value%><%=sample_unit%></div>\
        </div></td>\
        <td width="15px" valign="middle"><img src="img/lv-more.png" width="15px"></td>\
    </tr>\
</table>\
</div>\
<div class="sep_v_5"></div>\
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
            if (!!!(data['record_time'])) data['record_time'] = '&nbsp;';
            if (!!!(data['sample_desc'])) data['sample_desc'] = '未记录数据';
            if (!!!(data['sample_value'])) data['sample_value'] = '&nbsp;';
            if (!!!(data['sample_unit'])) data['sample_unit'] = '&nbsp;';
            content += compiled(data);
        }
        return content;
    }

    function show() {
        if (el) {
            $el.html(getContent());
            // $el.trigger('create');
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