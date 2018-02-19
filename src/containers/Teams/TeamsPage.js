import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getTeams from '../../actions/getTeams';
import {bindActionCreators} from 'redux';
import DataTable from '../../components/Teams/TeamsDataTable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {connect} from 'react-redux';

const Cols = [{property: 'name', title: 'Name'}, {property: 'position', title: 'Position'}];
let bottomLeft = {position: 'fixed', right: 20, bottom: 20}

class EmployeesPage extends Component{
	constructor(props){
		super(props);
		this.props.getTeams();
	}

	render(){
		return (
			<MuiThemeProvider>
			<div className="" style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
			<h1>Teams</h1>
			<DataTable data = {this.props.Teams} />
			<FloatingActionButton style={bottomLeft}>
				<ContentAdd />
			</FloatingActionButton>
			</div>
			</MuiThemeProvider>
		);
	}
}

function mapStateToProps(state){
	return {Teams: state.Teams};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getTeams: getTeams}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeesPage);