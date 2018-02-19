import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import ViewModule from 'material-ui/svg-icons/action/view-module';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import logout from '../actions/Auth/logout';
import getProject from '../actions/Projects/getProject';
import RaisedButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge';
import NotificationIcon from 'material-ui/svg-icons/social/notifications';
import Avatar from 'material-ui/Avatar';
import {browserHistory} from 'react-router';

class Header extends Component{
	constructor(props){
		super(props);
		this.state = {DropdownOpen: false};
		this.showDropDown = this.showDropDown.bind(this);
		this.closeDropdown = this.closeDropdown.bind(this);
		this.logout = this.logout.bind(this);
	}

	componentDidMount(){
		this.props.getProject(this.props.projectID);
	}

	showDropDown(event){
		this.setState({DropdownOpen: true, anchorEl: event.currentTarget});
	}
	closeDropdown(){
		this.state.DropdownOpen = false;
		this.setState(this.state);
	}
	logout(){
		this.props.logout();
	}

	//&nbsp;<RaisedButton primary={true} style={{backgroundColor: 'white', color: '#00BCD4'}} label="Project Settings" onClick={this.openProjectSettings} />

	// getProjectName(){
	// 	let project = this.props.Project;
	// 	if(this.props.projectID)
	// 		return <div>{`Task-Manager`}</div>;
	// 	return "Task-Manager";
	// }
	getTitle(){
		if(this.props.projectID && this.props.Project.name)
			return this.props.Project.name;

		return false;
	}
	getImage(){
		if(this.props.projectID && this.props.Project && this.props.Project.image)
			return <Avatar src={this.props.Project.image} />
		else
			return null;
	}
	render(){
		return (
			<AppBar
				title={<span>
					<a href="/" style={{textDecoration: 'none', color: 'white'}}>Task-Manager {this.props.projectID && this.props.Project && this.props.Project.image?` - ` : (this.props.projectID ? ` -` : null)}</a>
					{this.getImage()}
					{this.getTitle()?<span>&nbsp;{this.getTitle()}</span> : null}
					{/*this.getTitle()?<span>&nbsp;-&nbsp;<a style={{textDecoration: 'none', color: 'white'}} href={`/projects/${this.props.projectID}`}>{this.getTitle()}</a></span> : null*/}
				</span>}
				iconElementLeft = {
					<IconButton onClick={this.props.switchSidebar}>
						<MenuIcon />
					</IconButton>
					}
				iconElementRight={
						<div>

						{/*<Badge
							badgeContent={10}
							secondary={true}
							badgeStyle={{top: 5, right: 5}}
							>
						<IconButton tooltip="Notifications">
							<NotificationIcon color="white"/>
						</IconButton>
						</Badge>*/}
						<IconButton onClick = {this.showDropDown}>
							<MoreVertIcon color="white" />
						</IconButton>
						<Popover open={this.state.DropdownOpen} anchorEl={this.state.anchorEl} onRequestClose={this.closeDropdown}>
						<Menu>
							<MenuItem primaryText="logout" onClick={this.logout}/>
						</Menu>
						</Popover>
						</div>
					}
			/>
		);
	}
}

function mapStateToProps(state){
	return {Project: state.Project};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getProject, logout: logout}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);