import React, {Component} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import Progress from 'react-uikit-progress';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import setApproval from '../../../actions/Employees/setApproval';

class UserState extends Component{
	getApproved(){
		if(this.props.row.admin || this.props.row.approved)
			return true;
		else
			return false;
	}
	render(){
		return (
			<SelectField onChange={(event, index, value) => {
				this.props.setApproval(this.props.row.id, value);
			}}
			disabled={this.props.row.admin}
			selectedMenuItemStyle={{color: this.getApproved()?'green':'red'}}
			labelStyle={{color: this.getApproved()?'green':'red'}}
			value={this.getApproved()}>

				<MenuItem style={{color: 'green'}} value={true} primaryText="Active" />
				<MenuItem style={{color: 'red'}} value={false} primaryText="Disabled" />
			</SelectField>
		);
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({setApproval}, dispatch);
}

UserState = connect(null, mapDispatchToProps)(UserState);

export {UserState};