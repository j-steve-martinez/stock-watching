"use strict";
import React from "react";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;

var { OHLCTooltip, MovingAverageTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { ema, sma } = indicator;

var { fitWidth, TypeChooser } = helper;

class StockChart extends React.Component {
    render() {
        var { data, type, width, ratio } = this.props,
            parseTime = timeParse("%Y-%m-%dT%H:%M:%S.%LZ"),
            keys, chart, hist = [], indicators = {};

        data = data[0];
        console.log('data');
        console.log(data);
        keys = Object.keys(data);
        console.log("KEYS: ");
        console.log(keys);
        var len = data[keys[0]].length;
        console.log(len);
        for (var i = 0; i < len; i++) {
            var day = {};
            // console.log("The number is " + i);
            keys.forEach(name => {
                // console.log(name);
                // console.log(data[name][i]);

				/**
				 * Set the symbol close
				 */
                day[name] = +data[name][i].close;

				/**
				 * Set the high for the y axis
				 */
                if (day.high === undefined || day.high < data[name][i].high) {
                    day.high = data[name][i].high
                }

				/**
				 * Set the low for the y axis
				 */
                if (day.low === undefined || day.low > data[name][i].low) {
                    day.low = data[name][i].low
                }

				/**
				 * Set the close for testing
				 */
                if (day.close === undefined) {
                    day.close = +data[name][i].close;
                }

				/**
				 * Set the date for the x axis ticks
				 */
                if (day.date === undefined) {
                    day.date = parseTime(data[name][i].date);
                }
            });
            // console.log(day.date);
            // console.log(day);
            hist.push(day);
        }
        console.log(hist);

        /**
         * Create an object to hold the indicator functions
         *  use the key name as the function placeholders
         */
        keys.forEach(value => {
            indicators[value] = value;
        });
        console.log(indicators);

        return (
            null
        );
    }
}

function mkInd(){
    console.log(mkInd);
}

StockChart.propTypes = {
    data: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    ratio: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

StockChart.defaultProps = {
    type: "svg",
};

StockChart = fitWidth(StockChart);

export default StockChart;

/*
<SingleValueTooltip
    yAccessor={d => d.AAPLClose}
    yLabel="AAPL"
    yDisplayFormat={d3.format(".2f")}
    valueStroke="#ff7f0e"
    labelStroke="#4682B4" - optional prop
    origin={[-40, 20]}/>

<SingleValueTooltip
    yAccessor={d => d.SP500Close}
    yLabel="S&P 500"
    yDisplayFormat={d3.format(".2f")}
    valueStroke="#2ca02c"
    labelStroke="#4682B4" - optional prop
    origin={[-40, 35]}/>
*/
