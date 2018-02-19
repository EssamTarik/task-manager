import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getTaskInfo from '../../../actions/ActiveSprint/getTaskInfo';
import getTaskAttachments from '../../../actions/Attachments/getTaskAttachments';
import TaskIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import BugIcon from 'material-ui/svg-icons/action/bug-report';
import HighPriorityIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import LowPriorityIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import MediumPriorityIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import StoryIcon from 'material-ui/svg-icons/action/receipt';
import TextField from 'material-ui';
import uuid from 'uuid/v4';

class TaskInfoDialog extends Component{
	constructor(props){
		super(props);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.open === false && this.props.open == true){
			this.props.getTaskInfo(nextProps.projectID, nextProps.taskPath, true);
			let taskKey = (nextProps.taskPath.split('/')[2]);
			this.props.getTaskAttachments(this.props.projectID, taskKey);
		}
		else if((this.props.open === false && nextProps.open === true) || (this.props.taskPath != nextProps.taskPath)){
			let taskKey = (nextProps.taskPath.split('/')[2]);
			this.props.getTaskInfo(nextProps.projectID, nextProps.taskPath);
			this.props.getTaskAttachments(this.props.projectID, taskKey);
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
	getMultilineArray(text){
		if(text)
			return text.split('\n');
		else
			return [];
	}
	render(){
		return (
			<Dialog
				title="Task Info"
				autoScrollBodyContent={true}
				modal={false}
				actions={[
					<FlatButton keyboardFocused={true} label="Ok" primary={true} onTouchTap={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}
			>
			<div className="uk-grid uk-margin-top">
				<div className="uk-width-1-1 uk-text-bold">
					<span>Name: </span><span className="uk-border-rounded " style={{ color: '#37474F'}}>{this.props.TaskInfo.name}</span>
					<hr />
				</div>
				<div className="uk-width-1-1 uk-text-bold uk-margin-top">
					<span>Time: </span><span className="uk-border-rounded " style={{ color: '#37474F'}}>{this.props.TaskInfo.time}</span> hr
					<hr />
				</div>
				<div className="uk-width-1-2 uk-text-bold uk-margin-top">
					<span>Priority: </span><span className="uk-border-rounded " style={{ color: '#37474F'}}>{this.readTaskPriority(this.props.TaskInfo.priority)}</span>
				</div>
				<div className="uk-width-1-2 uk-text-bold uk-margin-top">
					<span>Type: </span><span className="uk-border-rounded " style={{ color: '#37474F'}}>{this.readTaskIcon(this.props.TaskInfo.type)}</span>
				</div>
				<div className="uk-width-1-1 uk-text-bold uk-margin-top">
					<hr />
					<span>Description: </span><span className="uk-border-rounded " style={{ color: '#37474F'}}>{this.getMultilineArray(this.props.TaskInfo.description).map((line) => {return <div key={uuid()}>&nbsp;{line}</div>})}</span>
				</div>
				<div className="uk-width-1-1 uk-text-bold uk-margin-top">
					<hr />
					<span>Attachments: </span>
						<span className="uk-border-rounded" style={{color: '#37474F'}}>
						{Object.keys(this.props.TaskAttachments).map((attachmentName) => {
							return <span key={uuid()}><br/><a target="_blank" href={this.props.TaskAttachments[attachmentName]}>{attachmentName}</a></span>
						})}
						</span>
				</div>
			</div>
			</Dialog>
		);
	}
}

const mapStateToProps = (state) => {
	return {TaskInfo: state.TaskInfo, TaskAttachments: state.TaskAttachments};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({getTaskInfo, getTaskAttachments}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskInfoDialog);