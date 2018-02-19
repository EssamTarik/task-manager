import React, {Component} from 'react';
import MenuItem from 'material-ui/MenuItem';
import {getSprintName} from '../../../../helpers/firebaseHelper';

class SprintMenuItem extends Component{
	constructor(props){
		super(props);
		this.state = {sprintName: ""};
		this.setSprintName = this.setSprintName.bind(this);
	}
	setSprintName(name){
		this.setState({sprintName: name});
	}
	componentDidMount(){
		let sprintID = this.props.value;
		if(sprintID == "freeTasks"){
			this.setSprintName("Free Tasks");
		}else{
			sprintID = sprintID.substring(0, sprintID.length-6);
			getSprintName(this.props.projectID, sprintID, this.setSprintName);
		}
	}
	render(){
		return (
			<MenuItem primaryText={this.state.sprintName} value={this.props.value} />
		);
	}
}

export default SprintMenuItem;