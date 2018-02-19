import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import "font-awesome/css/font-awesome.min.css";
import "react-select/dist/react-select.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from './ProjectsTable';
import getAllProjects from '../../actions/Projects/getAllProjects';
import moment from 'moment';
import {readDate} from '../../helpers/date';

class ProjectsPage extends Component{
	constructor(props){
		super(props);
		this.state = {modalOpen: false};
		this.props.getAllProjects();
		this.getProjectsArray = this.getProjectsArray.bind(this);
	}

	getRole(project, key){
		if(project.owner && key == project.owner.value)
			return "owner";
		else if(this.searchViewers(project, key))
			return "viewer";
		else if(this.searchLeaders(project, key))
			return "leader";
		else
			return 'employee';
	}
	searchViewers(project, key){
		if(project.viewers){
			let viewers = Object.keys(project.viewers);
			if(viewers.indexOf(key) != -1)
				return true;
		}
		return false;
	}
	searchLeaders(project, key){
		if(project.leaders){
			let leaders = Object.keys(project.leaders);
			if(leaders.indexOf(key) != -1)
				return true;
		}
		return false;
	}
	getProjectsArray(){
		if(this.props.AllProjects){
			let arr = [];
			let keys = Object.keys(this.props.AllProjects);
			for(let i=0; i<keys.length; i++){
				
				let people = this.props.AllProjects[keys[i]].people;
				// console.log(Object.keys(people));
				// console.log(this.props.LoggedInUser.key);
				// console.log(Object.keys(people).indexOf(this.props.LoggedInUser.key));
				if(Object.keys(people).indexOf(this.props.LoggedInUser.key) == -1)
					continue;

				arr.push({
					id: i+1,
					key: keys[i],
					...this.props.AllProjects[keys[i]]
				});
				let lastObj = arr[arr.length-1];
				lastObj.role = this.getRole(lastObj, this.props.LoggedInUser.key);
				let startDate = new Date(lastObj.startDate);
				startDate.setHours(0,0,0,0);

				let endDate = new Date(lastObj.endDate);
				endDate.setHours(0,0,0,0);
				if(lastObj.owner)
					lastObj.owner = lastObj.owner.text
				lastObj.startDate = readDate(startDate);
				lastObj.endDate = readDate(endDate);
				let today = new Date();
				today.setHours(0,0,0,0);
				lastObj.remainingDays = moment.duration(endDate.getTime() - today.getTime()).asDays();
				lastObj.remainingDays = Math.round(lastObj.remainingDays);
			}
			return arr;
		}else{
			return [];
		}
	}
	render(){
		return( 
			<div style={{marginLeft: "20px", marginRight: "20px"}}>
	    		<Table disabled={this.props.disabled} data={this.getProjectsArray()} />
	    	</div>
    	);
	}
}

function mapStateToProps(state){
	return {AllProjects: state.AllProjects, LoggedInUser: state.LoggedInUser};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getAllProjects: getAllProjects}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);