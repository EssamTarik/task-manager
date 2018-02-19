import React, {Component} from 'react';
import EmployeesPage from '../../Employees/EmployeesPage';
import navigateProject from '../../../actions/Routing/navigateProject';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class ProjectUsers extends Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		this.props.navigateProject(4);
	}
	render(){
		return(
			<EmployeesPage />
		);
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({navigateProject: navigateProject}, dispatch);
}

export default connect(null, mapDispatchToProps)(ProjectUsers);