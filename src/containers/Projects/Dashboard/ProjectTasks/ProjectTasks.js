import React, {Component} from 'react';
import Dragula from 'react-dragula';
import {Card, CardHeader} from 'material-ui/Card';
import AddButton from '../../../../components/AddButton';
import DocumentIcon from 'material-ui/svg-icons/file/attachment';
import RaisedButton from 'material-ui/RaisedButton';
import getFreeTasks from '../../../../actions/Tasks/getFreeTasks';
import moveTask from '../../../../actions/Tasks/moveTask';
import createTask from '../../../../actions/Tasks/createTask';
import editTask from '../../../../actions/Tasks/editTask';
import getProjectPeople from '../../../../actions/Employees/getProjectPeople';
import startSprint from '../../../../actions/Tasks/startSprint';
import createSprint from '../../../../actions/Tasks/createSprint';
import completeSprint from '../../../../actions/Tasks/completeSprint';
import getEmployeeImage from '../../../../actions/Employees/getEmployeeImage';
import TaskIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import BugIcon from 'material-ui/svg-icons/action/bug-report';
import HighPriorityIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import LowPriorityIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import MediumPriorityIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import SprintIcon from 'material-ui/svg-icons/editor/format-list-bulleted';
import Dialog from 'material-ui/Dialog';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import StoryIcon from 'material-ui/svg-icons/action/receipt';
import getIncompleteSprints from '../../../../actions/Tasks/getIncompleteSprints';
import getCompleteSprints from '../../../../actions/Tasks/getCompleteSprints';
import {connect} from 'react-redux';
import navigateProject from '../../../../actions/Routing/navigateProject';
import deleteSprint from '../../../../actions/Sprints/deleteSprint';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import editSprint from '../../../../actions/Sprints/editSprint';
import addLogEntry from '../../../../actions/Logs/addLogEntry';
import {bindActionCreators} from 'redux';
import uuid from 'uuid/v4';
import FlatButton from 'material-ui/FlatButton';
import 'dragula/dist/dragula.min.css';
import {reset, submit} from 'redux-form';
import NewTaskDialog from './NewTaskDialog';
import EditTaskDialog from './EditTaskDialog';
import NewSprintDialog from './NewSprintDialog';
import EditSprintModal from '../ProjectSprints/EditSprintModal';
import StartSprintModal from '../ProjectSprints/StartSprintModal';
import ActiveSprintIcon from 'material-ui/svg-icons/action/check-circle';
import {readDate} from '../../../../helpers/date';
import Collapsible from 'react-collapsible';
import IconButton from 'material-ui/IconButton';
import CollapseIcon from 'material-ui/svg-icons/navigation/arrow-drop-down-circle'
import lodash from 'lodash';
import Avatar from 'material-ui/Avatar';
import {Tooltip} from 'react-lightweight-tooltip';

let Dayms = 86400000;
let dropStyle = {paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, borderColor: "#E0E0E0", borderStyle: "dashed"};
let taskClass = "uk-panel uk-panel-box uk-panel-box-primary uk-border-rounded uk-grid";
let taskStyle = {cursor: "move", margin: 3};

let bottomLeft = {position: 'fixed', right: 20, bottom: 20, zIndex: 1000}

class Tasks extends Component{
	constructor(props){
		super(props);
		this.state = {sprintCollapse: {}, sprintAboutToStart: {}, startSprintModalOpen: false, sprintCompleteSprint: {}, sprintCompleteIncompleteTasks: [], sprintCompletePromptOpen: false, editedTaskPath: "", editedTask: {name: "essam", type:"", owner: "", time: "", priority: ""}, snackbarOpen: false, anchorEl: null, ActionsMenuOpen: false, deletePromptOpen: false, newTaskDialogOpen: false, newSprintDialogOpen: false, EditSprintDialogOpen: false, editTaskDialogOpen: false, sprintID: false, ActionsMenuSprint: {}};
		this.components = [];	
		this.addComponent = this.addComponent.bind(this);
		this.props.getFreeTasks(this.props.params.id);
		this.dragulaDecorator = this.dragulaDecorator.bind(this);
		this.readTasks = this.readTasks.bind(this);
		this.moveTask = this.moveTask.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.openNewTaskDialog = this.openNewTaskDialog.bind(this);
		this.closeNewTaskDialog = this.closeNewTaskDialog.bind(this);
		this.submitNewTaskDialog = this.submitNewTaskDialog.bind(this);
		this.onSprintSubmit = this.onSprintSubmit.bind(this);
		this.openNewSprintDialog = this.openNewSprintDialog.bind(this);
		this.closeNewSprintDialog = this.closeNewSprintDialog.bind(this);
		this.openActionsMenu = this.openActionsMenu.bind(this);
		this.closeActionsMenu = this.closeActionsMenu.bind(this);
		this.submitNewSprintDialog = this.submitNewSprintDialog.bind(this);
		this.formRef = this.formRef.bind(this);
		this.SprintFormRef = this.SprintFormRef.bind(this);
		this.EditSprintFormRef = this.EditSprintFormRef.bind(this);
		this.openEditSprintDialog = this.openEditSprintDialog.bind(this);
		this.closeEditSprintDialog = this.closeEditSprintDialog.bind(this);
		this.openSnackbar = this.openSnackbar.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
		this.submitEditSprintDialog = this.submitEditSprintDialog.bind(this);
		this.onEditSprintSubmit = this.onEditSprintSubmit.bind(this);
		this.closeDeletePrompt = this.closeDeletePrompt.bind(this);
		this.openDeletePrompt = this.openDeletePrompt.bind(this);
		this.deleteSprint = this.deleteSprint.bind(this);
		this.openEditTaskDialog = this.openEditTaskDialog.bind(this);
		this.closeEditTaskDialog = this.closeEditTaskDialog.bind(this);
		this.submitEditTaskDialog = this.submitEditTaskDialog.bind(this);
		this.submitStartSprintDialog = this.submitStartSprintDialog.bind(this);
		this.onStartSprintSubmit = this.onStartSprintSubmit.bind(this);
		this.closeStartSprintDialog = this.closeStartSprintDialog.bind(this);
		this.onEditTaskSubmit = this.onEditTaskSubmit.bind(this);
		this.activeSprintKey = false;
		this.ActiveSprint = {startDate: new Date(), endDate: new Date()};
		this.sprintToBeDeleted = {};
		this.closeSprintCompletePrompt = this.closeSprintCompletePrompt.bind(this);
	}
	formRef(form){
		this.form = form;
	}
	openDeletePrompt(sprint){
		// console.log(sprint);
		let newState = this.state;
		newState.deletePromptOpen = true;
		this.sprintToBeDeleted = sprint;
		this.setState(newState);
	}
	closeDeletePrompt(){
		let newState = this.state;
		newState.deletePromptOpen = false;
		this.setState(newState);
	}
	SprintFormRef(form){
		this.sprintForm = form;
	}
	EditSprintFormRef(form){
		this.EditSprintForm = form;
	}
	openNewTaskDialog(){
		let newstate = this.state;
		newstate.newTaskDialogOpen = true;
		this.setState(newstate);
	}
	closeNewTaskDialog(){
		let newstate = this.state;
		newstate.newTaskDialogOpen = false;
		this.setState(newstate);
	}
	openEditTaskDialog(task, taskPath){
		this.props.reset('EditTaskForm');
		let newstate = this.state;
		newstate.editTaskDialogOpen = true;
		newstate.editedTaskPath = `${taskPath}/${task.key}`;
		newstate.editedTask = {
			name: task.name,
			type: task.type,
			owner: JSON.stringify(task.owner),
			time: task.time,
			priority: task.priority,
			description: task.description,
		};
		this.setState(newstate);
	}
	closeEditTaskDialog(){
		let newstate = this.state;
		newstate.editTaskDialogOpen = false;
		this.setState(newstate);
	}

	submitEditTaskDialog(){
		this.props.submit('EditTaskForm');
	}
	onEditTaskSubmit(submit){
		this.props.reset('EditTaskForm');
		this.closeEditTaskDialog();
		submit.owner = JSON.parse(submit.owner);
		// this.props.addLogEntry(this.props.LoggedInUser.key, `edited "${submit.name}"`, this.props.params.id, submit);
		let sprintKey = this.state.editedTaskPath.split('/')[0];
		let sprintActive = false;
		if(sprintKey.trim() !== 'freeTasks')
			sprintActive = lodash.find(this.props.AllSprints, {key: sprintKey}).active;

		let task = this.state.editedTask;
		this.props.editTask(submit, this.props.params.id, this.state.editedTaskPath, task, sprintActive);
	}

	openEditSprintDialog(sprint){
		sprint = Object.assign({}, sprint);
		let newstate = this.state;
		newstate.EditSprintDialogOpen = true;

		if(sprint.startDate)
			sprint.startDate = new Date(sprint.startDate);
		else
			sprint.startDate = new Date();

		if(sprint.endDate)
			sprint.endDate = new Date(sprint.endDate);
		else
			sprint.endDate = new Date(sprint.startDate.getTime() + Dayms*7);

		this.ActiveSprint = sprint;
		// console.log(sprint);
		this.setState(newstate);
	}
	closeEditSprintDialog(){
		this.props.reset('EditSprintForm');
		let newstate = this.state;
		newstate.EditSprintDialogOpen = false;
		this.setState(newstate);
	}
	submitNewTaskDialog(){
		this.form.submit();
	}
	onSubmit(submit){
		this.props.reset('NewTaskForm');
		this.closeNewTaskDialog();
		submit.owner = JSON.parse(submit.owner);
		this.props.addLogEntry(this.props.LoggedInUser.key, `created "${submit.name}"`, this.props.params.id, submit);
		// console.log(submit);
		this.props.createTask(submit, this.props.params.id);
	}
	submitEditSprintDialog(){
		this.EditSprintForm.submit();
	}
	openNewSprintDialog(){
		let newstate = this.state;
		newstate.newSprintDialogOpen = true;
		this.setState(newstate);
	}
	closeNewSprintDialog(){
		let newstate = this.state;
		newstate.newSprintDialogOpen = false;
		this.setState(newstate);
	}
	submitNewSprintDialog(){
		this.sprintForm.submit();
	}
	onSprintSubmit(submit){
		this.props.reset('NewSprintDialog');
		this.closeNewSprintDialog();
		// submit.endDate = submit.endDate.getTime();
		// submit.startDate = submit.startDate.getTime();
		submit.active = false;
		submit.complete = false;
		// this.props.addLogEntry(this.props.LoggedInUser.key, `created sprint "${submit.name}"`, this.props.params.id);
		this.props.createSprint(submit, this.props.params.id);
	}
	onEditSprintSubmit(submit){
		// console.log(submit);
		this.closeEditSprintDialog();
		// submit.endDate = submit.endDate.getTime();
		// submit.startDate = submit.startDate.getTime();
		// console.log(submit);
		this.props.editSprint(this.props.params.id, this.ActiveSprint.key, submit, this.ActiveSprint.active);
	}
	addComponent(newComponent){
		// if(sprint && sprint.active){
		// 	let newComponents = [];
			
		// 	this.components.map((component) => {
		// 		if(newComponent != component)
		// 			newComponents.push(component);
		// 	});

		// 	this.components=newComponents;

		// 	if(this.dragula){
		// 		this.dragula.destroy();
		// 		this.dragulaDecorator(this.components);
		// 	}
		// }else
		if(this.components.indexOf(newComponent) == -1)
				this.components.push(newComponent);
	}
	dragulaDecorator(components){
		let thismoveTask = this.moveTask;
		if(components){
			this.dragula = Dragula(components, {copy: true, revertOnSpill: true});
			this.dragula.on('drop', (el, target, source, sibling) => {
				thismoveTask(source.id, target.id, el.id);
			});
		}
	}
	openActionsMenu(event, sprint){
		event.preventDefault();
		let newState = this.state;
		newState.ActionsMenuOpen = true;
		newState.ActionsMenuSprint = sprint;
		newState.anchorEl = event.currentTarget;
		this.setState(newState);
	}
	closeActionsMenu(){
		let newState = this.state;
		newState.ActionsMenuOpen = false;
		this.setState(newState);
	}
	openSnackbar(){
		let newState = this.state;
		newState.snackbarOpen = true;
		this.setState(newState);
	}
	closeSnackbar(){
		let newState = this.state;
		newState.snackbarOpen = false;
		this.setState(newState);
	}
	openSprintCompletePrompt(sprint, incompleteTasks){
		this.setState({sprintCompletePromptOpen: true, sprintCompleteSprint: sprint, sprintCompleteIncompleteTasks: incompleteTasks });
	}
	closeSprintCompletePrompt(){
		this.setState({sprintCompletePromptOpen: false});
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

	deleteSprint(){
		this.closeDeletePrompt();
		this.props.deleteSprint(this.props.params.id, this.sprintToBeDeleted.key, this.sprintToBeDeleted.active, this.sprintToBeDeleted.tasks.length);
	}
	getPersonName(key){
		let name=null;
		this.props.ProjectPeople.map((person) => {
			if(person.key == key){
				name=person.name
			}
		});
		return name;
	}
	readTasks(){
		if(this.props.FreeTasks.length > 0){
			return this.props.FreeTasks.map((task) => {
				return(
					<div onClick={() => this.openEditTaskDialog(task, 'freeTasks')} style={taskStyle} className={taskClass} id={task.key} key={task.key}>
					<div style={{paddingLeft: 0}} className="uk-width-1-2">{this.readTaskIcon(task.type)} {task.name}</div>
					<div style={{textAlign: "right", fontWeight: 'bold'}} className="uk-width-1-2">
						{task.time}h
						{this.readTaskPriority(task.priority)} <Tooltip styles={{tooltip: {left: '10%'}, wrapper: {cursor: 'auto'}}} content={this.getPersonName(task.owner.key)}><Avatar src={this.props.EmployeesImages[task.owner.key]} /></Tooltip>
					</div>
					</div>
				);
			});
		}else{return null;}
	}
	checkSprintDisabled(sprint){
		if(!(sprint.key != this.props.ActiveSprintKey && this.props.ActiveSprintKey != false) && sprint.tasks.length > 0)
		{
			return false;
		}
		return true;
	}
	checkSprintActivity(sprint){
		if(sprint.active){
			this.activeSprintKey = sprint.key;
			return "Complete Sprint";
		}
		else
			return "Start Sprint";
	}
	moveTask(source, target, id){
		let active = false;
		if(source == this.activeSprintKey)
			active = 'source';
		else if (target == this.activeSprintKey)
			active = 'target';

		/*
			if the target is active , add the task to activesprint
			if the source is active , remove the task from activesprint
		*/

		if(active)
			this.openSnackbar();

		source = source == "freeTasks" ? "freeTasks" : `${source}/tasks`;
		target = target == "freeTasks" ? "freeTasks" : `${target}/tasks`;
		this.props.moveTask(source, target, id, this.props.params.id, active);
		//cleanup
		try{
			document.querySelector(`#${id}`).remove();
		}catch(e){}
	}
	completeSprint(incompleteTasksAction = false){
		let sprint = this.state.sprintCompleteSprint
		let incompleteTasks = this.state.sprintCompleteIncompleteTasks;
		
		if(incompleteTasksAction){
			this.props.completeSprint(this.props.params.id, sprint, incompleteTasks, incompleteTasksAction);
		}else{
			this.props.completeSprint(this.props.params.id, sprint);
		}
		this.closeSprintCompletePrompt();
	}
	componentDidMount(){
		this.props.getIncompleteSprints(this.props.params.id);
		this.props.getCompleteSprints(this.props.params.id);
		this.dragulaDecorator(this.components);
		this.props.navigateProject(2);
		
		this.props.getProjectPeople(this.props.params.id, (employees) => {
			employees.forEach((person) => {
				this.props.getEmployeeImage(person.key);
			})
		});		
	}
	getSprintButton(sprint){
		if(sprint.active){
			this.checkSprintActivity(sprint);
			return null;
		}else{
			return (
				<RaisedButton label={this.checkSprintActivity(sprint)} onClick = {
					sprint.active? () => {
							let incompleteTasks = [];
							sprint.tasks.map((task)=>{
								if(task.status.toLowerCase() != 'complete')
									incompleteTasks.push(task);
							});
							if(incompleteTasks.length > 0){
								this.openSprintCompletePrompt(sprint, incompleteTasks);
							}else{
								this.props.completeSprint(this.props.params.id, sprint);
							}
						} : () => {
							this.openStartSprintDialog(sprint);
						}
					}
					secondary={true}
					disabled={this.checkSprintDisabled(sprint)} />
			);
		}
	}
	openStartSprintDialog(sprint){
		this.setState({startSprintModalOpen: true, sprintAboutToStart: sprint});
	}
	closeStartSprintDialog(){
		this.setState({startSprintModalOpen: false});
	}
	submitStartSprintDialog(){
		this.props.submit('StartSprintForm');
		this.closeStartSprintDialog();

	}
	onStartSprintSubmit(submit){
		let dates = {startDate: submit.startDate, endDate: submit.endDate};
		dates.startDate.setHours(0,0,0,0);
		dates.endDate.setHours(0,0,0,0);
		dates.startDate = dates.startDate.getTime();
		dates.endDate = dates.endDate.getTime();

		this.props.startSprint(this.props.params.id, this.state.sprintAboutToStart, this.props.AllSprints.map((sprint) => {return sprint.key;}), this.props.LoggedInUser.key, dates);
	}
	switchCollapse(key){
		let newObj = {};
		newObj[key] = !this.state.sprintCollapse[key];
		let sprintCollapse = Object.assign(this.state.sprintCollapse, newObj);
		this.setState({sprintCollapse});
	}
	renderSprints(){
		return this.props.AllSprints.map((sprint) => {
			return (
				<div key={sprint.key} className="uk-width-1-1 uk-margin-top">
					<div className="uk-grid">
					<div className="uk-width-1-2">
					<h4 onTouchTap={() => {this.switchCollapse(sprint.key);}} style={{color: "#2196F3", cursor: 'pointer'}}>
						<CollapseIcon color="#9E9E9E" />
						{sprint.name}&nbsp;-&nbsp;{sprint.tasks.length} tasks {sprint.active?<ActiveSprintIcon color="#66BB6A"/>:null}
					</h4>
					</div>

					<div className="uk-width-1-2" style={{textAlign: "right"}}>
					<RaisedButton onClick={(event) => this.openActionsMenu(event, sprint)} onTouchTap={(event) => {this.openActionsMenu(event, sprint);}} label="Actions" primary={true} icon={<SettingsIcon />} />&nbsp;
					{this.getSprintButton(sprint)}
					</div>
					</div>
				<Collapsible open={this.state.sprintCollapse[sprint.key]} key={sprint.key}>
					<div style={{fontWeight: 'bold'}} className="uk-margin-small-left uk-margin-small-top">
						Start : {readDate(new Date(sprint.startDate))} &nbsp; | &nbsp;
						End : {readDate(new Date(sprint.endDate))}
					</div>
					<hr style={{clear: "both"}}/>
					<div id={sprint.key} ref={this.addComponent} style={dropStyle} >
					{
						sprint.tasks.map((task) => {
							return(
								<div onClick={() => this.openEditTaskDialog(task, `${sprint.key}/tasks`)} key={task.key} style={taskStyle} className={taskClass} id={task.key} key={task.key}>
								<div style={{paddingLeft: 0}} className="uk-width-1-2">{this.readTaskIcon(task.type)} {task.name}</div>
								<div style={{textAlign: "right", fontWeight: 'bold'}} className="uk-width-1-2">
									{task.time}h
									{this.readTaskPriority(task.priority)} <Tooltip styles={{tooltip: {left: '10%'}, wrapper: {cursor: 'auto'}}} content={this.getPersonName(task.owner.key)}><Avatar src={this.props.EmployeesImages[task.owner.key]} /></Tooltip>
								</div>
								</div>
							);
						})
					}
					</div>
					</Collapsible>
					<hr style={{clear: "both"}}/>
				</div>
			);
		});
	}
	renderCompleteSprints(){
		return this.props.CompleteSprints.map((sprint) => {
			return (
				<div key={sprint.key} className="uk-width-1-1 uk-margin-top">
					<div className="uk-grid">
					<div className="uk-width-1-2">
					<h4 onTouchTap={() => {this.switchCollapse(sprint.key);}} style={{color: "#2196F3", cursor: 'pointer'}}>
						<CollapseIcon color="#9E9E9E" />
						{sprint.name}&nbsp;-&nbsp;{sprint.tasks.length} tasks {sprint.active?<ActiveSprintIcon color="#66BB6A"/>:null}
					</h4>
					</div>

					<div className="uk-width-1-2" style={{textAlign: "right"}}>
					{/*<RaisedButton onClick={(event) => this.openActionsMenu(event, sprint)} onTouchTap={(event) => {this.openActionsMenu(event, sprint);}} label="Actions" primary={true} icon={<SettingsIcon />} />&nbsp;
					{this.getSprintButton(sprint)}*/}
					</div>
					</div>
				<Collapsible open={this.state.sprintCollapse[sprint.key]} key={sprint.key}>
					<div style={{fontWeight: 'bold'}} className="uk-margin-small-left uk-margin-small-top">
						Start : {readDate(new Date(sprint.startDate))} &nbsp; | &nbsp;
						End : {readDate(new Date(sprint.endDate))}
					</div>
					<hr style={{clear: "both"}}/>
					<div id={sprint.key} style={dropStyle} >
					{
						sprint.tasks.map((task) => {
							return(
								<div key={task.key} style={Object.assign({}, taskStyle, {cursor: 'auto'})} className={taskClass} id={task.key} key={task.key}>
								<div style={{paddingLeft: 0}} className="uk-width-1-2">{this.readTaskIcon(task.type)} {task.name}</div>
								<div style={{textAlign: "right", fontWeight: 'bold'}} className="uk-width-1-2">
									{task.time}h
									{this.readTaskPriority(task.priority)} <Tooltip styles={{tooltip: {left: '10%'}, wrapper: {cursor: 'auto'}}} content={this.getPersonName(task.owner.key)}><Avatar src={this.props.EmployeesImages[task.owner.key]} /></Tooltip>
								</div>
								</div>
							);
						})
					}
					</div>
					</Collapsible>
					<hr style={{clear: "both"}}/>
				</div>
			);
		});
	}
	render(){
		return(
			<div style={{paddingTop: 5}} className="uk-margin-small-top uk-margin-small-left uk-margin-small-right">
			
			<div className="uk-grid">
				
				{this.renderSprints()}
				
				<div className="uk-width-1-1 uk-margin-bottom">
				<br style={{clear: "both"}}/>
				<h4 style={{color: "#2196F3"}}>Backlog&nbsp;-&nbsp;{this.props.FreeTasks.length} tasks</h4>
				<br />
				<div style={{...dropStyle}} id="freeTasks" ref={this.addComponent}>
					{this.readTasks()}
				</div>
				</div>

				<div className="uk-width-1-1">
					<hr />
					<h4>Complete Sprints:</h4>
					{this.renderCompleteSprints()}
				</div>

			</div>
			<div style={bottomLeft}>
			<AddButton svgIcon={<SprintIcon />} style={{marginBottom: 5}} onClick={this.openNewSprintDialog}/>
			<br />
			<AddButton style={{}} onClick={this.openNewTaskDialog}/>
			</div>
			<NewTaskDialog
				ref={this.formRef}
				onSubmit={this.onSubmit}
				open={this.state.newTaskDialogOpen}
				ProjectPeople = {this.props.ProjectPeople}
				projectID={this.props.params.id}
				onRequestClose={this.closeNewTaskDialog}
				onRequestSubmit={this.submitNewTaskDialog}
			/>
			<EditTaskDialog
				onSubmit={this.onEditTaskSubmit}
				open={this.state.editTaskDialogOpen}
				projectID={this.props.params.id}
				initialValues={this.state.editedTask}
				ProjectPeople = {this.props.ProjectPeople}
				onRequestClose={this.closeEditTaskDialog}
				onRequestSubmit={this.submitEditTaskDialog}
			/>

			{/*initialValues={{startDate: new Date(), endDate: new Date(new Date().getTime() + Dayms*7)}}*/}
			<NewSprintDialog
				ref={this.SprintFormRef}
				onSubmit={this.onSprintSubmit}
				open={this.state.newSprintDialogOpen}
				onRequestClose={this.closeNewSprintDialog}
				onRequestSubmit={this.submitNewSprintDialog}
			/>
			{/*, startDate: new Date(this.ActiveSprint.startDate), endDate: new Date(this.ActiveSprint.endDate)*/}
			<EditSprintModal
				ref={this.EditSprintFormRef}
				onSubmit={this.onEditSprintSubmit}
				projectID={this.props.params.id}
				initialValues={{name: this.ActiveSprint.name, startDate: this.ActiveSprint.startDate, endDate: this.ActiveSprint.endDate}}
				open={this.state.EditSprintDialogOpen}
				onRequestClose={this.closeEditSprintDialog}
				onRequestSubmit={this.submitEditSprintDialog}
			/>
			<StartSprintModal
				onSubmit={this.onStartSprintSubmit}
				initialValues={{startDate: new Date(), endDate: new Date(new Date().getTime() + Dayms*7)}}
				open={this.state.startSprintModalOpen}
				onRequestClose={this.closeStartSprintDialog}
				onRequestSubmit={this.submitStartSprintDialog}
			/>
			<Dialog
				title="Are you sure you ?"
				actions={[<FlatButton label="Ok" primary={true} keyboardFocused={true} onClick={this.deleteSprint} onTouchTap={this.deleteSprint} />, <FlatButton primary={true} label="Cancel" onClick={this.closeDeletePrompt} />]}
				modal={false}
				open={this.state.deletePromptOpen}
				onRequestClose={this.closeDeletePrompt}>

			Sprint {this.sprintToBeDeleted.name} will be deleted
			</Dialog>
			
			<Dialog
				title={`This sprint "${this.state.sprintCompleteSprint.name}" has incomplete tasks`}
				actions={[<FlatButton label="Mark as done" primary={true} keyboardFocused={true} onTouchTap={() => {this.completeSprint(1); }} />, <FlatButton onTouchTap={() => {this.completeSprint(2); }} label="Move to backlog" />]}
				modal={false}
				open={this.state.sprintCompletePromptOpen}
				onRequestClose={this.closeSprintCompletePrompt}>
			
			What do you want to do with them ?
			</Dialog>
			
			<Popover
				open={this.state.ActionsMenuOpen}
				anchorEl={this.state.anchorEl}
				onRequestClose={this.closeActionsMenu}>
			<Menu onClick={this.closeActionsMenu}>
				<MenuItem onClick={(event) => {this.openEditSprintDialog(this.state.ActionsMenuSprint)}} primaryText="Edit" />
				{this.state.ActionsMenuSprint.tasks && this.state.ActionsMenuSprint.tasks.length === 0 && this.state.ActionsMenuSprint.active !== true? <MenuItem onClick={(event) => {this.openDeletePrompt(this.state.ActionsMenuSprint);}} primaryText="Delete" /> : null}
			</Menu>
			</Popover>

			<Snackbar
				open={this.state.snackbarOpen}
				message={"Current Sprint Scope Affected"}
				autoHideDuration={2000}
				onRequestClose={this.closeSnackbar} />
			</div>
		);
	}
}

function mapStateToProps(state){
	let ActiveSprintKey = false;
	state.IncompleteSprints.map((sprint) => {
		if(sprint.active)
			ActiveSprintKey = sprint.key;
	});

	return {CompleteSprints: state.CompleteSprints, EmployeesImages: state.EmployeesImages, LoggedInUser: state.LoggedInUser, ActiveSprintKey: ActiveSprintKey, ProjectPeople: state.ProjectPeople, FreeTasks: state.FreeTasks, AllSprints: state.IncompleteSprints};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getCompleteSprints, getEmployeeImage, addLogEntry: addLogEntry, getProjectPeople: getProjectPeople, deleteSprint: deleteSprint, editSprint: editSprint, navigateProject: navigateProject, createSprint: createSprint, completeSprint: completeSprint, startSprint: startSprint, reset: reset, submit: submit, moveTask: moveTask, getFreeTasks: getFreeTasks, getIncompleteSprints: getIncompleteSprints, createTask: createTask, editTask: editTask}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
