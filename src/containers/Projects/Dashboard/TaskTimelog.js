import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import addTaskTimelog from '../../../actions/ActiveSprint/addTaskTimelog';
import {readDate, readDateObject, readDateTime, readDurationString} from '../../../helpers/date';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Checkbox from 'material-ui/Checkbox';
import getTaskTimelog from '../../../actions/ActiveSprint/getTaskTimelog';
import removeTaskTimelog from '../../../actions/ActiveSprint/removeTaskTimelog';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import lodash from 'lodash';
import moment from 'moment';


let prevTask = {};
let today = new Date();

const validate = (formProps) => {
	let errors = {};

	if(!formProps.description)
		errors['taskName'] = 'Field is empty';

	if(formProps.duration<=0){
		errors['startDate'] = 'task ends ahead if its start';
		errors['startTime'] = 'task ends ahead if its start';
		errors['endDate'] = 'task ends ahead if its start';
		errors['endTime'] = 'task ends ahead if its start';
	}

	return errors;
	
}

class TaskTimelog extends Component{
	constructor(props){
		super(props);
		let today = new Date();
		this.state = {taskName: "", startDate: today, endDate: today, startTime: today, endTime: today, errors: {}, TaskFinishChecked: false};
		this.setTaskName = this.setTaskName.bind(this);
		this.readLogTable = this.readLogTable.bind(this);
		this.setTaskFinishChecked = this.setTaskFinishChecked.bind(this);
		this.setStartTime = this.setStartTime.bind(this);
		this.setStartDate = this.setStartDate.bind(this);
		this.setEndTime = this.setEndTime.bind(this);
		this.setEndDate = this.setEndDate.bind(this);
		this.addLogEntry = this.addLogEntry.bind(this);
	}
	componentDidUpdate(){
		if(JSON.stringify(prevTask) != JSON.stringify(this.props.task)){
			prevTask = this.props.task;
			let taskPath = `${this.props.projectID}/${this.props.task.original}`;
			this.props.getTaskTimelog(taskPath, this.props.clickedTaskPath);
		}
	}
	setTaskName(event){
		let newState = this.state;
		newState.taskName = event.target.value;
		this.setState(newState);
	}
	setTaskFinishChecked(event, checked){
		let newState = this.state;
		newState.TaskFinishChecked = checked;
		this.setState(newState);
	}
	setStartDate(event, date){
		this.setState({startDate: date});
	}
	setEndDate(event, date){
		this.setState({endDate: date});
	}
	setStartTime(event, date){
		this.setState({startTime: date});
	}
	setEndTime(event, date){
		this.setState({endTime: date});
	}
	readLogTable(){
			return lodash.sortBy(this.props.TaskTimelog, 'startDate').map((logEntry) => {
				return (
					<TableRow key={logEntry.key}>
					<TableRowColumn>{logEntry.description}</TableRowColumn>
					<TableRowColumn>{readDateTime(new Date(logEntry.startDate))}</TableRowColumn>
					<TableRowColumn>{readDateTime(new Date(logEntry.endDate))}</TableRowColumn>
					<TableRowColumn>{readDurationString(moment.duration(logEntry.duration))}</TableRowColumn>
					<TableRowColumn>{logEntry.user}</TableRowColumn>
					<TableRowColumn>
						{
							(this.props.LoggedInUser && this.props.LoggedInUser.email === logEntry.user)?(
								<IconButton onClick={
										() => {
												let taskPath = `${this.props.projectID}/${this.props.task.original}`;
												this.props.removeTaskTimelog(taskPath, logEntry.key);
										}
								}><DeleteIcon /></IconButton>
								):null
						}
					</TableRowColumn>
					</TableRow>
				);
			});
	}
	addLogEntry(event){
		event.preventDefault();

		let startDate = this.state.startDate;
		let startTime = this.state.startTime;
		let endDate = this.state.endDate;
		let endTime = this.state.endTime;

		let entryStart = new Date();
		
		entryStart.setFullYear(startDate.getFullYear());
		entryStart.setMonth(startDate.getMonth());
		entryStart.setDate(startDate.getDate());

		entryStart.setHours(startTime.getHours());
		entryStart.setMinutes(startTime.getMinutes());
		entryStart.setSeconds(startTime.getSeconds());
		
		let entryEnd = new Date();
		
		entryEnd.setFullYear(endDate.getFullYear());
		entryEnd.setMonth(endDate.getMonth());
		entryEnd.setDate(endDate.getDate());

		entryEnd.setHours(endTime.getHours());
		entryEnd.setMinutes(endTime.getMinutes());
		entryEnd.setSeconds(endTime.getSeconds());

		let data = {description: this.state.taskName, startDate: entryStart.getTime(), endDate: entryEnd.getTime()};
		let taskPath = `${this.props.projectID}/${this.props.task.original}`;
		
		let duration = entryEnd.getTime() - entryStart.getTime();

		data.duration = duration;
		let errors = validate(data);
		this.setState({errors: errors});
		if(Object.keys(errors) == 0){
			this.setState({taskName: ""});
			this.props.addTaskTimelog(taskPath, data);
			if(this.state.TaskFinishChecked){
				this.props.moveTask(this.props.taskPath.column, 'done', this.props.taskPath.key, this.props.projectID, entryEnd);
				this.props.onRequestClose();
			}
		}
		
	}
	componentWillReceiveProps(nextProps){
		if(this.props.open === false && nextProps.open === true){
			this.setState({errors: {}});
		}
	}
	renderLog(){
		return(
			<div className="uk-grid uk-margin-small-top">
			
			<div className="uk-width-1-1">
				<form onSubmit={this.addLogEntry}>
				<div className="uk-grid">
				<div className="uk-width-1-1"><TextField errorText={this.state.errors.taskName} value={this.state.taskName} onChange={this.setTaskName} onBlur={this.setTaskName} floatingLabelText="Description" fullWidth={true} /></div>
				<div className="uk-width-1-1 uk-grid uk-margin-bottom">
					
					<div className="uk-width-1-2">
					<DatePicker errorText={this.state.errors.startDate} value={this.state.startDate} onChange={this.setStartDate} fullWidth={true} floatingLabelText="Start Date" />
					<DatePicker errorText={this.state.errors.endDate} value={this.state.endDate} onChange={this.setEndDate} fullWidth={true} floatingLabelText="End Date" />
					</div>

					<div className="uk-width-1-2">
					<TimePicker errorText={this.state.errors.startTime} value={this.state.startTime} onChange={this.setStartTime} fullWidth={true} floatingLabelText="Start Time" />
					<TimePicker errorText={this.state.errors.endTime} value={this.state.endTime} onChange={this.setEndTime} fullWidth={true} floatingLabelText="End Time" />
					</div>

				</div>
				<div style={{textAlign: "left"}} className="uk-width-1-2"><Checkbox checked={this.state.TaskFinishChecked} onCheck={this.setTaskFinishChecked} label="Task Finished" /></div>
				<div style={{textAlign: "right"}} className="uk-width-1-2"><RaisedButton primary={true} type="submit" label="Add" /></div>
				</div>
				</form>
			</div>
			<div className="uk-width-1-1 uk-margin-small-top">
			<hr />
			<Table>
			  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
				  <TableHeaderColumn>Description</TableHeaderColumn>
				  <TableHeaderColumn>Start</TableHeaderColumn>
				  <TableHeaderColumn>End</TableHeaderColumn>
				  <TableHeaderColumn>Duration</TableHeaderColumn>
				  <TableHeaderColumn>User</TableHeaderColumn>
				  <TableHeaderColumn>Action</TableHeaderColumn>
				</TableRow>
			  </TableHeader>
			  <TableBody displayRowCheckbox={false}>
				{
					this.readLogTable()
				}	  
			  
			  </TableBody>
			</Table>
			</div>
			</div>
		);
	}
	render(){
		return (
			<Dialog
				contentStyle={{width: "95%", maxWidth: "none"}}
				title={`Timelog - ${this.props.task.name}`}
				actions={<FlatButton onClick={this.props.onRequestClose} onTouchTap={this.props.onRequestClose} primary={true} label="Exit" />}
				modal={false}
				open={this.props.open}
				autoScrollBodyContent={true}
				onRequestClose={this.props.onRequestClose}>
			<div>
				{this.renderLog()}
			</div>
			</Dialog>

		);
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({removeTaskTimelog: removeTaskTimelog, addTaskTimelog: addTaskTimelog, getTaskTimelog: getTaskTimelog}, dispatch);
}

function mapStateToProps(state){
	return {TaskTimelog: state.TaskTimelog, LoggedInUser: state.LoggedInUser};
}

TaskTimelog = connect(mapStateToProps, mapDispatchToProps)(TaskTimelog);

export default TaskTimelog;