import React, {Component} from 'react';
import ChipInput from 'material-ui-chip-input';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getEmployeesData from '../../../../actions/getEmployeesData';
import addPeople from '../../../../actions/Employees/addPeople';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class AddEmployee extends Component{
	constructor(props){
		super(props);
		this.state = {role: 1, chips: []};
		this.addPeopleToProject = this.addPeopleToProject.bind(this);
		this.excludeOwnerAndProjectPeople = this.excludeOwnerAndProjectPeople.bind(this);
		this.setRole = this.setRole.bind(this);
	}
	componentDidMount(){
		this.props.getEmployeesData();
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.open != this.props.open)
			this.setState({chips: [], role: 0});
	}
	employeeExists(key){
		let ret = false;
		this.props.Employees.map((employee) => {
			if(employee.id == key)
				ret = true;
		})

		return ret;
	}
	getRole(key){
		let roles =['employee', 'viewer', 'leader'];
		return roles[key];
	}
	setRole(event, index, value){
		this.setState({role: value});
	}
	addPeopleToProject(){
		this.props.addPeople(this.props.projectID, this.state.chips);
		this.props.onRequestClose();
		this.setState({chips: []});
	}
	handleAddChip(chip){
		if(this.employeeExists(chip.id)){
			let newState = this.state;
			let role = this.state.role;
			let chipWithRule = Object.assign({}, chip, {role: role});
			chipWithRule.text = `${chipWithRule.text} - ${this.getRole(role)}`;
			newState.chips.push(chipWithRule);
			this.setState(newState);
		}
	}
	handleDeleteChip(chip, index){
		let newState = this.state;
		newState.chips.splice(index, 1);
		this.setState(newState);
	}
	excludeOwnerAndProjectPeople(employee){
		// console.log(this.props.projectPeople);
		if(this.props.owner && this.props.owner.value != employee.id && this.props.projectPeople && Object.keys(this.props.projectPeople).indexOf(employee.id) == -1)
			return true;
		else
			return false;
	}
	render(){
		return (
			<Dialog
				title="Add Employee"
				autoScrollBodyContent={true}
				modal={false}
				actions={[
					<FlatButton label="Ok" primary={true} onClick={this.addPeopleToProject} keyboardFocused={true} />,
					<FlatButton label="Cancel" onClick={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose} >

				<div className="uk-margin-top">
				<SelectField value={this.state.role} onChange={this.setRole}>
					<MenuItem value={0} primaryText="Employee" />
					<MenuItem value={1} primaryText="Viewer" />
					<MenuItem value={2} primaryText="Leader" />
				</SelectField>
				<ChipInput
					openOnFocus={true}
					floatingLabelText="Employees"
					value={this.state.chips}
					fullWidth={true}
					dataSourceConfig={{text: 'text', value: 'id'}}
					dataSource={this.props.Employees.filter(this.excludeOwnerAndProjectPeople)}
					onRequestAdd={(chip) => this.handleAddChip(chip)}
					onRequestDelete={(chip, index) => this.handleDeleteChip(chip, index)} />			
				</div>

			</Dialog>
		);
	}
}

function mapStateToProps(state){
	let Employees = state.Employees.map((employee) => {return {...employee, text: employee.username} });
	return {Employees: Employees};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({addPeople: addPeople, getEmployeesData: getEmployeesData}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee);