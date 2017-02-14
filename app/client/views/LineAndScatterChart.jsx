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
			date, keys, chart;
		// keys = data.keys();
		// console.log("KEYS: ");
		// console.log(keys);
		// data[0].forEach((d, i) => {
		// 	date = parseTime(d.date);
		// 	d.date = date;
		// });
		console.log('data');
		console.log(data);
		chart = (<ChartCanvas ratio={ratio} width={width} height={400}
			margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
			type={type}
			pointsPerPxThreshold={1}
			seriesName="MSFT"
			data={data}
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
					ticks={5}
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
					yAccessor={d => d.close}
					strokeDasharray="LongDash" />
				<ScatterSeries
					yAccessor={d => d.close}
					marker={CircleMarker}
					markerProps={{ r: 3 }} />
				<OHLCTooltip forChart={1} origin={[-40, 0]} />
			</Chart>

			<CrossHairCursor />
		</ChartCanvas>);
		return (
			null
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