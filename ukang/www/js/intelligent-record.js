define(['core/context', 'text!html/intelligentrecord.html', 
    'irecord/record-list', 'irecord/m-input-list'], function(context, tpl, recList, inputList) {
    'use strict';

    function showIRecordTab() {
        var elListUl = document.getElementById('intelligen_records');
        if (elListUl) {
            recList.init(elListUl);
        }
        recList.show();
    }

    function showMInputTab() {
        var elListDIV = document.getElementById('all_manual_records');
        if (elListDIV) {
            inputList.init(elListDIV);
        }
        inputList.show();
    }

    function loaded() {
        $('.ir_frame').height(context['app'].winHeight - context['app'].navbarHeight - 40);
    }

    function afterLoad() {
    }

    var module = {
        tpl: tpl,
        config: {
            irecord_list: recList.getContent(),
            minput_list: inputList.getContent()
        },
        onloaded: loaded,
        afterLoad: afterLoad

    };

    return module;
});