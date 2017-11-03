define(['core/core'], function(CORE) {
    'use strict';

    var Fragment = function(el) {
        this.el = el;
    };

    var d=CORE.__define,c=Fragment,p=c.prototype;

    p.create = function() {
        this.el = document.createElement('DIV');
    };

    p.load = function(tpl, config, onloaded) {
        if (this.el) {
            var compiled = _.template(tpl);
            var $el = $(this.el);
            $el.html(compiled(config));
           if (onloaded != undefined) onloaded(); 
        }
    };

    p.html = function(html) {
        if (this.el) {
            $(el).html(html);
        }
    };

    return Fragment;
}); 