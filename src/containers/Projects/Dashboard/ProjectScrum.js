import React, {Component} from 'react';
import Dragula from 'react-dragula';
import {Card, CardHeader} from 'material-ui/Card';
import DocumentIcon from 'material-ui/svg-icons/file/attachment';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import AlarmIcon from 'material-ui/svg-icons/action/alarm';
import getActiveSprint from '../../../actions/ActiveSprint/getActiveSprint';
import getProjectPeople from '../../../actions/Employees/getProjectPeople';
import getEmployeeImage from '../../../actions/Employees/getEmployeeImage';
import completeSprint from '../../../actions/ActiveSprint/completeSprint';
import addLogEntry from '../../../actions/Logs/addLogEntry';
import moveTask from '../../../actions/ActiveSprint/moveTask';
import {connect} from 'react-redux';
import navigateProject from '../../../actions/Routing/navigateProject';
import Paper from 'material-ui/Paper';
import {bindActionCreators} from 'redux';
import TaskIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import BugIcon from 'material-ui/svg-icons/action/bug-report';
import HighPriorityIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import LowPriorityIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import MediumPriorityIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import StoryIcon from 'material-ui/svg-icons/action/receipt';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TaskTimelog from './TaskTimelog';
import lodash from 'lodash';
import 'dragula/dist/dragula.min.css';
import moment from 'moment';
import Avatar from 'material-ui/Avatar';
import {readDurationString, readDateTime} from '../../../helpers/date';
import {Tooltip} from 'react-lightweight-tooltip';
import getTaskStartDate from '../../../actions/ActiveSprint/getTaskStartDate';
import PauseIcon from 'material-ui/svg-icons/av/pause-circle-outline';
import PlayIcon from 'material-ui/svg-icons/av/play-circle-outline';
import automaticDurationStart from '../../../actions/ActiveSprint/automaticDurationStart';
import automaticDurationEnd from '../../../actions/ActiveSprint/automaticDurationEnd';
import addTaskTimelog from '../../../actions/ActiveSprint/addTaskTimelog';
import getTaskTimelog from '../../../actions/ActiveSprint/getTaskTimelog';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import TaskInfoDialog from './TaskInfoDialog';

let dropStyle = {paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, borderColor: "#E0E0E0", borderStyle: "dashed"};
let noSpaceAround = {paddingRight: 0, paddingLeft: 0, marginLeft: 0, marginRight: 0};
let userChanged = false;
let prevUser = {};
let updates = 0;

class Tasks extends Component{
	constructor(props){
		super(props);
		this.components = [];	
		this.addComponent = this.addComponent.bind(this);
		this.readTasks = this.readTasks.bind(this);
		this.dragulaDecorator = this.dragulaDecorator.bind(this);
		this.openTaskTimelog = this.openTaskTimelog.bind(this);
		this.isUsersTask = this.isUsersTask.bind(this);
		this.closeTaskTimelog = this.closeTaskTimelog.bind(this);
		this.completeSprint = this.completeSprint.bind(this);
		this.closeCompleteSprintPrompt = this.closeCompleteSprintPrompt.bind(this);
		this.moveTask = this.moveTask.bind(this);
		this.state = {TaskInfoDialogOpen: false, taskInfoDialogPath: '', TaskTimelogOpen: false, task: {}, taskPath: "", completeSprintPromptOpen: false}
	}
	addComponent(component){
		this.components.push(component);
	}
	isUsersTask(el, source){
		let user = lodash.find(this.props.ProjectPeople, {key: this.props.LoggedInUser.key});
		// if(user.role == 'owner')
		// 	return false;

		let column = this.props.ActiveSprint[source.id];
		for(let i=0; i<column.length; i++){
			let task =column[i];
			if(task.key == el.id && task.owner.key == this.props.LoggedInUser.key){
				return true;
			}
		}
		return false;
	}
	dragulaDecorator(components){
		let thismoveTask = this.moveTask;
		if(components){
			let dragula = Dragula(components, {moves: this.isUsersTask , copy: true, revertOnSpill: true});
			dragula.on('drop', (el, target, source, sibling) => {
				thismoveTask(source.id, target.id, el.id);
			});
			
		}
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
	openTaskTimelog(taskPath, task){
		let newState = this.state;
		newState.task = task;
		newState.taskPath = taskPath;
		newState.TaskTimelogOpen = true;
		this.setState(newState);
	}
	closeTaskTimelog(taskPath, task){
		let newState = this.state;
		newState.TaskTimelogOpen = false;
		this.setState(newState);
	}
	componentDidMount(){
		this.props.navigateProject(7)
		this.dragulaDecorator(this.components);
		if(this.props.LoggedInUser.key){
			// console.log(this.props.LoggedInUser);
			this.props.getActiveSprint(this.props.params.id, this.props.LoggedInUser, this.canViewAll(), this.props.getTaskStartDate);
		}
		this.props.getProjectPeople(this.props.params.id, (employees) => {
			employees.forEach((person) => {
				this.props.getEmployeeImage(person.key);
			})
		});
	}
	componentDidUpdate(){
		// console.log(++updates)
		if(this.props.LoggedInUser.key && userChanged){
			// console.log(this.props.LoggedInUser);
			userChanged = false;
			this.props.getActiveSprint(this.props.params.id, this.props.LoggedInUser, this.canViewAll(),  this.props.getTaskStartDate);
			// this.props.ProjectPeople.forEach((person) => {
			// 	this.props.getEmployeeImage(person.key);
			// })
		}
	}
	renderBoldSpan(text){
		return <span style={{fontWeight: 'bold'}}>{text}</span>
	}
	readTasks(column){
		try{
			return this.props.ActiveSprint[column].map((task) => {
				return (<div style={{cursor: "move", paddingLeft: 5, paddingRight: 3, margin: 3}}
						className="uk-grid uk-panel uk-panel-box uk-panel-box-primary uk-border-rounded"
						id={task.key}
						key={task.key}>
						
							<div style={noSpaceAround} className="uk-width-1-1 uk-grid">
							{/*<span style={{color: "#006064"}}><Tooltip styles={{wrapper: {cursor: 'auto'}}} content={task.owner.name}><Avatar src={this.props.EmployeesImages[task.owner.key]} /></Tooltip>&nbsp;</span>*/}
							<div style={{padding: 0}} className="uk-width-1-2">
								<Tooltip styles={{wrapper: {cursor: 'auto'}}} content={this.props.TaskDates.hasOwnProperty(task.key)?`${readDateTime(new Date(this.props.TaskDates[task.key]))}`:null}>{this.readTaskIcon(task.type)}</Tooltip>&nbsp;
								{this.renderBoldSpan(task.name)}
							</div>
							<div style={{paddingRight: 12, textAlign: 'right'}} className="uk-width-1-2">
								<span style={{color: '#006064', marginRight: 24}}>{this.renderBoldSpan(`${task.time}h`)}</span>
								<span style={{marign: 0, padding: 0}} onClick={() => {this.setState({TaskInfoDialogOpen: true,taskInfoDialogPath: task.original})}} ><Tooltip styles={{wrapper: {cursor: 'pointer', padding: 0}}} content="Info"><InfoIcon color="#40C4FF" style={{cursor: 'pointer'}} /></Tooltip></span>
							</div>
							{/*&nbsp;|&nbsp;
							<span style={{color: "#006064"}}>{task.time}h&nbsp;</span>
							*/}
							</div>
							
							<div style={{textAlign: "left", ...noSpaceAround}} className="uk-width-2-3 uk-margin-top uk-clearfix">
							<span style={{color: "#006064"}}><Tooltip styles={{wrapper: {cursor: 'auto'}}} content={task.owner.name}><Avatar src={this.props.EmployeesImages[task.owner.key]} /></Tooltip>&nbsp;</span>
							{this.readTaskPriority(task.priority)}
							{/*
							<Tooltip styles={{wrapper: {cursor: 'auto'}}} content={`Actual duration : ${readDurationString(moment.duration(task.duration))}`}>
							<span style={{color: "#006064"}}>{task.time} Hours&nbsp;</span>
							</Tooltip>
							*/}
							{column !=='todo' && task.hasOwnProperty('duration') && parseInt(task.duration) > 0 ? <span >Actual Duration: {this.renderBoldSpan(readDurationString(moment.duration(task.duration)))} </span> : null}
							</div>

							<div style={{...noSpaceAround, textAlign: "right"}} className="uk-width-1-3">
							{
								column=='todo' || this.props.viewMode ? null : (<IconButton style={{padding: 0, margin: 0}} onTouchTap={(event) => {this.openTaskTimelog({column: column, key: task.key}, task)}} tooltip="Task TimeLog">
									<AlarmIcon color={"#40C4FF"} />
								</IconButton>)
							}
							{
								column !== 'inprogress' || this.props.viewMode || this.props.LoggedInUser.key !== task.owner.key ? null : (<IconButton style={{padding: 0, margin: 0}}
									onClick={(event) => {
										if(!task.hasOwnProperty('paused') || task.paused){
											this.props.automaticDurationStart(this.props.params.id, task.key);
										}else{
											let data = {
												description: 'Automatic Period',
												startDate: task.lastAutomaticTime,
												endDate: new Date().getTime(),
												duration: new Date().getTime()-parseInt(task.lastAutomaticTime)
											};
											let taskPath = `${this.props.params.id}/${task.original}`;
											let clickedTaskPath = `activeSprint/${this.props.params.id}/inprogress/${task.key}`;

											this.props.automaticDurationEnd(this.props.params.id, task.key);
											this.props.addTaskTimelog(taskPath, data, () => {
												this.props.getTaskTimelog(taskPath, clickedTaskPath);
											});
										}
									}}
									tooltip={task.paused?"Start":"Hold"}>
									{!task.hasOwnProperty('paused') || task.paused ? <PlayIcon color={"#03A9F4"} />:<PauseIcon color={"#03A9F4"} />}
								</IconButton>)
							}
							</div>
						</div>
						);
			})
		}catch(e){return null}
	}
	moveTask(source, target, id){
		let column = this.props.ActiveSprint[source];
		let task = lodash.find(column, {key: id});

		this.props.moveTask(source, target, id, this.props.params.id, false, (task) => {
			if(target === 'done' && task.paused === false){
				let data = {
					description: 'Automatic Period',
					startDate: task.lastAutomaticTime,
					endDate: new Date().getTime(),
					duration: new Date().getTime()-parseInt(task.lastAutomaticTime)
				};
				let taskPath = `${this.props.params.id}/${task.original}`;
				let clickedTaskPath = `activeSprint/${this.props.params.id}/done/${task.key}`;

				this.props.automaticDurationEnd(this.props.params.id, task.key);
				this.props.addTaskTimelog(taskPath, data, () => {
					this.props.getTaskTimelog(taskPath, clickedTaskPath);
				});
			}
		});
		this.props.addLogEntry(this.props.LoggedInUser.key, `moved "${task.name}" to ${target}`, this.props.params.id, task);
		//cleanup
		try{
			document.querySelector(`#${id}`).remove();
		}catch(e){}
	}
	isNotSprintOwner(){
		if(this.props.ActiveSprint.startedBy && this.props.LoggedInUser.key){
			if(this.props.LoggedInUser.key == this.props.ActiveSprint.startedBy)
				return false;
		}
		return true;
	}
	canViewAll(){
		let user = lodash.find(this.props.ProjectPeople, {key: this.props.LoggedInUser.key});
		let userRole = false;
		if(user)
			userRole = user.role;

		if(userRole == 'leader' || userRole == 'owner' || userRole == 'viewer')
			return true;

		return false;
	}
	isEmptySprint(){
		if(this.props.ActiveSprint && Object.keys(this.props.ActiveSprint).length > 0){
			if((this.props.ActiveSprint.todo.length + this.props.ActiveSprint.inprogress.length + this.props.ActiveSprint.done.length) > 0)
				return false;
		}
		return true;
	}
	completeSprint(action=false){
		if(action){
			let incompleteTasks = this.props.ActiveSprint.todo.concat(this.props.ActiveSprint.inprogress);
			this.props.completeSprint(this.props.params.id, this.props.ActiveSprint, incompleteTasks, action);
			this.closeCompleteSprintPrompt();
			return ;
		}else if(this.props.ActiveSprint.todo.length > 0 || this.props.ActiveSprint.inprogress.length > 0){
			this.openCompleteSprintPrompt();
			return ;
		}else{
			this.props.completeSprint(this.props.params.id, this.props.ActiveSprint);
		}
	}
	openCompleteSprintPrompt(){
		this.setState({completeSprintPromptOpen: true});
	}
	closeCompleteSprintPrompt(){
		this.setState({completeSprintPromptOpen: false});
	}
	generatePath(task){
		try{
			let status = task.status.toLowerCase();
			switch(status){
				case "to do":
					status = "todo";
					break;
				case "in progress":
					status = "inprogress";
					break;
				case "done":
					status = "done";
					break ;
			}
			return `activeSprint/${this.props.params.id}/${status}/${task.key}`;
		}catch(e){
			return '';
		}
	}
	render(){
		let endDate = new Date(this.props.ActiveSprint.endDate);
		endDate.setHours(0,0,0,0);
		
		let today = new Date();
		today.setHours(0,0,0,0);
		
		let duration = moment.duration(endDate.getTime() - today.getTime());
		let remainingDays = Math.round(duration.asDays());
		
		let color="black";
		if(!isNaN(remainingDays) && remainingDays <=5)
			color="red";
		return(
			<div style={{paddingTop: 5}} className="uk-margin-small-top uk-margin-small-left uk-margin-small-right">
			<div className="uk-grid">
				<div className="uk-width-1-2">
				<h4>{this.props.ActiveSprint.name}</h4>
				<h4 style={{fontWeight: 'bold', color}}>{isNaN(remainingDays)?null:remainingDays>=0?`${remainingDays} Days Remaining`:`${Math.abs(remainingDays)} Day(s) Ago`}</h4>
				</div>

				<div style={{textAlign: "right"}} className="uk-width-1-2">
				<RaisedButton primary={true} onTouchTap={() => {this.completeSprint();}} label="Complete Sprint" disabled={this.isNotSprintOwner() || this.isEmptySprint()} />
				</div>				
			</div>
			<hr />
			<div className="uk-grid">

				<div className="uk-width-1-3">
				<h5>To Do</h5>

				<div className="uk-height-1-1" style={dropStyle} id="todo" ref={this.addComponent}>
					{this.readTasks('todo')}
				</div>
				</div>

				<div className="uk-width-1-3">
				<h5>In Progress</h5>

				<div className="uk-height-1-1" style={dropStyle} id="inprogress" ref={this.addComponent}>
					{this.readTasks('inprogress')}
				</div>
				</div>

				<div className="uk-width-1-3">
				<h5>Done</h5>

				<div className="uk-height-1-1" style={dropStyle} id="done" ref={this.addComponent}>
					{this.readTasks('done')}
				</div>
				</div>
			</div>
			{/*<FlatButton label="Mark as done" primary={true} keyboardFocused={true} onTouchTap={() => {this.completeSprint(1); }} />*/}
			<TaskTimelog clickedTaskPath={this.generatePath(this.state.task)} moveTask={this.props.moveTask} projectID={this.props.params.id} task={this.state.task} taskPath={this.state.taskPath} open={this.state.TaskTimelogOpen} onRequestClose={this.closeTaskTimelog} />
			<TaskInfoDialog
				open={this.state.TaskInfoDialogOpen}
				modal={true}
				taskPath={this.state.taskInfoDialogPath}
				projectID={this.props.params.id}
				onRequestClose={() => {this.setState({TaskInfoDialogOpen: false})}}
				/>
			<Dialog
				title={`This sprint "${this.props.ActiveSprint.name}" has incomplete tasks`}
				actions={[<FlatButton primary={true} keyboardFocused={true} onTouchTap={() => {this.completeSprint(2); }} label="Move to backlog" />,
					<FlatButton onTouchTap={() => {this.completeSprint(1); }} label="Move to a new sprint" />]}

				modal={false}
				open={this.state.completeSprintPromptOpen}
				onRequestClose={this.closeCompleteSprintPrompt}>
			
			What do you want to do with them ?
			</Dialog>
			</div>
		);
	}
}

function mapStateToProps(state){
	if(JSON.stringify(prevUser) != JSON.stringify(state.LoggedInUser)){
		prevUser = state.LoggedInUser;
		userChanged = true;
	}
	return {TaskDates: state.TaskDates, EmployeesImages: state.EmployeesImages, ProjectPeople: state.ProjectPeople, ActiveSprint: state.ActiveSprint, LoggedInUser: state.LoggedInUser};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getTaskTimelog, addTaskTimelog, automaticDurationEnd, automaticDurationStart, getTaskStartDate, getEmployeeImage, completeSprint: completeSprint, getProjectPeople: getProjectPeople, addLogEntry: addLogEntry, navigateProject: navigateProject, getActiveSprint: getActiveSprint, moveTask: moveTask}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);