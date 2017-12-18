define(['basic-validate'], function(validator) {
    'use strict';

    function validateField(ctrl, canBlank) {
        var isValid = validator.validate(ctrl, canBlank);
        if (isValid) {
            $(ctrl).removeClass('invalid-field');
        } else {
            $(ctrl).addClass('invalid-field');
        }
        return isValid;
    }


    function checkValidate(aForm) {
        var isValid = false;
        if (aForm) {
            isValid = validateField(aForm.title, false) &&
                validateField(aForm.keywords, false) &&
                validateField(aForm.author, false) &&
                validateField(aForm.content, false);
        }

        return isValid;
    }

    var module = {
        validate: checkValidate
    }
   
    return module;
});