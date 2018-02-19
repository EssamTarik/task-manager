import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';

class PieChart extends Component{
	render() {

		let data = {
			labels: [
				'Complete',
				'Incomplete',
			],
			datasets: [{
				data: [this.props.complete, this.props.incomplete],
				backgroundColor: [
				'#FF6384',
				'#36A2EB',
				],
				hoverBackgroundColor: [
				'#FF6384',
				'#36A2EB',
				]
			}]
		};
		return (
			<div>
				<Pie data={data}
				options={{tooltips: {callbacks: {
					label: (tooltipItem, data) => {
						let value = data.datasets[0].data[tooltipItem.index];
						return `${value}%`;
					}}}}
				} />
			</div>
		);
	}
}

export default PieChart;