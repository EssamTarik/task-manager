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

class ProjectEmployeeContainer extends Component{
	constructor(props){
		super(props);
		this.state = {role : ""};
	}
	userAllowedHere(user, people){
		console.log(people);
		let userObj = lodash.find(people, {key: user.key});
		if(user.projects && Object.keys(user.projects).indexOf(this.props.params.id) != -1 && userObj && (userObj == 'leader' || userObj.role == 'owner'))
			return ;
		else if(people.length == 0)
			return ;

		browserHistory.push('/');
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
					<Tab value={7} icon={<ScrumIcon />} label="Scrum Board" containerElement={<Link to={"/projects/employee/"+this.props.params.id} />} />
				</Tabs>
			</MediaQuery>
			<MediaQuery query="(max-width: 700px)">
				<Tabs value={this.props.ActiveTab} tabItemContainerStyle={{width: "100%"}}>
					<Tab value={7} className="uk-width-1-7" icon={<ScrumIcon />} containerElement={<Link to={"/projects/employee/"+this.props.params.id} />} />
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
		// this.userAllowedHere(nextProps.LoggedInUser, nextProps.ProjectPeople);
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEmployeeContainer);