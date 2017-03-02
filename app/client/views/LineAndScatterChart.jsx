"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";

import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, helper } from "react-stockcharts";

var { BarSeries, LineSeries, AreaSeries, ScatterSeries, CircleMarker, SquareMarker, TriangleMarker } = series;
var { discontinuousTimeScaleProvider } = scale;

var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } = coordinates;

var { OHLCTooltip, SingleValueTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { fitWidth, TypeChooser } = helper;

class LineAndScatterChart extends React.Component {
	render() {
		console.log('LineAndScatterChart render');
		var { data, type, width, ratio } = this.props,
			parseTime = timeParse("%Y-%m-%dT%H:%M:%S.%LZ"),
			date, keys, chart, hist = [];
		/**
 		 * Testing setting properties
 		 */
		// var myLine = LineSeries

		// console.log(myLine);

		data = data[0];
		console.log('data');
		console.log(data);
		keys = Object.keys(data);
		console.log("KEYS: ");
		console.log(keys);
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
		// console.log(hist);
		var increment = 70;
		var origin = -40;
		// origin = origin + increment;
		var lines = keys.map((value, key) => {
			// console.log(value);
			var line = (
				<LineSeries
					key={key}
					yAccessor={d => d[value]}
					strokeDasharray="Solid" />
			);
			return line;
		});

		var scatters = keys.map((value, key) => {
			// console.log(value);
			var line = (
				<ScatterSeries
					key={key}
					yAccessor={d => d[value]}
					marker={CircleMarker}
					markerProps={{ r: 3 }}
					stroke="green" />
			);
			return line;
		});


		// console.log(lines);

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
					yExtents={d => [d.high, d.low]}
					padding={{ top: 25, bottom: 5 }}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis
						axisAt="right"
						orient="right"
						// tickInterval={5}
						// tickValues={[40, 60]}
						ticks={10}
					/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					{lines}
					{scatters}

					{/*<LineSeries
						yAccessor={d => d[value]}
						strokeDasharray="Solid" />
					<ScatterSeries
						yAccessor={d => d[value]}
						marker={CircleMarker}
						markerProps={{ r: 3 }} />
					<SingleValueTooltip
						yAccessor={d => d[value]}
						yLabel="MS"
						yDisplayFormat={format(".2f")}
						valueStroke="#ff7f0e"
						labelStroke="#4682B4"
						origin={[-40, 0]} />*/}

					{/*<LineSeries
						yAccessor={d => dTWTR}
						strokeDasharray="Solid"
						stroke="green" />
					<ScatterSeries
						yAccessor={d => dTWTR}
						marker={CircleMarker}
						markerProps={{ r: 3 }}
						stroke="green" />
					<SingleValueTooltip
						yAccessor={d => dTWTR}
						yLabel="TWTR"
						yDisplayFormat={format(".2f")}
						valueStroke="#2ca02c"
						labelStroke="#4682B4"
						origin={[30, 0]} />
					<SingleValueTooltip
						yAccessor={d => dTWTR}
						yLabel="TWTR"
						yDisplayFormat={format(".2f")}
						valueStroke="#2ca02c"
						labelStroke="#4682B4"
						origin={[100, 0]} />*/}
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

LineSeries.defaultProps = {
	className: "line ",
	strokeWidth: 1,
	hoverStrokeWidth: 4,
	fill: "none",
	stroke: "#4682B4",
	strokeDasharray: "Solid",
	defined: d => !isNaN(d),
	hoverTolerance: 6,
	highlightOnHover: true,
	connectNulls: false,
	onClick: function (e) { console.log("Click", e); },
	onDoubleClick: function (e) { console.log("Double Click", e); },
	onContextMenu: function (e) { console.log("Right Click", e); },
};

export default LineAndScatterChart;