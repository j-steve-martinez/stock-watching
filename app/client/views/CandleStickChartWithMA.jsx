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
var { ema, sma, change } = indicator;

var { fitWidth, TypeChooser } = helper;

class CandleStickChartWithMA extends React.Component {
	render() {
		var { data, type, width, ratio } = this.props;
		var parseTime = timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

		console.log(data);
		console.log(parseTime);

		var symbol = data[0].symbol;
		data.forEach(d => {
			console.log(d.date);
			d.date = parseTime(d.date);
			d.open = +d.open;
			d.high = +d.high;
			d.low = +d.low;
			d.close = +d.close;
			d.volume = +d.volume;
		});

		console.log(data);
		var test = {ms : 'MS'};
		test.ms 
		
		test.ms = change()
			// .windowSize(20)
			.sourcePath("close")
			.merge((d, c) => { d.low = c })
			.accessor(d => d.close)
			.stroke("blue")
			.fill("blue");
console.log(test.ms);
		var ema20 = ema()
			.windowSize(20) // optional will default to 10
			.sourcePath("close") // optional will default to close as the source
			.skipUndefined(true) // defaults to true
			.merge((d, c) => { d.open = c }) // Required, if not provided, log a error
			.accessor(d => d.open) // Required, if not provided, log an error during calculation
			.stroke("blue") // Optional

		var sma20 = sma()
			.windowSize(20)
			.sourcePath("low")
			.merge((d, c) => { d.low = c })
			.accessor(d => d.low)
			.stroke("yellow")
			.fill("yellow");

		var ema50 = ema()
			.windowSize(50)
			.sourcePath("high")
			.merge((d, c) => { d.high = c })
			.accessor(d => d.high)
			.stroke("red")
			.fill("red");

		var smaVolume50 = sma()
			.windowSize(50)
			.sourcePath("volume")
			.merge((d, c) => { d.volume = c })
			.accessor(d => d.volume)
			.stroke("green")
			.fill("green");
		var test2 = [test.ms.accessor(), sma20.accessor(), ema20.accessor(), ema50.accessor()];
		return (
			<ChartCanvas ratio={ratio} width={width} height={400}
				margin={{ left: 70, right: 70, top: 10, bottom: 30 }} 
				type={type}
				seriesName="All Stock"
				data={data} 
				calculator={[test.ms, sma20, ema20, ema50, smaVolume50]}
				xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider}
				xExtents={[new Date(2016, 0, 1), new Date(2016, 0, 29)]}>
				<Chart id={1}
					yExtents={[d => [d.high, d.low], test2]}
					padding={{ top: 100, bottom: 50 }}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={5} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					{/*<LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />*/}
					<LineSeries yAccessor={test.ms.accessor()} stroke={test.ms.stroke()} />
					{/*<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />*/}
					{/*<CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />*/}
					<CurrentCoordinate yAccessor={test.ms.accessor()} fill={test.ms.stroke()} />
					{/*<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />*/}

					<OHLCTooltip origin={[-40, 0]} />
					<MovingAverageTooltip onClick={(e) => console.log(e)} origin={[-38, 15]}
						calculators={[test.ms, sma20, ema20, ema50]} />
				</Chart>
				{/*<CrossHairCursor />*/}
			</ChartCanvas>
		);
	}
}

CandleStickChartWithMA.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithMA.defaultProps = {
	type: "svg",
};

CandleStickChartWithMA = fitWidth(CandleStickChartWithMA);

export default CandleStickChartWithMA;