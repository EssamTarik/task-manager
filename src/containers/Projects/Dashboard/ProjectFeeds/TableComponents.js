import React, {Component} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import Progress from 'react-uikit-progress';
import {Link} from 'react-router';
import {readDateTime} from '../../../../helpers/date';
import {connect} from 'react-redux';
import Avatar from 'material-ui/Avatar';
import {Tooltip} from 'react-lightweight-tooltip';
import TaskIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import BugIcon from 'material-ui/svg-icons/action/bug-report';
import StoryIcon from 'material-ui/svg-icons/action/receipt';


class CompleteProgressBar extends Component{
	render(){
		let progress = this.props.row.finishedTasksTime + this.props.row.currentCompleteTasksTime;
		progress = progress/this.props.row.totalTime*100;
		progress = Math.round(progress);
		if(this.props.row.totalTime == 0)
			progress=0;
		//<LinearProgress style={{height: 20}} mode="determinate" value={parseInt(progress)} />
		return (
			<Progress style={progress===0?{color: 'black'}:{}} striped active context='success' bar={progress} body={progress+"%"} />
		);
	}
}

class StatusView extends Component{
	render(){
		return (
			<div className="uk-border-rounded" style={{width: '60%', textAlign: 'center', color: 'white', backgroundColor: '#43A047'}}>{this.props.row.status}</div>
		);
	}
}


class TaskTypeIcon extends Component{
	readTaskIcon(type){
		switch(type){
			case 1:
				return <Tooltip styles={{wrapper: {cursor: 'auto'}}} content="Task"><TaskIcon color="#00C853"/></Tooltip>
			case 2:
				return <Tooltip styles={{wrapper: {cursor: 'auto'}}} content="Bug"><BugIcon color="#C62828"/></Tooltip>
			case 3:
				return <Tooltip styles={{wrapper: {cursor: 'auto'}}} content="Story"><StoryIcon color="#0097A7"/></Tooltip>
			default:
				return null;
		}
	}

	render(){
		return this.readTaskIcon(parseInt(this.props.row.type))
	}
}

class TasksProgressBar extends Component{
	render(){
		let progress = this.props.row.finishedTasks;
		progress = progress/this.props.row.totalTasks*100;
		progress = Math.round(progress);
		if(this.props.row.totalTasks == 0)
			progress=0;

		// <LinearProgress style={{height: 20}} mode="determinate" value={parseInt(progress)} />
		return (
			<Progress style={progress===0?{color: 'black'}:{}} striped active context='success' bar={progress} body={progress+"%"} />
		);
	}
	// render(){
	// 	let progress = this.props.row.currentCompleteTasks;
	// 	progress = progress/this.props.row.currentTasks*100;
	// 	if(this.props.row.currentTasks == 0)
	// 		progress=0;
	// 	return (
	// 		<LinearProgress style={{height: 20}} mode="determinate" value={progress} />
	// 	);
	// }
}


class DateView extends Component{
	render(){
		return <span>{readDateTime(new Date(this.props.row.time))}</span>
	}
	// render(){
	// 	let progress = this.props.row.currentCompleteTasks;
	// 	progress = progress/this.props.row.currentTasks*100;
	// 	if(this.props.row.currentTasks == 0)
	// 		progress=0;
	// 	return (
	// 		<LinearProgress style={{height: 20}} mode="determinate" value={progress} />
	// 	);
	// }
}


class SprintProgressBar extends Component{
	render(){
		let progress = this.props.row.currentCompleteTasks;
		progress = progress/this.props.row.currentTasks*100;
		progress = Math.round(progress);
		if(this.props.row.currentTasks == 0)
			progress=0;
		//<LinearProgress style={{height: 20}} mode="determinate" value={progress} />
		return (
			<Progress style={progress===0?{color: 'black'}:{}} striped active context='success' bar={progress} body={progress+"%"} />
		);
	}
}

class URL extends Component{
	render(){
		let prefix = '';
		switch(this.props.row.role){
			case "viewer":
				prefix = 'viewer/';
				break;
			case "employee":
				prefix = 'employee/'
				break;
		}

		return (
			<a href={"/projects/" + prefix + this.props.row.key}>{this.props.row.name}</a>
		);
	}
}

class UserImage extends Component{
	render(){
		return <Tooltip styles={{wrapper: {cursor: 'auto'}}} content={this.props.row.userName}><Avatar src={this.props.EmployeesImages[this.props.row.userKey]} /></Tooltip>;
	}
}

class remainingDays extends Component{
	constructor(props){
		super(props);
		this.state = {color: 'black'};
	}
	componentDidMount(){
		if(this.props.row.remainingDays <= 5 && this.props.row.remainingDays > 0)
			this.interval = setInterval(() => {
				this.setState({color: this.state.color==='red'?'black':'red'});
			}, 500);
		else if(this.props.row.remainingDays > 5)
			this.setState({color: 'black'});
		else
			this.setState({color: 'red'});
	}
	componentWillUnmount(){
		clearInterval(this.interval);
	}
	render(){
		return (
			<div style={{color: this.state.color, fontWeight: 'bold'}}>{this.props.row.remainingDays>0?`${this.props.row.remainingDays} Days`:`${Math.abs(this.props.row.remainingDays)} Days ago`}</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {EmployeesImages: state.EmployeesImages};
}
UserImage = connect(mapStateToProps)(UserImage);

export {DateView, CompleteProgressBar, URL, remainingDays, SprintProgressBar, UserImage, StatusView, TaskTypeIcon};