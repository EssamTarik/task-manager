import React, {Component} from 'react';
import UsersTable from './UsersTable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getEmployeesData from '../../../actions/getEmployeesData';

class Users extends Component{
	componentDidMount(){
		this.props.getEmployeesData();
	}
	setUserStates(employees){
		return employees.map((person) => {
			if(person.admin || person.approved)
				person.state = 'Active';
			else
				person.state = 'Disabled';

			return person;
		})
	}
	render(){
		return (
			<div className="uk-margin-left uk-margin-right">
				<UsersTable data={this.setUserStates(this.props.Employees).reverse()} />
			</div>
		);
	}
}

function mapStateToProps(state){
	return {Employees: state.Employees};
}

function mapDispatchToProps(dispatch){
	return  bindActionCreators({getEmployeesData}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);