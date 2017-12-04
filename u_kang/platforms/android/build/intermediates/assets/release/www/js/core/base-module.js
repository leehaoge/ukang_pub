define(['core/core', 'core/fragment', 'core/context'], function (CORE, Fragment, context) {
    'use strict';

    var BaseModule = function () {};

    var d = CORE.__define,
        c = BaseModule,
        p = c.prototype;

    p.setDivId = function (theId) {
        this.divId = theId;
    };

    p.load = function (tpl, config, loaded) {
        if (this.divId) {
            this.el = document.getElementById(this.divId);
            var self = this,
                fragment = new Fragment(this.el);
            fragment.load(tpl, config, function () {
                self.tpl = tpl;
                config = config || {};
                self.config = $.extend(self.config, config);
                self.onloaded = loaded;
                self.loaded = true;
                context['current_module'] = self;
                if (loaded && $.isFunction(loaded)) loaded();
                $(self.el).trigger('create');
            });
        } else {
            console.log('No divId specified, please use setDivId first.');
        }
    };

    p.reload = function (config) {
        // if (this.loaded) {
            config = config || {};
            this.config = $.extend(this.config, config);
            this.load(this.tpl, this.config, this.onloaded);
        // }
    };

    p.navigate = function (page) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (page == "") this.reload.apply(this, args);
        else {
            this.pages = this.pages || {};
            if (this.pages[page] && $.isFunction(this.pages[page])) {
                this.pages[page].apply(null, args);
            }
        }
    };


    return BaseModule;

});