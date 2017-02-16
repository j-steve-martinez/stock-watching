"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, helper } from "react-stockcharts";

var { BarSeries, LineSeries, AreaSeries, ScatterSeries, CircleMarker, SquareMarker, TriangleMarker } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = coordinates;

var { OHLCTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { fitWidth, TypeChooser } = helper;

class LineAndScatterChart extends React.Component {
	render() {
		console.log('LineAndScatterChart render');
		var { data, type, width, ratio } = this.props,
			parseTime = timeParse("%Y-%m-%dT%H:%M:%S.%LZ"),
			date, keys, chart, hist = [];
		data = data[0];
		// console.log('data');
		// console.log(data);
		keys = Object.keys(data);
		// console.log("KEYS: ");
		// console.log(keys);
		var len = data[keys[0]].length;
		// console.log(len);
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

		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
				margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
				type={type}
				pointsPerPxThreshold={1}
				seriesName="MSFT"
				data={hist}
				xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
				xExtents={[new Date(2016, 0, 1), new Date(2016, 3, 1)]}>
				<Chart id={1}
					yExtents={d => [d.high, d.low]}>
					
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis
						axisAt="right"
						orient="right"
						// tickInterval={5}
						// tickValues={[40, 60]}
						ticks={20}
					/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<LineSeries
						yAccessor={d => d.GOOG}
						strokeDasharray="LongDash" />
					<ScatterSeries
						yAccessor={d => d.GOOG}
						marker={CircleMarker}
						markerProps={{ r: 3 }} />

					<LineSeries
						yAccessor={d => d.MSFT}
						strokeDasharray="LongDash" />
					<ScatterSeries
						yAccessor={d => d.MSFT}
						marker={CircleMarker}
						markerProps={{ r: 3 }} />
					<OHLCTooltip forChart={1} origin={[-20, 0]} />
				</Chart>

				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

LineAndScatterChart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChart.defaultProps = {
	type: "svg",
};
LineAndScatterChart = fitWidth(LineAndScatterChart);

export default LineAndScatterChart;