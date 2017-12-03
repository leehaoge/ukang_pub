define(['sleepace-pillow-defines'], function (PillowDefines) {
    'use strict';

    var plugin = window.SleepacePillow;

    function PillowControl(config) {
        this.config = {
            userId: 1234,
            deviceCode: '',
            device: undefined, //设备信息
            onData: null, //获得数据
            onStateChanged: null, //状态变化
            onFailure: null, //发生错误
        }
        this.initialize(config);
    }

    var c = PillowControl,
        p = c.prototype;

    function executeCallback(cb) {
        if (cb && $.isFunction(cb)) {
            var args = arguments;
            Array.prototype.shift.apply(args);
            cb.apply(null, args);
        }
    }

    /**
     * 初始化
     * @param {*} config 
     */
    p.initialize = function (config) {
        this.config = $.extend(this.config, config);
        this.state = PillowDefines.STATE_IDLE;
        this.connected = false;
        executeCallback(this.config.onStateChanged, this.state);
    };

    p.getCollectState = function () {
        return PillowDefines.state[this.state];
    };

    p.setState = function (state) {
        if (this.state != state) {
            this.state = state;
            executeCallback(this.config.onStateChanged, this.state);
        }
    };

    p.startRealTimeData = function() {
        var self = this;
        if (this.state == PillowDefines.STATE_COLLECTING) {
            plugin.startRealTimeData(function(msg) {
                if (msg && msg['status']) {
                    if ('RealTimeData' == msg.status) {
                        executeCallback(self.config.onData, msg.data);
                    }
                }
            }, function (error) {
                console.log(error);
                executeCallback(self.config.onFailure, {
                    source: 'startRealTimeData',
                    error: error
                });
            });
        }
    };

    p.stopRealTimeData = function(cbSuccess) {
        var self = this;
        plugin.stopRealTimeData(function() {
            executeCallback(cbSuccess);   
        });
    };

    p.startCollect = function () {
        var self = this;
        if (!this.connected) return;
        if (this.state != PillowDefines.STATE_COLLECTING) {
            plugin.startCollect(function(msg) {
                if (msg && msg['status']) {
                    if ('connected' == msg.status) {
                        //连接状态变化
                        self.setState(PillowDefines.STATE_COLLECTING);
                    }
                }
            }, function (error) {
                console.log(error);
                executeCallback(self.config.onFailure, {
                    source: 'startCollect',
                    error: error
                });
            });
        }
    };

    p.stopCollect = function () {
        var self = this;
        if (this.state == PillowDefines.STATE_COLLECTING) {
            plugin.stopCollect(function () {
                self.setState(PillowDefines.STATE_IDLE);
            });
        }

    };

    p.connect = function (cbSuccess, cbFailure) {
        var self = this;
        plugin.connect(function (msg) {
            self.connected = msg.connected;
            executeCallback(cbSuccess);
        }, function (error) {
            self.connected = false;
            executeCallback(cbFailure, error);
        }, {
            deviceName: this.config.device.deviceName,
            address: this.config.device.address,
            userId: this.config.userId,
            deviceCode: this.config.deviceCode,
        });
    };

    p.disconnect = function () {
        if (this.connected) {
            plugin.disconnect();
            this.connected = false;
        }
    };


    PillowControl.selfTest = function (config) {
        var preState = PillowDefines.STATE_IDLE,
            _default = {
                userId: 111,
                deviceCode: '3-6',
                device: {
                    device: "FC:3C:D0:05:FE:5F",
                    modelName: "Sleepace P1",
                    address: "FC:3C:D0:05:FE:5F",
                    deviceName: "P10016A00630",
                    deviceId: "P10016A00630"
                }, //设备信息
                onData: function (data) {
                    console.log(data);
                }, //获得数据
                onStateChanged: function (state) {
                    console.log(state);
                    if (state == PillowDefines.STATE_COLLECTING) {
                        intf.startRealTimeData();
                        //测试20秒
                        setTimeout(endTest, 20000);
                    } else
                    if (state == PillowDefines.STATE_IDLE && preState == PillowDefines.STATE_COLLECTING) {
                        //
                        intf.disconnect();
                        console.log('self test success!');
                    }
                    if (intf) preState = intf.state;
                }, //状态变化
                onFailure: function (failure) {
                    console.log(failure.source + ' fail:' + failure.error);
                    if ('connect' == failure.source ||
                        'startCollect' == failure.source) {
                        console.log('self test fail!');
                    }
                }
            },
            config = $.extend(_default, config || {}),
            intf = new PillowControl(config);


        function endTest() {
            intf.stopRealTimeData(function() {
                intf.stopCollect();
            });
        }

        intf.connect(function () {
            intf.startCollect();
        });

    };


    return PillowControl;
});