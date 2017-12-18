define(['Raphael', 'core/context', 'ukang-utils'], function (Raphael, context, UTILS) {
    'use strict';

    var density;

    function trans(v) {
        if (density == undefined) {
            density = context['app'].density;
            density = density < 1.7 ? density : (1.47 + Math.log10(density));
        }
        return 0 | (v * density);
    }

    var attrAxisV = {
            'fill': '#AAA',
            'text-anchor': 'start',
            'font-size': '9px'
        },
        attrAxisTitle = {
            'fill': '#999',
            'text-anchor': 'start',
            'font-size': '10px',
            'font-weight': 'bold'
        }

    function commonAxisInitilize(config, chart) {
        attrAxisV['font-size'] = '' + trans(9) + 'px';
        attrAxisTitle['font-size'] = '' + trans(10) + 'px';
        chart.Axis.xZero = trans(10);
        config.part.x = 0 | ((chart.viewWidth - trans(15) - chart.Axis.xZero) / config.axisCount.x);
        chart.Axis.xMax = chart.Axis.xZero + config.part.x * (config.axisCount.x);
        chart.Axis.yZero = chart.viewHeight - trans(34);
        chart.Axis.yMax = trans(8);
        config.part.y = 0 | ((chart.Axis.yZero - chart.Axis.yMax) / (config.axisCount.y + 0.1));
        config.axisDisplay = config.axisDisplay || {
            x: [],
            y: []
        };
    }

    function commonDrawAxises(config, chart) {
        var strokeBasic = {
                'stroke-width': 1,
                'stroke': '#222',
            },
            strokeGroup = {
                'stroke-width': 1,
                'stroke': '#888',
                'stroke-dasharray': '-'
            },
            strokePart = {
                'stroke-width': 1,
                'stroke': '#AAA',
                'stroke-dasharray': '.'
            };
        //draw basic axises
        //左边Y轴
        var yH = chart.Axis.yZero + trans(25) - chart.Axis.yMax,
            xW = chart.Axis.xMax + trans(10) - chart.Axis.xZero;

        if (chart.vAxis) {
            config.axisCount.y = chart.vAxis.count;
            config.part.y = 0 | ((chart.Axis.yZero - chart.Axis.yMax) / (config.axisCount.y + 0.1));
        }

        chart.paper.path('M' + (chart.Axis.xZero) + ',' + (chart.Axis.yMax) + 'V' + (yH))
            .attr(strokeBasic);
        //下X轴
        chart.paper.path('M' + (chart.Axis.xZero - trans(4)) + ',' + (chart.Axis.yZero) + 'H' + (xW))
            .attr(strokeBasic);

        var pt = {
            x: chart.Axis.xZero,
            y: chart.Axis.yMax
        };
        //画纵轴
        var groupStart = config.axisGroup['xStart'] || 0,
            grp = 0;
        for (var i = 0; i <= config.axisCount.x; i++) {
            var stroke = strokePart,
                lineH = yH - trans(16);
            if (i == config.axisCount.x) stroke = strokeBasic;
            if ((groupStart + i) % config.axisGroup.x == 0) {
                stroke = strokeGroup;
                if (i == config.axisCount.x) stroke = strokeBasic;
                lineH = yH;
                var axisV = config.axisDisplay.x[grp++] || '';
                if (!_.isEmpty(axisV)) {
                    chart.paper.text(pt.x + trans(2), chart.Axis.yZero + trans(12), axisV).attr(attrAxisV);
                }
            }
            if (i > 0) chart.paper.path('M' + (pt.x) + ',' + (pt.y) + 'V' + (lineH)).attr(stroke);
            pt.x += config.part.x;
        }

        //画横轴
        pt = {
            x: chart.Axis.xZero,
            y: chart.Axis.yZero + 1 - config.part.y
        };

        var vY = parseInt(chart.vAxis.min);

        chart.paper.text(chart.Axis.xMax + trans(2), chart.Axis.yZero, vY).attr(attrAxisV);

        for (var i = 1; i <= config.axisCount.y; i++) {
            var stroke = strokeGroup,
                lineW = xW;
            vY += chart.vAxis.step;
            if (i % config.axisGroup.y != 0) {
                stroke = strokePart;
                lineW = xW - trans(16);
            }
            chart.paper.path('M' + (pt.x) + ',' + (pt.y) + 'H' + (lineW)).attr(stroke);
            chart.paper.text(chart.Axis.xMax + trans(2), pt.y, vY).attr(attrAxisV);
            pt.y -= config.part.y;
        }

        if (!_.isEmpty(config.axisDisplay.title))
            chart.paper.text(chart.Axis.xZero - trans(1), chart.Axis.yZero + trans(25), config.axisDisplay.title).attr(attrAxisTitle);
    }


    const attrNotmalDot = {
        'fill': 'red',
        'stroke': 'none'
    };
    const attrMinMaxDot = {
        'fill': 'white',
        'stroke': 'red',
        'stroke-width': '2'
    };

    function paintDot(chart, x, y, attr) {
        attr = attr || attrNormalDot;
        chart.paper.circle(x, y, trans(3)).attr(attr);
    }

    function commonDrawDotChart(config, chart) {
        if (!_.isEmpty(chart.chartData.data)) {
            for (var i in chart.chartData.data) {
                var sample = chart.chartData.data[i], 
                    attr = attrNotmalDot,
                    pt = config.calculateCoordinates(chart, sample);
                if (sample.value1 == chart.chartData.min ||
                    sample.value1 == chart.chartData.max) attr = attrMinMaxDot;
                paintDot(chart, pt.x, pt.y, attr);
            }
        }
    }



    var ChartDrawer = {
        'd': {
            axisCount: {
                x: 24,
                y: 4
            },
            axisGroup: {
                x: 3,
                y: 1
            },
            part: {
                x: 0,
                y: 0
            },
            axisDisplay: {
                x: []
            },
            calculateCoordinates: function(chart, sample) {
                var vX = parseInt(sample.date.substr(11, 2)), pt = {};
                pt.x = 0 | (chart.Axis.xZero + (vX + 0.5) * this.part.x);
                pt.y = 0 | (chart.Axis.yZero + 1 - (sample.value1 - chart.vAxis.min) * this.part.y / chart.vAxis.step);
                return pt;
            },
            initialize: function (chart) {
                this.axisDisplay.title = UTILS.DateUtils.format(new Date(), 'M月d日');
                this.axisDisplay.x = [];
                for (var i = 0; i < this.axisCount.x; i++) {
                    if (i % this.axisGroup.x == 0) {
                        this.axisDisplay.x.push('' + (i) + '时');
                    }
                }
                commonAxisInitilize(this, chart);
            },
            drawAxises: function (chart) {
                commonDrawAxises(this, chart);
            },
            drawChart: function (chart) {
                commonDrawDotChart(this, chart);
            },
        },
        'w': {
            axisCount: {
                x: 7,
                y: 4
            },
            axisGroup: {
                x: 1,
                y: 1
            },
            part: {
                x: 0,
                y: 0
            },
            axisDisplay: {
                x: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            },
            calculateCoordinates: function(chart, sample) {
                var day = UTILS.DateUtils.parse(sample.date).getDay(), pt = {};
                pt.x = 0 | (chart.Axis.xZero + (day + 0.5) * this.part.x);
                pt.y = 0 | (chart.Axis.yZero + 1 - (sample.value1 - chart.vAxis.min) * this.part.y / chart.vAxis.step);
                return pt;
            },
            initialize: function (chart) {
                var d = new Date();
                d.setDate(d.getDate() - d.getDay());
                this.axisDisplay.title = UTILS.DateUtils.format(d, 'M月d日');
                commonAxisInitilize(this, chart);
            },
            drawAxises: function (chart) {
                commonDrawAxises(this, chart);
            },
            drawChart: function (chart) {
                commonDrawDotChart(this, chart);
            },
        },
        'm': {
            axisCount: {
                x: 30,
                y: 4
            },
            axisGroup: {
                x: 7,
                y: 1
            },
            part: {
                x: 0,
                y: 0
            },
            axisDisplay: {
                x: []
            },
            calculateCoordinates: function(chart, sample) {
                var vX = parseInt(sample.date.substr(8, 2)), pt = {};
                pt.x = 0 | (chart.Axis.xZero + (vX - 0.5) * this.part.x);
                pt.y = 0 | (chart.Axis.yZero + 1 - (sample.value1 - chart.vAxis.min) * this.part.y / chart.vAxis.step);
                return pt;
            },
            initialize: function (chart) {
                var d = new Date(),
                    yy = d.getFullYear(),
                    mm = d.getMonth();
                d.setDate(1);
                var day = d.getDay();
                this.axisGroup.xStart = day;
                d.setMonth(mm + 1);
                d.setDate(0);
                this.axisCount.x = d.getDate();
                this.axisDisplay.x = [];
                this.axisDisplay.title = UTILS.DateUtils.format(new Date(), 'yyyy年M月');
                for (var i = 0; i < this.axisCount.x; i++) {
                    day = this.axisGroup.xStart + i;
                    if (day % this.axisGroup.x == 0) {
                        this.axisDisplay.x.push('' + (i + 1) + '日');
                    }
                }
                commonAxisInitilize(this, chart);
            },
            drawAxises: function (chart) {
                commonDrawAxises(this, chart);
            },
            drawChart: function (chart) {
                commonDrawDotChart(this, chart);
            },

        },
        'y': {
            axisCount: {
                x: 12,
                y: 4
            },
            axisGroup: {
                xStart: 1,
                x: 1,
                y: 1
            },
            part: {
                x: 0,
                y: 0
            },
            axisDisplay: {
                x: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            },
            calculateCoordinates: function(chart, sample) {
                var vX = parseInt(sample.date.substr(5, 2)), pt = {};
                pt.x = 0 | (chart.Axis.xZero + (vX - 0.5) * this.part.x);
                pt.y = 0 | (chart.Axis.yZero + 1 - (sample.value1 - chart.vAxis.min) * this.part.y / chart.vAxis.step);
                return pt;
            },
            initialize: function (chart) {
                this.axisDisplay.title = UTILS.DateUtils.format(new Date(), 'yyyy年');
                commonAxisInitilize(this, chart);
            },
            drawAxises: function (chart) {
                commonDrawAxises(this, chart);
            },
            drawChart: function (chart) {
                commonDrawDotChart(this, chart);
            },

        }
    }

    /**
     * 构造函数
     */
    function UKangChart() {

    }

    const
        AxisSteps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

    function axisStepIndex(aStep) {
        for (var i = 0; i < AxisSteps.length; i++) {
            if (aStep == AxisSteps[i]) return i;
        }
        return -1;
    }

    UKangChart.Calculator = function (features) {
        this.features = features || {
            /**
             * 计算特性
             * 1、数据的正常范围：valueRange{min, max, step} step为在AxisSteps中可用的最小值，比如10，则只能往上取unit
             */
            valueRange: {
                min: 32,
                max: 64,
                step: 10
            }
        };
    };

    UKangChart.Calculator.prototype = {
        dataStatistic: {
            min: undefined,
            max: undefined
        },
        mapping: { //数据映射，x=> date, 数值1=>value1, 数值2=>value2，如果数据不一致，需要转换
            //如 'value1': 'value', 'value2': 'max'
        },
        vAxis: {
            count: 4,
            min: 0,
            max: 30,
            step: 10
        },
        calcVAxises: function (minValue, maxValue) {
            var done = false,
                step = this.features.valueRange.step;
            while (!done) {
                var vMin = minValue - minValue % step,
                    vMax = vMin + step * 6;
                if (vMax < maxValue) {
                    var idx = axisStepIndex(step);
                    if (idx == -1) throw 'unsupported step!';
                    step = AxisSteps[idx + 1];
                    continue;
                }
                done = true;
                //计算需要多少step
                var parts;
                for (parts = 6; parts > 3; parts--) {
                    var v = vMin + step * parts;
                    if (v < maxValue) {
                        parts++;
                        break;
                    }
                }
                this.vAxis = {
                    count: parts,
                    min: vMin,
                    max: vMin + step * (parts - 1),
                    step: step
                }
            }
        },
        mapped: function (org, mapping) {
            if (_.isEmpty(mapping)) return org;
            return {
                date: org[mapping['date'] || 'date'],
                value1: org[mapping['value1'] || 'value1'],
                value2: org[mapping['value2'] || 'value2']
            }
        },
        setData: function (data, mapping) {
            var self = this;
            this.all = [];
            if (data) {
                if (_.isEmpty(mapping)) this.all = data;
                else {
                    _.each(data, function (itm) {
                        self.all.push({
                            date: itm[mapping['date'] || 'date'],
                            value1: itm[mapping['value1'] || 'value1'],
                            value2: itm[mapping['value2'] || 'value2']
                        })
                    });
                }
                var dMin = _.min(this.all, function (itm) {
                        return itm.value1;
                    }),
                    dMax = _.max(this.all, function (itm) {
                        return itm.value1;
                    });
                this.dataStatistic.min = dMin.value1;
                this.dataStatistic.max = dMax.value1;
            }
            this.calcVAxises(this.dataStatistic.min || this.features.valueRange.min,
                this.dataStatistic.max || this.features.valueRange.max);
        },
    };


    var c = UKangChart,
        p = c.prototype;

    /**
     * 初始化
     * @param {*} el 
     */
    p.initialize = function (el, chartType, features) {
        this.el = el;
        this.chartType = chartType;
        this.Axis = {
            xZero: 20,
            yZero: 20,
        };
        this.features = { //图标的特性
            valueRange: {
                min: 60,
                max: 100,
                step: 10
            },
            chartType: {
                main: 'dotPlus' //--> line=>线图, bar=>柱状图, dot=>点图, dotPlus=>加强的点图
                //main->主图，如果没有特定的 d/w/m/y 则采用 main
            }
        };
        if (features) {
            this.features = $.extend(this.features, features);
        }
        if (this.el) {
            $(this.el).html('');
            this.paperWidth = this.el.clientWidth;
            this.paperHeight = this.el.clientHeight;
            this.viewWidth = 0 | trans(this.paperWidth);
            this.viewHeight = 0 | trans(this.paperHeight);
            this.paper = Raphael(this.el, this.paperWidth, this.paperHeight);
            this.paper.setViewBox(0, 0, this.viewWidth, this.viewHeight);
            ChartDrawer[this.chartType].initialize(this);
            this.initialized = true;
        }
    };

    p.hide = function () {
        this.paper.canvas.style.display = 'none';
    };

    p.unHide = function () {
        this.paper.canvas.style.display = '';
    };

    /**
     * chartData has format: {
     *      min: xxx,                //==> optional 
     *      max: xxx,                //==> optional
     *      data: [],                //==> must
     * }
     * @param {*} chartData 
     */
    p.drawChart = function (chartData) {
        this.chartData = chartData;
        if (this.paper) {
            this.paper.clear();
            var calculator = new UKangChart.Calculator(this.features),
                minV = (this.features.minValue && 'feature' == this.features.minValue) ? //<--如果features有定义 minValue=='feature'，那么使用 valueRange的min
                this.features.valueRange.min : (chartData.min || this.features.valueRange.min);
            calculator.calcVAxises(minV, chartData.max || this.features.valueRange.max);
            this.vAxis = calculator.vAxis;
            ChartDrawer[this.chartType].drawAxises(this);
            ChartDrawer[this.chartType].drawChart(this);
        }
    };


    return UKangChart;

});