import React, {Component} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import {Link} from 'react-router';
import HighPriorityIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import LowPriorityIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import MediumPriorityIcon from 'material-ui/svg-icons/navigation/arrow-forward';

function readTaskPriority(priority){
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

class TaskDuration extends Component{
	render(){
		return (
			<span>{this.props.row.time}h</span>
		);
	}
}

class CompleteProgressBar extends Component{
	render(){
		return (
			<LinearProgress style={{height: "20"}} mode="determinate" value={this.props.row.completion} />
		);
	}
}

class TasksProgressBar extends Component{
	render(){
		return (
			<LinearProgress style={{height: "20"}} mode="determinate" value={this.props.row.tasks} />
		);
	}
}

class URL extends Component{
	render(){
		return (
			<Link to={"/projects/"+this.props.row.name}>{this.props.row.name}</Link>
		);
	}
}


class PriorityView extends Component{
	render(){
		return (
			<div>{readTaskPriority(this.props.row.priority)}</div>
		);
	}
}

class StatusView extends Component{
	render(){
		this.color = "white";
		if(this.props.row.status === "To Do"){
			this.backgroundColor = "#039BE5";
		}
		else if(this.props.row.status === "Done"){
			this.backgroundColor = "#43A047";
		}
		else{
			this.backgroundColor = "#FFEB3B";
			this.color = '#424242';
		}
		return (
			<div className="uk-border-rounded" style={{textAlign: 'center', color: this.color, backgroundColor: this.backgroundColor}}>{this.props.row.status}</div>
		);
	}
}

export {TaskDuration, TasksProgressBar, CompleteProgressBar, URL, PriorityView, StatusView};