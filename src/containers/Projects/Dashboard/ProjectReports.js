import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MediaQuery from 'react-responsive';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import navigateProject from '../../../actions/Routing/navigateProject';
import getAllSprints from '../../../actions/Reports/getAllSprints';
import getAllIncompleteTasks from '../../../actions/Reports/getAllIncompleteTasks';
import getProject from '../../../actions/Projects/getProject';
import Line from './Line';
import moment from 'moment';
import lodash from 'lodash';
import TaskIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import BugIcon from 'material-ui/svg-icons/action/bug-report';
import StoryIcon from 'material-ui/svg-icons/action/receipt';
import HighPriorityIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import LowPriorityIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import MediumPriorityIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import PrintIcon from 'material-ui/svg-icons/action/print';

class ProjectReports extends Component{
	constructor(props){
		super(props);
		this.state = {selected: 0};
		this.onChange = this.onChange.bind(this);
	}
	onChange(event, index, value){
		this.setState({selected: value});		
	}
	readTaskPriority(priority){
		if(typeof(priority) == 'string' || priority instanceof String)
			priority = parseInt(priority);
	
		switch(priority){
			case 1:
				return <HighPriorityIcon color="#D50000"/>
			case 2:
				return <MediumPriorityIcon color="#FFAB00"/>
			case 3:
				return <LowPriorityIcon color="#00E676"/>
			default:
				return null;
		}
	}
	renderSprintList(){
		return this.props.AllSprints.map((sprint) => {
			return <MenuItem key={sprint.key} value={sprint.key} primaryText={sprint.name} />;
		});
	}
	componentDidUpdate(){
		if(this.state.selected == null && this.props.AllSprints[0])
			this.setState({selected: this.props.AllSprints[0].key});
	}
	getCurrentSprint(){
		let thisstate = this.state;
		let ret = false;
		if(this.state.selected === 0)
			return this.props.AllSprints;

		this.props.AllSprints.map((sprint) => {
			if(sprint.key == thisstate.selected){
				ret = sprint;
			}
		});
		return ret;
	}

	componentDidMount(){
		this.props.navigateProject(3);
		this.props.getProject(this.props.params.id);
		this.props.getAllSprints(this.props.params.id);
		this.props.getAllIncompleteTasks(this.props.params.id);
	}

	readTaskIcon(type){
		switch(type){
			case "1":
				return <TaskIcon color="#00C853"/>
			case "2":
				return <BugIcon color="#C62828"/>
			case "3":
				return <StoryIcon color="#0097A7"/>
			default:
				return null;
		}
	}

	readTaskStatus(status){
		let color = "white";
		let backgroundColor = '';

		if(status === "To Do"){
			backgroundColor = "#039BE5";
		}
		else if(status === "Done"){
			backgroundColor = "#43A047";
		}
		else{
			backgroundColor = "#FFEB3B";
			color = '#424242';
		}
		return (
			<div className="uk-border-rounded" style={{textAlign: 'center', color: color, backgroundColor: backgroundColor}}>{status}</div>
		);
	}
	renderTable(){
		try{
			return (
				<Table>
				  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
					  <TableHeaderColumn>Task</TableHeaderColumn>
					  <TableHeaderColumn>Owner</TableHeaderColumn>
					  <TableHeaderColumn>sprint</TableHeaderColumn>
					  <TableHeaderColumn>Issue Type</TableHeaderColumn>
					  <TableHeaderColumn>Priority</TableHeaderColumn>
					  <TableHeaderColumn>Status</TableHeaderColumn>
					  <TableHeaderColumn>Time</TableHeaderColumn>
					</TableRow>
				  </TableHeader>
				  <TableBody displayRowCheckbox={false}>
				  {
				  	this.state.selected === 0 ? (
				  		this.getCurrentSprint().map((sprint) => {
				  				return sprint.tasks.map((task) => {
				  					return (
				  						  		<TableRow key={task.key} >
				  								  	<TableRowColumn>{task.name}</TableRowColumn>
				  								  	<TableRowColumn>{task.owner.name}</TableRowColumn>
				  								  	<TableRowColumn>{sprint.name}</TableRowColumn>
				  								  	<TableRowColumn>{this.readTaskIcon(task.type)}</TableRowColumn>
				  								  	<TableRowColumn>{this.readTaskPriority(task.priority)}</TableRowColumn>
				  								  	<TableRowColumn>{this.readTaskStatus(task.status)}</TableRowColumn>
				  								  	<TableRowColumn>{`${task.time}/${Math.round(moment.duration(task.duration).asHours())}`}</TableRowColumn>
				  						  		</TableRow>
				  					);
				  				})
				  		})
				  	):(
				  	this.getCurrentSprint().tasks.map((task) => {
				  		return (
				  			  		<TableRow key={task.key} >
				  					  	<TableRowColumn>{task.name}</TableRowColumn>
				  					  	<TableRowColumn>{task.owner.name}</TableRowColumn>
				  						<TableRowColumn>{this.getCurrentSprint().name}</TableRowColumn>
				  					  	<TableRowColumn>{this.readTaskIcon(task.type)}</TableRowColumn>
				  					  	<TableRowColumn>{this.readTaskPriority(task.priority)}</TableRowColumn>
				  					  	<TableRowColumn>{this.readTaskStatus(task.status)}</TableRowColumn>
				  					  	<TableRowColumn>{`${task.time}/${Math.round(moment.duration(task.duration).asHours())}`}</TableRowColumn>
				  			  		</TableRow>
				  		);
				  })
				  )
				  }
				  </TableBody>
				</Table>
			);
		}catch(e){
			return null;
		}
	}
	renderIncompleteTasksTable(){
		try{
			return (
				<Table>
				  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
					  <TableHeaderColumn>Task</TableHeaderColumn>
					  <TableHeaderColumn>Owner</TableHeaderColumn>
					  <TableHeaderColumn>Issue Type</TableHeaderColumn>
					  <TableHeaderColumn>Priority</TableHeaderColumn>
					  <TableHeaderColumn>Status</TableHeaderColumn>
					  <TableHeaderColumn>Time</TableHeaderColumn>
					</TableRow>
				  </TableHeader>
				  <TableBody displayRowCheckbox={false}>
				  {
				  	lodash.toArray(this.props.AllIncompleteTasks[this.getCurrentSprint().key]).map((task) => {
				  		return (
				  			  		<TableRow key={task.original} >
				  					  	<TableRowColumn>{task.name}</TableRowColumn>
				  					  	<TableRowColumn>{task.owner.name}</TableRowColumn>
				  					  	<TableRowColumn>{this.readTaskIcon(task.type)}</TableRowColumn>
				  					  	<TableRowColumn>{this.readTaskPriority(task.priority)}</TableRowColumn>
				  					  	<TableRowColumn>{this.readTaskStatus(task.status)}</TableRowColumn>
				  					  	<TableRowColumn>{`${task.time}/${Math.round(moment.duration(task.duration).asHours())}`}</TableRowColumn>
				  			  		</TableRow>
				  		);
				  })
				  }
				  </TableBody>
				</Table>
			);
		}catch(e){
			return null;
		}
	}
	getFinishedBetween(beginning, end){
		let time = 0;
		if(this.state.selected === 0){
			this.props.AllSprints.forEach((sprint) => {
				sprint.tasks.forEach((task) => {
					if(task.endDate){
						let endDate = new Date(task.endDate);
						// endDate.setHours(0,0,0,0)
						if(endDate.getTime() >= beginning && endDate.getTime() <= end){
							// console.log(task.name);
							if(task.time){
								time += parseInt(task.time);
							}
						}
					}
				})
			})
		}else if(this.getCurrentSprint().tasks){
			this.getCurrentSprint().tasks.forEach((task) => {
				if(task.endDate){
					let endDate = new Date(task.endDate);
					// endDate.setHours(0,0,0,0);
					if(endDate.getTime() >= beginning && endDate.getTime() <= end){
						// console.log(task.name);
						if(task.time){
							time += parseInt(task.time);
						}
					}
				}
			})
		}
		// console.log(`${time} between ${new Date(beginning)} and ${new Date(end)}`);
		return time;
	}
	getMaxDate(){
		let maxDate = new Date(this.props.Project.endDate).getTime();
		if(this.state.selected !== 0 && this.getCurrentSprint().tasks){
			maxDate = new Date(this.getCurrentSprint().endDate).getTime();
			this.getCurrentSprint().tasks.forEach((task) => {
				if(task.endDate){
					let taskEndDate = new Date(task.endDate);
					if(taskEndDate.getTime() > maxDate)
						maxDate = taskEndDate.getTime()
				}
			})
		}else{
			this.props.AllSprints.forEach((sprint) => {
				sprint.tasks.forEach((task) => {
					if(task.endDate){
						let taskEndDate = new Date(task.endDate);
						if(taskEndDate.getTime() > maxDate)
							maxDate = taskEndDate.getTime()
					}
				})
			})
		}
		if(new Date().getTime() > maxDate && this.total > this.complete)
			return new Date().getTime()
		else
			return maxDate;
	}
	getTotalTime(){
		let total = 0;
		let complete = 0;
		if(this.state.selected === 0 ){
			total = this.props.Project.totalTime;
			complete = this.props.Project.finishedTasksTime;
		}else{
			if(this.getCurrentSprint().tasks){
				this.getCurrentSprint().tasks.forEach((task) => {
					total += parseInt(task.time);
					if(task.status.toLowerCase() === 'done')
						complete += parseInt(task.time);
				})
			}
		}
		this.total = total;
		this.complete = complete;
		return total;

	}
	getTasksDoneBeforeBeginning(beginning){
		let done = 0;
		if(this.state.selected === 0 ){
			this.props.AllSprints.forEach((sprint) => {
				sprint.tasks.forEach((task) => {
					if(task.endDate && task.endDate < beginning){
						console.log(task)
						done += parseInt(task.time);
					}
				})
			})
		}else{
			if(this.getCurrentSprint().tasks){
				this.getCurrentSprint().tasks.forEach((task) => {
					if(task.endDate && task.endDate < beginning){
						done += parseInt(task.time);
					}
				})
			}
		}
		return done;
	}
	getChartData(){
		let totalWorkHours = this.getTotalTime();
		let maxDate = this.getMaxDate()
		let start = this.state.selected !== 0 ? new Date(this.getCurrentSprint().startDate) : new Date(this.props.Project.startDate);
		start.setHours(0,0,0,0);
		let startDateObj = this.state.selected !== 0 ? new Date(this.getCurrentSprint().startDate) : new Date(this.props.Project.startDate);
		startDateObj.setHours(0,0,0,0);
		
		let end = new Date(maxDate);
		end.setHours(0,0,0,0);
		let endDateObj = this.state.selected !== 0 ? new Date(this.getCurrentSprint().endDate) : new Date(this.props.Project.endDate);
		endDateObj.setHours(0,0,0,0);
		
		let duration = moment.duration(end.getTime() - start.getTime());
		let optimalDuration = moment.duration(endDateObj.getTime() - startDateObj.getTime());
		
		let OptimalWorkDays = Math.round(optimalDuration.asDays())+1;
		let workDays = Math.round(duration.asDays())+1;
		
		let startingPoint = totalWorkHours - this.getTasksDoneBeforeBeginning(start.getTime());
		let points = [[0, startingPoint]];
		let dayms = 86400000;

		let lastRemaining = totalWorkHours;
		let totalFinished = 0;
		let today = new Date();
		today.setHours(0,0,0,0);
		for(let x = 1; x<=workDays; x++){
			if((x-1)*dayms+startDateObj.getTime() > today.getTime()){
				break;
			}
			let timeBetween = 0;
			if(x === workDays){
				timeBetween = this.getFinishedBetween((x-1)*dayms+startDateObj.getTime(), maxDate);
			}
			else
				timeBetween = this.getFinishedBetween((x-1)*dayms+startDateObj.getTime(), x*dayms+startDateObj.getTime());
			
			totalFinished += timeBetween;
			let remaining = startingPoint - totalFinished;
			if(timeBetween === 0)
				remaining = lastRemaining;
			points.push([x, remaining]);
			lastRemaining = remaining;
		}
		// lodash.toArray(this.props.Project.burndownLog).map((point) => {
		// 	let day = new moment(new Date(point.time));
		// 	day = moment.duration(day.diff(start));
		// 	day = Math.ceil(day.asDays());
		// 	let remainingWork = point.finishedHours;
		// 	points.push({x: day, y: remainingWork});
		// });
		return {totalHours: totalWorkHours, workDays: OptimalWorkDays, actualPoints: points};
	}
	render(){
		return (
			<div className="uk-margin-small-top uk-margin-small-left">
			<div className='uk-grid'>
			<div className="uk-width-1-2">
			<SelectField value={this.state.selected} onChange={this.onChange} floatingLabelText="Select Sprint" autoWidth={false} style={{float: "left", width: 200}}>
				<MenuItem value={0} primaryText="All Sprints" />
				{this.renderSprintList()}
			</SelectField>
			</div>
			<div className="uk-width-1-2" style={{textAlign: 'right'}}>
			<RaisedButton style={{verticalAlign: 'middle'}} icon={<PrintIcon />} onClick={() => {
				let printHTML = document.querySelector('#printArea').innerHTML;
				window.frames["print_frame"].document.body.innerHTML=printHTML;
				window.frames["print_frame"].window.focus();
				window.frames["print_frame"].window.print();
			}} primary={true} className="uk-margin-small-top" />
			</div>
			</div>
			
			<br />
			<hr style={{clear: "both"}}/>
						
			<div id="printArea" className="uk-grid uk-margin-small-left">
			<div style={{paddingLeft: 0}} className="uk-width-1-1">
				<Line data={this.getChartData()} sprints={this.props.AllSprints}/>
			</div>
			<div className="uk-width-1-1">
				<h4>Tasks</h4>
				{this.renderTable()}
				<hr />
				
			</div>
			<div className="uk-width-1-1 uk-margin-small-top">
				<h4>Incomplete Tasks</h4>
				{this.renderIncompleteTasksTable()}
				
			</div>
			</div>
			
	    	<iframe name="print_frame" width="0" height="0" frameBorder="0" src="about:blank"></iframe>

			</div>

			
		);
	}
}

function mapStateToProps(state){
	return {AllIncompleteTasks: state.AllIncompleteTasks, AllSprints: state.AllSprints, Project: state.Project};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getAllIncompleteTasks, getProject: getProject, navigateProject: navigateProject, getAllSprints: getAllSprints}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectReports);