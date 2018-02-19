import React, {Component} from 'react';
import DataTable from './DataTable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getEmployeesData from '../actions/getEmployeesData';
import "font-awesome/css/font-awesome.min.css";
import "react-select/dist/react-select.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from './SematableTest';
let cols = ['username', 'position', 'email'];

let data = [{id: '1', name: "essam", role: "webdsev"}, {id: '2', name: "essam", role: "webdev"}, {id: '3', name: "essam", role: "webdev"}]
class TestView extends Component{
	constructor(props){
		super(props);
		props.getEmployeesData();
	}

	render(){
		console.log(this.props.Employees);
		return <div className="uk-grid"><div className="uk-width-1-3 uk-push-1-3"><Table data={data} /></div></div>;
	}
}

function mapStateToProps(state){
	return {Employees: state.Employees};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getEmployeesData: getEmployeesData}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestView);