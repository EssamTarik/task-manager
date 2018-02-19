import React, {Component} from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Progress from 'react-uikit-progress';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MediaQuery from 'react-responsive';
import IconButton from 'material-ui/IconButton';
import ShowMoreIcon from 'material-ui/svg-icons/action/list';
import ContentAdd from 'material-ui/svg-icons/social/person-add';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import navigateProject from '../../../actions/Routing/navigateProject';
import getProject from '../../../actions/Projects/getProject';
import editProject from '../../../actions/Projects/editProject';
import getProjectLog from '../../../actions/Projects/getProjectLog';
import removePerson from '../../../actions/Employees/removePerson';
import AddEmployeeModal from './ProjectEmployees/AddEmployee';
import Pie from './Pie';
import {reset, submit} from 'redux-form';
import ProjectSettingsModal from './ProjectSettings';
import closeProjectSettings from '../../../actions/Projects/closeProjectSettings';
import openProjectSettings from '../../../actions/Projects/openProjectSettings';
import lodash from 'lodash';
import uuid from 'uuid/v4';
import ProjectFullFeeds from './ProjectFeeds/ProjectFullFeeds';
import ProjectFullLog from './ProjectLog/ProjectFullLog';
import LogTable from './ProjectLog/MinimalLogTable';
import FeedsTable from './ProjectFeeds/MinimalFeedsTable';
import Dialog from 'material-ui/Dialog';
import {readDateTime} from '../../../helpers/date';
import updateEmployeesTasks from '../../../actions/Tasks/updateEmployeesTasks';
import getEmployeeImage from '../../../actions/Employees/getEmployeeImage';
import EditEmployeeRole from './ProjectEmployees/EditEmployeeRole';
import removeProject from '../../../actions/Projects/removeProject';
import OverdueMilestones from './OverdueMilestones';
import {storage} from '../../../api/firebaseAPI';

const styles={
  chip: {
    margin: 4,
    cursor: 'pointer'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};


const getInitialValues = (project) => {
		let initialValues = {};

		if(project.name)
			initialValues['name'] = project.name;

		if(project.owner){
			let owner = project.owner;
			initialValues['owner'] = JSON.stringify({value: owner.value, text: project.people[owner.value].name});
		}
		
		// if(project.viewers)
			// initialValues['viewers'] = project.viewers;

		if(project.vendor)
			initialValues['vendor'] = project.vendor;

		if(project.startDate)
			initialValues['startDate'] = new Date(project.startDate);
		else
			initialValues['startDate'] = new Date();

		if(project.endDate)
			initialValues['endDate'] = new Date(project.endDate);
		else
			initialValues['endDate'] = new Date();

		if(project.image)
			initialValues['image'] = project.image;

		return initialValues;
		
}

class ProjectDashboard extends Component{

	constructor(props){
		super(props);
		this.state = {FeedsDialogOpen: false, working: false, EmployeeAddModalOpen: false, FullLogOpen: false, selectedperson: false, EditEmployeeRoleDialogOpen: false};
		this.openEmployeeAddModal = this.openEmployeeAddModal.bind(this);
		this.closeEmployeeAddModal = this.closeEmployeeAddModal.bind(this);
		this.removePerson = this.removePerson.bind(this);
		this.openProjectSettingModal = this.openProjectSettingModal.bind(this);
		this.closeProjectSettingModal = this.closeProjectSettingModal.bind(this);
		this.submitProjectSettingsForm = this.submitProjectSettingsForm.bind(this);
		this.onProjectSettingsFormSubmit = this.onProjectSettingsFormSubmit.bind(this);
		this.closeFullLogModal = this.closeFullLogModal.bind(this);
		this.openFullLogModal = this.openFullLogModal.bind(this);
	}
	openEmployeeAddModal(){
		let newState = this.state;
		newState.EmployeeAddModalOpen = true;
		this.setState(newState);
	}
	closeEmployeeAddModal(){
		let newState = this.state;
		newState.EmployeeAddModalOpen = false;
		this.setState(newState);
	}
	renderPeople(){
		// console.log('hello');
	}

	getProgress(){
		let totalTime = this.props.Project.totalTime;
		let finishedTasksTime = this.props.Project.finishedTasksTime + this.props.Project.currentCompleteTasksTime;
		let progress = Math.round(finishedTasksTime/totalTime*100);
		if(totalTime == 0)
			progress=0;
		return <Progress style={progress===0?{color: 'black'}:{}}  striped active context='success' bar={progress} body={progress+"%"} />
	}
	removePerson(personID, role){
		let removeFrom = false;
		switch(role){
			case "leader":
				removeFrom = "leaders";
				break;
			case "viewer":
				removeFrom = "viewers";
				break;
		}

		this.props.removePerson(this.props.params.id, personID, removeFrom);
	}
	searchViewers(key){
		if(this.props.Project.viewers){
			let viewers = Object.keys(this.props.Project.viewers);
			if(viewers.indexOf(key) != -1)
				return true;
		}
		return false;
	}
	searchLeaders(key){
		if(this.props.Project.leaders){
			let leaders = Object.keys(this.props.Project.leaders);
			if(leaders.indexOf(key) != -1)
				return true;
		}
		return false;
	}
	getRole(key){
		if(key == this.props.Project.owner.value)
			return "owner";
		else if(this.searchViewers(key))
			return "viewer";
		else if(this.searchLeaders(key))
			return "leader";
		else
			return 'employee';
	}
	readFeeds(){
		// let log = this.props.Log;
		// let retLog = [];

		// for(let i=log.length-1; i>=0; i--){
		// 	if(i < log.length-5)
		// 		return retLog;

		// 	let logEntry = log[i];
		// 	let personName = ""
		// 	if(this.props.Project.people[logEntry.userKey]){
		// 		personName = `${this.props.Project.people[logEntry.userKey].name} `;
		// 	}
		// 	retLog.push(<li key={logEntry.key}>{readDateTime(new Date(logEntry.time))} - {personName}{logEntry.text} </li>);
		// }

		// return retLog;
		return <FeedsTable minimal={true} data={this.readFullFeeds(5)} />
	}
	readLog(){
		// let log = this.props.Log;
		// let retLog = [];

		// for(let i=log.length-1; i>=0; i--){
		// 	if(i < log.length-5)
		// 		return retLog;

		// 	let logEntry = log[i];
		// 	let personName = ""
		// 	if(this.props.Project.people[logEntry.userKey]){
		// 		personName = `${this.props.Project.people[logEntry.userKey].name} `;
		// 	}
		// 	retLog.push(<li key={logEntry.key}>{readDateTime(new Date(logEntry.time))} - {personName}{logEntry.text} </li>);
		// }

		// return retLog;
		return <LogTable minimal={true} data={this.readFullLog(5)} />
	}
	readFullLog(count){
		
		let log = this.props.Log;
		let retLog = [];

		if(!count || (count && count > log.length))
			count = log.length;

		let logRegex = /(.*)\"(.*)\"/i;
		let movedTaskRegex = /(.*)\s\"(.*)\"\sto\s(.*)/i;
		if(log.length > 0){
			for(let i=log.length-1; i>=log.length-count; i--){
				let logEntry = log[i];
				let entryDetails = logRegex.exec(logEntry.text);
				let action = entryDetails[1];
				let taskName = entryDetails[2];
				
				if(action.trim() === "moved"){
					action = movedTaskRegex.exec(logEntry.text)[3];
				}

				let personName = ""
				if(this.props.Project.people[logEntry.userKey])
					personName = `${this.props.Project.people[logEntry.userKey].name} `;
				
				// let text = `${personName}${logEntry.text}`
				let time = readDateTime(new Date(logEntry.time));

				retLog.push({id: i+1, taskName, time: time, type: logEntry.type, userName: personName, userKey: logEntry.userKey, event: action.trim()});
			}
		}

		return retLog;
	}
	readFullFeeds(count){
		let completeTaskRegex = /moved.*to done/i;
		let taskNameRegex = /moved.*\"(.*)\".*to done/i;
		let log = this.props.Log;
		let retFeeds = [];

		if(!count || (count && count > log.length))
			count = log.length;

		if(log.length > 0){
			for(let i=log.length-1; i>=0; i--){
				let logEntry = log[i];
				if(completeTaskRegex.test(logEntry.text)){
					let personName = ""
					if(this.props.Project.people[logEntry.userKey])
						personName = `${this.props.Project.people[logEntry.userKey].name} `;
					let text = `${personName}${logEntry.text}`
					let time = readDateTime(new Date(logEntry.time));
					let taskName = taskNameRegex.exec(logEntry.text)[1];

					retFeeds.push({id: i+1, taskName, status: 'Done', time: time, type: logEntry.type, userName: personName, userKey: logEntry.userKey});
				}
				if(count !== log.length && retFeeds.length === 5){
					break;
				}
			}
		}

		return retFeeds;
	}

	getPeople(){
		let people = [];
		try{
			people = Object.keys(this.props.Project.people).map((key) => {
				let person = this.props.Project.people[key];
				
				let additionalProps = {};
				if(!person.hasOwnProperty('taskCount') || (person.hasOwnProperty('taskCount') && parseInt(person.taskCount) === 0)){
					if(this.getRole(key) !== 'owner'){
						additionalProps['onRequestDelete'] = () => {
							this.removePerson(key, this.getRole(key))
						};						
					}
				}

				return (
					<Chip 
					key={uuid()}
					{...additionalProps}
					onTouchTap={['owner', 'leader'].indexOf(this.getRole(this.props.LoggedInUser.key)) !== -1 ? (chip) => {this.setState({selectedperson: {role: this.getRole(key), key: key, ...person}, EditEmployeeRoleDialogOpen: true})}:() => {} } 
					style={styles.chip}>

						<Avatar src="/static/img/avatar.png" />
						{person.name} - {this.getRole(key)}
					</Chip>);
			});
		}catch(e){
			// console.log(e);
		}
		if(people.length == 0)
			people = <div className="uk-margin-small-left uk-margin-small-top uk-margin-small-bottom">No People In This Project</div>;

		return people;
	}

	getPieChart(){
		let incomplete = this.props.Project.totalTasks-(this.props.Project.finishedTasks + this.props.Project.currentCompleteTasks);
		incomplete = Math.round(incomplete  / this.props.Project.totalTasks * 100);

		let complete = this.props.Project.finishedTasks + this.props.Project.currentCompleteTasks;
		complete = Math.round(complete / this.props.Project.totalTasks * 100);
		return <Pie incomplete={incomplete} complete={complete} />;
	}
	getSprintPieChart(){
		let incomplete = this.props.Project.currentTasks-this.props.Project.currentCompleteTasks;
		incomplete = Math.round(incomplete / this.props.Project.currentTasks * 100);

		let complete = Math.round(this.props.Project.currentCompleteTasks / this.props.Project.currentTasks * 100);
		return <Pie incomplete={incomplete} complete={complete}/>;
	}
	openFullLogModal(){
		this.setState({FullLogOpen: true});
	}
	closeFullLogModal(){
		this.setState({FullLogOpen: false});
	}
	componentDidMount(){
		this.props.navigateProject(1);
		this.props.getProject(this.props.params.id, this.props.AllProjects);
		this.props.getProjectLog(this.props.params.id, (userKeys) => {
			userKeys.map((userKey) => {
				this.props.getEmployeeImage(userKey);
			})
		});
		this.props.updateEmployeesTasks(this.props.params.id, this.props.Project.people);
	}
	uploadImage(image, imageName, callback){
		this.setState({working: true});
		if(image && typeof(image) !== 'string'){
			storage.ref(`images/${imageName}`).put(image).then((snapshot) => {
				callback(snapshot.downloadURL);
			})			
		}else{
			callback()
		}
	}
	componentWillReceiveProps(nextProps){
		this.props.updateEmployeesTasks(this.props.params.id, nextProps.Project.people);
	}
	openProjectSettingModal(){
	  this.props.openProjectSettings();
	}
	closeProjectSettingModal(){
	  this.props.closeProjectSettings();
	  this.props.reset('ProjectSettingsForm');
	}
	submitProjectSettingsForm(){
		this.props.submit('ProjectSettingsForm');
	}
	onProjectSettingsFormSubmit(submit){

	  let data = Object.assign({}, submit);

	  let image = submit.image;
	  let imageName = uuid();
	  if(submit.image && typeof(submit.image) !== 'string' && Object.keys(submit.image).length > 0)
	  	data.image = imageName;


	  let startDate = submit.startDate;
	  startDate.setHours(0,0,0,0);

	  let endDate = submit.endDate;
	  endDate.setHours(0,0,0,0);

	  data.startDate = startDate.getTime();
	  data.endDate = endDate.getTime();
	  data.people = {};
	  data.owner = JSON.parse(submit.owner);
	  data.people[data.owner.value] = {name: data.owner.text};
	  
	  // if(submit.viewers){
	  //   submit.viewers.map((viewer) => {
	  //     data.people[viewer.value] = {name: viewer.text};
	  //   });
	  // }
	  let peopleWithoutCurrentOwner = Object.assign({}, this.props.Project.people);
	  delete peopleWithoutCurrentOwner[this.props.Project.owner.value];
	  this.uploadImage(image, imageName, (imageURL) => {
	  	if(imageURL)
	  		data.image = imageURL;
	  	
	  	this.props.editProject(this.props.params.id, data, peopleWithoutCurrentOwner);
	  	this.closeProjectSettingModal();
	  	this.setState({working: false});
	  	this.props.reset('ProjectSettingsForm');
	  })
	}
	renderLarge(){
		return (
			<div className="uk-grid">

			<div style={{paddingRight: 5}} className="uk-width-3-4">
				<br />
				<Paper style={{padding: 5, marginBottom: 10}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="People" />
				</ToolbarGroup>
				<IconButton onClick={this.openEmployeeAddModal} tooltip="Add Employee">
						<ContentAdd />
					</IconButton>
				</Toolbar>
				<div style={styles.wrapper}>
				{this.getPeople()}
				</div>
				</Paper>
				{/*<div className="uk-width-1-1">
					<br />
					<Paper style={{padding: 5}} zDepth={2}>
					<Toolbar style={{height: 40, marginBottom: 5}}>
					<ToolbarGroup>
					<ToolbarTitle text="Feeds" />
					</ToolbarGroup>
					<ToolbarGroup>
					<IconButton tooltip="Full Feed">
						<ShowMoreIcon />
					</IconButton>
					</ToolbarGroup>
					</Toolbar>
					<ul>
						<li>Created a new task</li>
						<li>Started Project</li>
						<li>Project Analysis</li>
					</ul>			
					</Paper>
				</div>*/}


				<div className="uk-width-1-1">
					<br />
					<Paper style={{padding: 5}} zDepth={2}>
					<Toolbar style={{height: 40, marginBottom: 5}}>
					<ToolbarGroup>
					<ToolbarTitle text="Logs" />
					</ToolbarGroup>
					<ToolbarGroup>
					<IconButton onClick={this.openFullLogModal} onTouchTap={this.openFullLogModal} tooltip="Full Log">
						<ShowMoreIcon />
					</IconButton>
					</ToolbarGroup>

					</Toolbar>
					{this.readLog()}
					</Paper>
				</div>

				<div className="uk-width-1-1">
					<br />
					<Paper style={{padding: 5}} zDepth={2}>
					<Toolbar style={{height: 40, marginBottom: 5}}>
					<ToolbarGroup>
					<ToolbarTitle text="Feeds" />
					</ToolbarGroup>
					<ToolbarGroup>
					<IconButton onClick={() => {this.setState({FeedsDialogOpen: true})}} tooltip="Full Feeds">
						<ShowMoreIcon />
					</IconButton>
					</ToolbarGroup>

					</Toolbar>
					{this.readFeeds()}
					</Paper>
				</div>

				<div className="uk-width-1-1">
					<br />
					<Paper style={{padding: 5}} zDepth={2}>
					<Toolbar style={{height: 40, marginBottom: 5}}>
					<ToolbarGroup>
					<ToolbarTitle text="Over Due Milestones" />
					</ToolbarGroup>
					<ToolbarGroup>
					</ToolbarGroup>

					</Toolbar>
					<OverdueMilestones projectID={this.props.params.id} />		
					</Paper>
				</div>

			</div>
			
			<div style={{paddingLeft: 5, paddingTop: 5, borderLeft: "thin solid #CFD8DC"}} className="uk-width-1-4">
				<center style={{width :"100%"}} >
				
				<RaisedButton disabled={this.props.LoggedInUser && this.props.Project.people ? ['owner'].indexOf(this.getRole(this.props.LoggedInUser.key)) === -1 : true} primary={true} style={{backgroundColor: 'white', color: '#00BCD4'}} label="Project Settings" onClick={this.openProjectSettingModal} onTouchTap={this.openProjectSettingModal}/> &nbsp;
				<RaisedButton disabled={this.props.LoggedInUser && this.props.Project.people ? ['leader', 'owner'].indexOf(this.getRole(this.props.LoggedInUser.key)) === -1 || this.props.Project.totalTasks !== 0 : true} secondary={true} style={{backgroundColor: 'white', color: '#00BCD4'}} label="Delete Project" onClick={() => {this.props.removeProject(this.props.params.id, this.props.Project.people)}} />
				<hr />

				<h5>Project Progress ({this.props.Project.finishedTasksTime + this.props.Project.currentCompleteTasksTime}/{this.props.Project.totalTime}) hours</h5>
				{this.getProgress()}

				<hr/>

				<h5>Task Progress ({this.props.Project.finishedTasks + this.props.Project.currentCompleteTasks}/{this.props.Project.totalTasks})</h5>
				{this.getPieChart()}
				
				<hr/>
				
				<h5>Sprint Progress ({this.props.Project.currentCompleteTasks}/{this.props.Project.currentTasks})</h5>
				{this.getSprintPieChart()}
								
				</center>
			</div>
			
			</div>
		);
	}
	renderMobile(){
		return (

			<div>
			<div style={{paddingTop: 10}} className="uk-grid">
			
			{/*<div className="uk-width-1-2">
				<center>
				<h5>Project Progress ({this.props.Project.finishedTasksTime}/{this.props.Project.totalTime}) hours</h5>
				{this.getProgress()}
				</center>
			</div>*/}
			
			<div className="uk-width-1-2">
				<center>
				<h5>Task Progress ({this.props.Project.finishedTasks + this.props.Project.currentCompleteTasks}/{this.props.Project.totalTasks})</h5>
				{this.getPieChart()}
				</center>
			</div>

			<div className="uk-width-1-2">
			<h5>Sprint Progress ({this.props.Project.currentCompleteTasks}/{this.props.Project.currentTasks})</h5>
			{this.getSprintPieChart()}
			</div>
			<div style={{textAlign: "center"}} className="uk-width-1-1">
			<hr />
				<RaisedButton disabled={this.props.LoggedInUser && this.props.Project.people ? ['owner'].indexOf(this.getRole(this.props.LoggedInUser.key)) === -1 : true} primary={true} style={{backgroundColor: 'white', color: '#00BCD4'}} label="Project Settings" onClick={this.openProjectSettingModal} onTouchTap={this.openProjectSettingModal}/> &nbsp;
				<RaisedButton disabled={this.props.LoggedInUser && this.props.Project.people ? ['leader', 'owner'].indexOf(this.getRole(this.props.LoggedInUser.key)) === -1 || this.props.Project.totalTasks !== 0 : true} secondary={true} style={{backgroundColor: 'white', color: '#00BCD4'}} label="Delete Project" onClick={() => {this.props.removeProject(this.props.params.id, this.props.Project.people)}} />
			</div>
			
			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5, marginBottom: 10}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="People" />
				</ToolbarGroup>
				<IconButton onClick={this.openEmployeeAddModal} tooltip="Add Employee">
						<ContentAdd />
					</IconButton>
				</Toolbar>
				<div style={styles.wrapper}>
				{this.getPeople()}
				</div>
				</Paper>
			</div>

			{/*<div className="uk-width-1-1">
					<br />
					<Paper style={{padding: 5}} zDepth={2}>
					<Toolbar style={{height: 40, marginBottom: 5}}>
					<ToolbarGroup>
					<ToolbarTitle text="Feeds" />
					</ToolbarGroup>
					<ToolbarGroup>
					<IconButton  tooltip="Full Feed">
						<ShowMoreIcon />
					</IconButton>
					</ToolbarGroup>

					</Toolbar>
					<ul>
						<li>Created a new task</li>
						<li>Started Project</li>
						<li>Project Analysis</li>
					</ul>			
					</Paper>
			</div>*/}


			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="Logs" />
				</ToolbarGroup>
				<ToolbarGroup>
				<IconButton onClick={this.openFullLogModal} onTouchTap={this.openFullLogModal} tooltip="Full Log">
					<ShowMoreIcon />
				</IconButton>
				</ToolbarGroup>

				</Toolbar>
				{this.readLog()}
				</Paper>
			</div>

			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="Feeds" />
				</ToolbarGroup>
				<ToolbarGroup>
				<IconButton onClick={() => {this.setState({FeedsDialogOpen: true})}} tooltip="Full Feeds">
					<ShowMoreIcon />
				</IconButton>
				</ToolbarGroup>

				</Toolbar>
				{this.readFeeds()}
				</Paper>
			</div>

			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="Over Due Milestones" />
				</ToolbarGroup>
				<ToolbarGroup>
				</ToolbarGroup>

				</Toolbar>
				<OverdueMilestones projectID={this.props.params.id} />		
				</Paper>
			</div>

			
			</div>
			</div>
		);
	}
	renderMobileSmall(){
		return (

			<div>
			<div style={{paddingTop: 10}} className="uk-grid">
			
			<div className="uk-width-1-1">
				<center>
				<h5>Project Progress ({this.props.Project.finishedTasksTime}/{this.props.Project.totalTime}) hours</h5>
				{this.getProgress()}
				</center>
			</div>
			
			<div className="uk-width-1-1">
				<center>
				<h5>Task Progress ({this.props.Project.finishedTasks + this.props.Project.currentCompleteTasks}/{this.props.Project.totalTasks})</h5>
				{this.getPieChart()}
				</center>
			</div>

			<div className="uk-width-1-1">
				<center>
				<h5>Sprint Progress ({this.props.Project.currentCompleteTasks}/{this.props.Project.currentTasks})</h5>
				{this.getSprintPieChart()}
				</center>
			</div>
			
			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5, marginBottom: 10}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="People" />
				</ToolbarGroup>
				<IconButton onClick={this.openEmployeeAddModal} tooltip="Add Employee">
						<ContentAdd />
					</IconButton>
				</Toolbar>
				<div style={styles.wrapper}>
				{this.getPeople()}
				</div>
				</Paper>
			</div>

			{/*<div className="uk-width-1-1">
					<br />
					<Paper style={{padding: 5}} zDepth={2}>
					<Toolbar style={{height: 40, marginBottom: 5}}>
					<ToolbarGroup>
					<ToolbarTitle text="Feeds" />
					</ToolbarGroup>
					<ToolbarGroup>
					<IconButton tooltip="Full Feed">
						<ShowMoreIcon />
					</IconButton>
					</ToolbarGroup>

					</Toolbar>
					<ul>
						<li>Created a new task</li>
						<li>Started Project</li>
						<li>Project Analysis</li>
					</ul>			
					</Paper>
			</div>*/}


			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="Logs" />
				</ToolbarGroup>
				<ToolbarGroup>
				<IconButton  onClick={this.openFullLogModal} onTouchTap={this.openFullLogModal} tooltip="Full Log">
					<ShowMoreIcon />
				</IconButton>
				</ToolbarGroup>

				</Toolbar>
				{this.readLog()}
				</Paper>
			</div>

			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="Feeds" />
				</ToolbarGroup>
				<ToolbarGroup>
				<IconButton onClick={() => {this.setState({FeedsDialogOpen: true})}} tooltip="Full Feeds">
					<ShowMoreIcon />
				</IconButton>
				</ToolbarGroup>

				</Toolbar>
				{this.readFeeds()}
				</Paper>
			</div>

			<div className="uk-width-1-1">
				<br />
				<Paper style={{padding: 5}} zDepth={2}>
				<Toolbar style={{height: 40, marginBottom: 5}}>
				<ToolbarGroup>
				<ToolbarTitle text="Over Due Milestones" />
				</ToolbarGroup>
				<ToolbarGroup>
				</ToolbarGroup>

				</Toolbar>
				<OverdueMilestones projectID={this.props.params.id} />		
				</Paper>
			</div>

			
			</div>
			</div>
		);
	}
	render(){
		return (
			<div style={{}}>
			<MediaQuery query="(min-width: 900px)">
				{this.renderLarge()}
			</MediaQuery>
			<MediaQuery query="(max-width: 899px) and (min-width: 500px)">
				{this.renderMobile()}
			</MediaQuery>
			<MediaQuery query="(max-width: 499px)">
				{this.renderMobileSmall()}
			</MediaQuery>
			<br />
			<AddEmployeeModal projectPeople={this.props.Project.people} owner={this.props.Project.owner} projectID={this.props.params.id} open={this.state.EmployeeAddModalOpen} onRequestClose={this.closeEmployeeAddModal} />
			<EditEmployeeRole person={this.state.selectedperson} projectPeople={this.props.Project.people} owner={this.props.Project.owner} projectID={this.props.params.id} open={this.state.EditEmployeeRoleDialogOpen} onRequestClose={() => {this.setState({EditEmployeeRoleDialogOpen: false})}} />
			
			<ProjectSettingsModal
			  open={this.props.ProjectSettingsState}
			  workingEmployees={this.props.Project.people}
			  projectID={this.props.params.id}
			  initialValues={getInitialValues(this.props.Project)}
			  onRequestClose={this.closeProjectSettingModal}
			  onRequestSubmit={this.submitProjectSettingsForm}
			  onSubmit={this.onProjectSettingsFormSubmit}
			  working={this.state.working}
			  />

			<ProjectFullLog
				open={this.state.FullLogOpen}
				onRequestClose={this.closeFullLogModal}
				data={this.readFullLog()}
				/>
			<ProjectFullFeeds
				open={this.state.FeedsDialogOpen}
				onRequestClose={() => {this.setState({FeedsDialogOpen: false})}}
				data={this.readFullFeeds()}
				/>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {EmployeesImages: state.EmployeesImages, LoggedInUser: state.LoggedInUser, Log: state.Log, ProjectSettingsState: state.ProjectSettingsState, AllProjects: state.AllProjects, Project: state.Project};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({removeProject, getEmployeeImage, updateEmployeesTasks, getProjectLog: getProjectLog, openProjectSettings: openProjectSettings, closeProjectSettings: closeProjectSettings, submit: submit, reset: reset, editProject: editProject, removePerson: removePerson, navigateProject: navigateProject, getProject: getProject}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDashboard);