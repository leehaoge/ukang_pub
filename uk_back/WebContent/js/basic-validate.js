define([], function() {
    'use strict';

    var validator = {
        'common': { //any input that can get value by $(ctrl).val()
            validate: function(ctrl, canBlank, pattern) {
                var $ctrl = $(ctrl), val = $ctrl.val();
                if (false === canBlank) {
                    if (_.isEmpty(val)) return false;
                }
                if (pattern != undefined) {
                    if (!val.match(pattern)) return false;
                }                

                return true;
            }
        }
    }



    function controlValidate(ctrl, canBlank, pattern) {
        if (ctrl && ctrl.nodeName) {
            var ident = ctrl.nodeName;
            if (!!!(validator[ctrl.nodeName])) {
                ident = 'common';
            }
            return validator[ident].validate(ctrl, canBlank, pattern);
        }
        return false;
    }

    var module = {
        validate: controlValidate
    };

    return module;    
});