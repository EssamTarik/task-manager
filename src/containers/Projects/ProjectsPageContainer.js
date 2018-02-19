import React, {Component} from 'react';
import AddButton from '../../components/AddButton';
import NewProjectModal from '../NewProject/NewProject'
import ProjectsPageTable from './ProjectsPage';
import Snackbar from 'material-ui/Snackbar';
import {reset} from 'redux-form';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import createProject from '../../actions/Projects/createProject';
import NotificationIcon from 'material-ui/svg-icons/social/notifications';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import getUnreadNotificationsNumber from '../../actions/Notifications/getUnreadNotificationsNumber';
import {storage} from '../../api/firebaseAPI';
import NotificationsModal from './NotificationsModal';
import uuid from 'uuid/v4';

let bottomRight = {position: 'fixed', right: 20, bottom: 20, zIndex: 1000};

class ProjectsPageContainer extends Component{
	constructor(props){
		super(props);
		this.state = {open: false, NotificationsModalOpen: false, SnackbarOpen: false};
		this.openDialog = this.openDialog.bind(this);
		this.closeDialog = this.closeDialog.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
		this.openSnackbar = this.openSnackbar.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.openNotificationsModal = this.openNotificationsModal.bind(this);
		this.closeNotificationsModal = this.closeNotificationsModal.bind(this);
	}
	uploadImage(image, imageName, callback){
		this.setState({SnackbarOpen: true});
		if(image && Object.keys(image).length > 0){
			storage.ref(`images/${imageName}`).put(image).then((snapshot) => {
				callback(snapshot.downloadURL);
			})			
		}else{
			callback()
		}
	}
	componentDidMount(){
		this.props.getUnreadNotificationsNumber(this.props.LoggedInUser.key);
	}
	closeSnackbar(reason){
		if(reason !== 'clickaway'){
			this.state.SnackbarOpen = false;
			this.setState(this.state);
		}
	}

	openSnackbar(){
		this.state.SnackbarOpen = true;
		this.setState(this.state);
	}

	openDialog(){
		this.state.open = true;
		this.setState(this.state);
	}

	closeDialog(){
		this.state.open = false;
		this.setState(this.state);
	}

	cleanViews(){
		this.openSnackbar();
		this.closeDialog();
	}
	componentWillReceiveProps(nextProps){
		//console.log(this.props.LoggedInUser.key);
		//console.log(nextProps.LoggedInUser.key);

		if(nextProps.LoggedInUser.key != this.props.LoggedInUser.key)
			this.props.getUnreadNotificationsNumber(nextProps.LoggedInUser.key);
	}

	onSubmit(submit){
		submit = Object.assign({}, submit);
		let startDate = submit.startDate;
		startDate.setHours(0,0,0,0);

		let endDate = submit.endDate;
		endDate.setHours(0,0,0,0);

		let image = submit.image;
		let imageName = uuid();
		if(submit.image && Object.keys(submit.image).length > 0)
			submit.image = imageName;

		submit.startDate = startDate.getTime();
		submit.endDate = endDate.getTime();

		submit.currentCompleteTasks = 0;
		submit.currentTasks = 0;
		submit.finishedTasks = 0;
		submit.totalTime = 0;
		submit.totalTasks = 0;
		submit.finishedTasksTime = 0;
		submit.people = {};
		submit.owner = JSON.parse(submit.owner);
		submit.people[submit.owner.value] = {name: submit.owner.text};
		
		console.log(submit);
		this.cleanViews();
		this.uploadImage(image, imageName, (imageURL) => {
			if(imageURL)
				submit.image = imageURL;
			
			this.props.createProject(submit);
			this.setState({SnackbarOpen: false})
			this.props.reset('NewProjectForm');
		})
	}
	openNotificationsModal(){
		this.setState({NotificationsModalOpen: true});
	}
	closeNotificationsModal(){
		this.setState({NotificationsModalOpen: false});
	}
	render(){
		return (
			<div>
			<ProjectsPageTable disabled={this.state.SnackbarOpen} />
			<div className="uk-grid" style={bottomRight}>
			
			<div style={{textAlign: "right", margin: 0, padding: 0}} className="uk-width-1-1">
			<Badge
			badgeContent={this.props.UnreadNotificationsNumber}
			secondary={true}
			badgeStyle={{top: 12, right: 12}}
			>
				<FloatingActionButton onTouchTap={this.openNotificationsModal} style={{padding: 0, margin: 0}}>
					<NotificationIcon color="white"/>
				</FloatingActionButton>
			</Badge>
			</div>

			<div style={{textAlign: "right", margin: 0, padding: 0}} className="uk-width-1-1"><AddButton disabled={this.state.SnackbarOpen} style={{marginRight: 24}} onClick={this.openDialog}/></div>
			</div>
			<NewProjectModal initialValues = {{startDate: new Date(), endDate: new Date()}} onSubmit={this.onSubmit} close={this.closeDialog} open={this.state.open} />
			<Snackbar open={this.state.SnackbarOpen} message="Creating Project" onRequestClose={this.closeSnackbar} />
			<NotificationsModal open={this.state.NotificationsModalOpen} onRequestClose={this.closeNotificationsModal}/>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getUnreadNotificationsNumber: getUnreadNotificationsNumber, createProject: createProject, reset: reset}, dispatch);
}

function mapStateToProps(state){
	return {UnreadNotificationsNumber: state.UserUnreadNotifications, LoggedInUser: state.LoggedInUser};
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPageContainer);