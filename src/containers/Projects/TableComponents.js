import React, {Component} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import Progress from 'react-uikit-progress';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';

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
			<a href={"/projects/" + prefix + this.props.row.key}>
				{/*this.props.row.image?<Avatar src={this.props.row.image} />:null*/}
				{this.props.row.name}
			</a>
		);
	}
}


class remainingDays extends Component{
	constructor(props){
		super(props);
		this.state = {color: 'black'};
	}
	componentDidMount(){
		if(this.props.row.remainingDays <= 5 && this.props.row.remainingDays >= 0)
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
		let progress = this.props.row.finishedTasksTime + this.props.row.currentCompleteTasksTime;
		let completeProject = progress === this.props.row.totalTime && progress > 0;
		return (
			completeProject ? null : <div style={{color: this.state.color, fontWeight: 'bold'}}>{this.props.row.remainingDays>=0?`${this.props.row.remainingDays} Days`:`${Math.abs(this.props.row.remainingDays)} Days ago`}</div>
		);
	}
}


export {TasksProgressBar, CompleteProgressBar, URL, remainingDays, SprintProgressBar};