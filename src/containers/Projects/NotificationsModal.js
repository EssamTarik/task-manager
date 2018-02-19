import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getNotifications from '../../actions/Notifications/getNotifications';
import Avatar from 'material-ui/Avatar';
import WorkIcon from 'material-ui/svg-icons/action/work';

let bottomLeft = {position: 'fixed', right: 20, bottom: 20}

class NotificationsModal extends Component{
	componentWillReceiveProps(nextProps){
		if(this.props.LoggedInUser.key != nextProps.LoggedInUser.key || this.props.open != nextProps.open)
			 this.props.getNotifications(nextProps.LoggedInUser.key);
	}
	readNotifications(){
		let taskRegex = /you were assigned task \"(.*)\"/i;
		let userPendingRegex = /user (.*) is.*/i;
		let ret = [];
		if(this.props.UserNotifications.length == 0)
			return null;
		// console.log(this.props.UserNotifications);
		for(let i=this.props.UserNotifications.length-1; i>=0; i--){
			let notification = this.props.UserNotifications[i];

			let notificationText = '';
			let taskIcon = false;
			let projectID = notification.url.split('/')[notification.url.split('/').length-1];

			if(taskRegex.test(notification.text)){
				let taskName = taskRegex.exec(notification.text)[1];
				notificationText = ` Assigned "${taskName}"${this.props.AllProjects[projectID]?" in project: " + this.props.AllProjects[projectID].name:''}`;
				taskIcon=this.props.AllProjects[projectID]?this.props.AllProjects[projectID].image:'/static/img/avatar.png';
			}else if(userPendingRegex.test(notification.text)){
				let userName = userPendingRegex.exec(notification.text)[1];
				notificationText = ` User "${userName}" pending approval`;
				taskIcon = '/static/img/avatar.png';
			}
			
			ret.push(<li style={{padding: 10}} key={`notif-${i}`} >
				<a href={notification.url} target="_blank">
				{taskIcon ? <Avatar src={taskIcon} />:<Avatar><WorkIcon /></Avatar>}
				{notificationText}</a>
			</li>);
		}
		return ret;
	}
	render(){
		return (
			<Dialog
				open={this.props.open}
				actions={[<FlatButton label="Exit" primary={true} keyboardFocused={true} onTouchTap={this.props.onRequestClose} />]}
				modal={false}
				title="Notifications"
				autoScrollBodyContent={true}
				onRequestClose={this.props.onRequestClose}
			>
			<div className="uk-margin-top">
			<ul className="uk-list uk-list-striped">
			{this.readNotifications()}
			</ul>
			</div>
			</Dialog>
		);
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getNotifications: getNotifications}, dispatch);
}
function mapStateToProps(state){
	return {AllProjects: state.AllProjects, LoggedInUser: state.LoggedInUser, UserNotifications: state.UserNotifications}
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsModal);