import React, {Component} from 'react';
import MediaQuery from 'react-responsive';
import {Tabs, Tab} from 'material-ui/Tabs';
import lodash from 'lodash';
import {Link, browserHistory} from 'react-router';
import HomeIcon from 'material-ui/svg-icons/action/home';
import WorkIcon from 'material-ui/svg-icons/action/work';
import ReportIcon from 'material-ui/svg-icons/editor/wrap-text';
import UserIcon from 'material-ui/svg-icons/action/account-box';
import DocumentIcon from 'material-ui/svg-icons/file/attachment';
import IssueIcon from 'material-ui/svg-icons/action/bug-report';
import ScrumIcon from 'material-ui/svg-icons/av/equalizer';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getProjectPeople from '../../../actions/Employees/getProjectPeople';

class ProjectContainer extends Component{
	constructor(props){
		super(props);
		this.state = {role : ""};
	}
	userAllowedHere(user, people){
		// console.log(people);
		let userObj = lodash.find(people, {key: user.key});
		// console.log(userObj);
		// console.log(Object.keys(user.projects));
		//user.projects && Object.keys(user.projects).indexOf(this.props.params.id) != -1 && 
		if(userObj && (userObj.role == 'leader' || userObj.role == 'owner'))
			return ;
		else if(people.length == 0 || !userObj)
			return ;
		else if(userObj && userObj.role == 'employee'){
			browserHistory.push(`/projects/employee/${this.props.params.id}`);
		}
		else if(userObj && userObj.role == 'viewer'){
			browserHistory.push(`/projects/viewer/${this.props.params.id}`);
		}
		else{
			console.log('kick');
			browserHistory.push('/');
		}
	}
	componentDidMount(){
		this.props.getProjectPeople(this.props.params.id);
		// if(this.props.LoggedInUser.key)
			// this.userAllowedHere(this.props.LoggedInUser);
	}
	getTabs(){
		return (
			<div>
			<MediaQuery query="(min-width: 701px)">
				<Tabs value={this.props.ActiveTab}>
					<Tab value={1} icon={<HomeIcon />} label="Dashboard" containerElement={<Link to={"/projects/"+this.props.params.id} />}/>
					<Tab value={2} icon={<WorkIcon />} label="Backlog" containerElement={<Link to={"/projects/"+this.props.params.id+"/tasks"} />} />
					<Tab value={3} icon={<ReportIcon />} label="Reports" containerElement={<Link to={"/projects/"+this.props.params.id+"/reports"} />} />
					{/*<Tab value={4} icon={<UserIcon />} label="Users" containerElement={<Link to={"/projects/"+this.props.params.id+"/users"} />} />*/}
					<Tab value={5} icon={<DocumentIcon />} label="Documents" containerElement={<Link to={"/projects/"+this.props.params.id+"/documents"} />} />
					<Tab value={6} icon={<IssueIcon />} label="Issues" containerElement={<Link to={"/projects/"+this.props.params.id+"/issues"} />} />
					<Tab value={7} icon={<ScrumIcon />} label="Scrum Board" containerElement={<Link to={"/projects/"+this.props.params.id+"/scrum"} />} />
				</Tabs>
			</MediaQuery>
			<MediaQuery query="(max-width: 700px)">
				<Tabs value={this.props.ActiveTab} tabItemContainerStyle={{width: "100%"}}>
					<Tab value={1} className="uk-width-1-7" icon={<HomeIcon />} containerElement={<Link to={"/projects/"+this.props.params.id} />}/>
					<Tab value={2} className="uk-width-1-7" icon={<WorkIcon />} containerElement={<Link to={"/projects/"+this.props.params.id+"/tasks"} />} />
					<Tab value={3} className="uk-width-1-7" icon={<ReportIcon />} containerElement={<Link to={"/projects/"+this.props.params.id+"/reports"} />} />
					{/*<Tab value={4} className="uk-width-1-7" icon={<UserIcon />} containerElement={<Link to={"/projects/"+this.props.params.id+"/users"} />} />*/}
					<Tab value={5} className="uk-width-1-7" icon={<DocumentIcon />} containerElement={<Link to={"/projects/"+this.props.params.id+"/documents"} />} />
					<Tab value={6} className="uk-width-1-7" icon={<IssueIcon />} containerElement={<Link to={"/projects/"+this.props.params.id+"/issues"} />} />
					<Tab value={7} className="uk-width-1-7" icon={<ScrumIcon />} containerElement={<Link to={"/projects/"+this.props.params.id+"/scrum"} />} />
				</Tabs>
			</MediaQuery>
			<div className="uk-margin-small-right uk-margin-small-left">
			{this.props.children}
			</div>
			</div>
		);
	}
	availableTabs(userKey){
		let user = lodash.find(this.props.ProjectPeople, {key: userKey});
		this.setState({role: user.role});
	}
	componentWillReceiveProps(nextProps){
		this.userAllowedHere(nextProps.LoggedInUser, nextProps.ProjectPeople);
	}
	render(){
		return this.getTabs();
	}
}

function mapStateToProps(state){
	return {ProjectPeople: state.ProjectPeople, ActiveTab: state.ProjectActiveTab, LoggedInUser: state.LoggedInUser};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getProjectPeople: getProjectPeople}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);