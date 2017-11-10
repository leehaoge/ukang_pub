define(['core/core', 'core/fragment'], function(CORE, Fragment) {
    'use strict';

    var BaseModule = function () {

    };

    var d=CORE.__define,c=BaseModule,p=c.prototype;

    p.setDivId = function(theId) {
        this.divId = theId;
    };

    p.load = function(tpl, config, loaded) {
        if (this.divId) {
            this.el = document.getElementById(this.divId);
            var self = this, 
                fragment = new Fragment(this.el);
            fragment.load(tpl, config, function() {
                self.tpl = tpl;
                self.config = config;
                self.onloaded = loaded;    
                self.loaded = true;
                if (loaded && $.isFunction(loaded)) loaded();
                $(self.el).trigger('create');
            });
        } else {
            console.log('No divId specified, please use setDivId first.');
        }
    };

    p.reload = function() {
        if (this.loaded) {
            this.load(this.tpl, this.config, this.onloaded);
        }        
    };

    return BaseModule;
    
});