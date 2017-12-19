require.config({
    baseUrl: "js",
    paths: {
        'text': 'libs/text',
    },
    shim: {}
});

require([], function () {
    $('#btn-add').click(function() {
        window.location.href = window.app.contextPath + "app/article/add.htmls";
    });
});