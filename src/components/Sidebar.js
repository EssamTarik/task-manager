import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import EmployeesIcon from 'material-ui/svg-icons/action/face';
import ProjectsIcon from 'material-ui/svg-icons/places/business-center';
import TeamsIcon from 'material-ui/svg-icons/social/group';
import EditProfileModal from '../containers/Employees/EditProfileModal';
import {connect} from 'react-redux';
import editEmployee from '../actions/Employees/editEmployee';
import editEmployeeProfile from '../actions/Employees/editEmployeeProfile';
import {reset, submit} from 'redux-form';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';


class Sidebar extends Drawer{
	constructor(props){
		super(props);
		this.state = {ProfileEditModalOpen: false};
		this.closeEditProfileModal = this.closeEditProfileModal.bind(this);
		this.openEditProfileModal = this.openEditProfileModal.bind(this);
		this.submitEditProfileForm = this.submitEditProfileForm.bind(this);
		this.onProfileFormSubmit = this.onProfileFormSubmit.bind(this);
	}
	closeEditProfileModal(){
		let newState = this.state;
		newState.ProfileEditModalOpen = false;
		this.setState(newState);
	}
	openEditProfileModal(){
		let newState = this.state;
		newState.ProfileEditModalOpen = true;
		this.setState(newState);
	}
	submitEditProfileForm(submit){
		this.onProfileFormSubmit(submit);
	}
	onProfileFormSubmit(submit){
		let data = JSON.parse(JSON.stringify(submit));
		let loginData = {email: submit.email, password: submit.password};
		delete data.password;

		this.closeEditProfileModal();
		let id = this.props.User.key;
		let projects = this.props.User.projects;
		if(!projects)
			projects = [];
			// if(typeof(submit.image) == 'string' || submit.image instanceof String){
			// 	delete data.image;
			// }else if(typeof(submit.image) == 'array' || submit.image instanceof Array){
			// 	let imageName = uuid();
			// 	let image = submit.image[0];
			// 	this.uploadUserImage(image, imageName);
			// 	data.image = imageName;
			// }
		this.props.editEmployee(data, id, projects);
		if(!(loginData.password && loginData.password.length > 0))
			loginData.password=false;
		if(!(loginData.email && loginData.email.length > 0))
			loginData.email=false;
		
		this.props.editEmployeeProfile(loginData.email, loginData.password);
	}
	render(){
		return(
			<MuiThemeProvider>
			<div>
			<Drawer
				docked={false}
				open={this.props.open}
				onRequestChange={this.props.switchSidebar}
				onRequestClose={this.props.switchSidebar}
				>
			<div style={{textAlign: "center", paddingTop: 20, paddingBottom: 20, backgroundImage: "url('/static/img/material_bg.png')"}}>
				<a onTouchTap={this.openEditProfileModal}><Avatar src={this.props.User.imageURL} /><h5 style={{paddingLeft: 5, color: "#FAFAFA"}}>{this.props.User.username}</h5></a>
			</div>
			<Link onClick={this.props.switchSidebar} style={{textDecoration: 'none', marginTop: "20%"}} to={"/projects"}><MenuItem leftIcon={<ProjectsIcon />} primaryText="Projects" /></Link>
			<Link onClick={this.props.switchSidebar} style={{textDecoration: 'none'}} to={"/employees"}><MenuItem leftIcon={<EmployeesIcon />} primaryText="Employees" /></Link>
			<Link onClick={this.props.switchSidebar} style={{textDecoration: 'none'}} to={"/teams"}><MenuItem leftIcon={<TeamsIcon />} primaryText="Teams" /></Link>
			{this.props.User.admin?<Link onClick={this.props.switchSidebar} style={{textDecoration: 'none'}} to={"/admin/users"}><MenuItem leftIcon={<TeamsIcon />} primaryText="Users Approval" /></Link>:null}
			</Drawer>
			<EditProfileModal
				open={this.state.ProfileEditModalOpen}
				initialValues={{
					username: this.props.User.username,
					position: this.props.User.position,
					email: this.props.User.email,
					image: this.props.User.imageURL
				}}
				onSubmit={this.onProfileFormSubmit}
				onRequestSubmit={this.submitEditProfileForm}
				onRequestClose={this.closeEditProfileModal} />

			</div>
			</MuiThemeProvider>

		);
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({reset: reset, submit: submit, editEmployee: editEmployee, editEmployeeProfile: editEmployeeProfile}, dispatch);
}

function mapStateToProps(state){
	return {User: state.LoggedInUser};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);