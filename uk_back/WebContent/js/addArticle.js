require.config({
    baseUrl: "js",
    paths: {
        'text': 'libs/text',
    },
    shim: {}
});

require(['article-form'], function (articleFormValidator) {
    function checkValid(form) {
        return articleFormValidator.validate(form);
    }

    /** 提交按钮 */
    $('#btn-submit').click(function () {
        var form = document.forms['art-form'];
        if (checkValid(form)) {
            form.submit();
        }
    });
    $('#btn-reset').click(function () {
        document.forms['art-form'].reset();
        $('.invalid-field').removeClass('invalid-field');
    });

});