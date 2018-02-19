import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import LineChart from 'react-linechart';
import '../../../../node_modules/react-linechart/dist/styles.css';
import {Chart} from 'react-google-charts';

let getData = (sprints) =>{ 
	const data = {
		labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		datasets: [
			{
				label: 'My First dataset',
				fill: false,
				lineTension: 0.1,
				backgroundColor: 'rgba(75,192,192,0.4)',
				borderColor: 'rgba(75,192,192,1)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgba(75,192,192,1)',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgba(75,192,192,1)',
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [{x: 10, y: 20} , {x: 20, y: 40}, {x: 30, y: 30}, {x: 30, y: 33}, {x: 30, y: 40}, , {x: 30, y: 47}]
			}
		]
	};
	return data;
}


let chartOptions = {
				scales: {
						yAxes: [{
							scaleLabel: {
								display: true,
								labelString: "Tasks"
							}
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: "Time"
							}
						}]
				}
};



class LineComponent extends Component{
	// displayName: 'LineExample'
	getOptimalLine(){
		let rate = this.props.data.totalHours/this.props.data.workDays;
		// console.log(this.props.data.totalHours);
		// console.log(this.props.data.workDays);
		let points = [];
		let workH = 0;
		for(let i=this.props.data.workDays; i>=0; i--){
			points.push([i, workH]);
			workH+=rate;
		}
		return points;
	}
	wrapWithOptimalLine(actualPoints){
		let optimalLine = this.getOptimalLine();
		let wrappedPoints = [];
		if(actualPoints.length > optimalLine.length){
			actualPoints.forEach((point, i) => {
				let wrappedPoint = [point[0], null, point[1]];
				let optimalPoint = optimalLine[point[0]];
				if(optimalPoint)
					wrappedPoint[1] = Math.floor(this.props.data.totalHours-optimalPoint[1]);
				else
					wrappedPoint[1] = null;

				wrappedPoints.push(wrappedPoint);
			})
		}else{
			optimalLine.forEach((point, i) => {
				let wrappedPoint = point
				let actualPoint = actualPoints[point[0]];
				if(actualPoint)
					wrappedPoint.push(actualPoint[1]);
				else
					wrappedPoint.push(null);
				wrappedPoints.push(wrappedPoint);
			})
		}
		return wrappedPoints;
	}
	render() {
		return (
			<div>
				{/*<Line options={chartOptions} data={getData(this.props.sprints)} />*/}
				
				<Chart
				       chartType="LineChart"
				       rows={this.props.data.totalHours?this.wrapWithOptimalLine(this.props.data.actualPoints):[[0,0,0]]}
				       columns={[{"label":"Remaining Time(Days)","type":"number"},{"label":"Optimal remaining work","type":"number"},{"label":"Actual remaining work","type":"number"}]}
				       graph_id="actualLine"
				       width="100%"
				       height="400px"
				       options={{hAxis: {title: 'Remaining Time(Days)'}, vAxis: {title: 'Remaining work(hour)'}}}
				     />

				{/*<LineChart
				 hidePoints={true}
				 hideLines={true}
				 	pointRadius={1}
				 	xLabel="Time(day)"
				 	yLabel="Remaining Work (hour)"
				 	width={600}
				 	height={420}
				 	data={
				 		[
				 			{
				 				color: "#2196F3",
				 				points: this.getOptimalLine()
				 			},
				 			{
				 				color: "#E53935",
				 				points: this.props.data.actualPoints
				 			}
				 		]
				 	}
				 />*/}
				
			</div>
		);
	}
}

export default LineComponent;