import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import InputElement from 'react-input-mask';
import ChipInputField from '../../../components/ChipInputField';
import {reduxForm, Field} from 'redux-form';
import getEmployeesData from '../../../actions/getEmployeesData';
import getProject from '../../../actions/Projects/getProject';
import MenuItem from 'material-ui/MenuItem';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui';

let allFiles = [];

const getInitialValues = (project) => {
		let initialValues = {};

		if(project.name)
			initialValues['name'] = project.name;

		if(project.lead){
			let lead = project.lead;
			initialValues['lead'] = JSON.stringify({value: lead.value, text: project.people[lead.value].name});
		}
		
		if(project.viewers)
			initialValues['viewers'] = project.viewers;

		if(project.vendor)
			initialValues['vendor'] = project.vendor;

		if(project.startDate)
			initialValues['startDate'] = new Date(project.startDate);
		else
			initialValues['startDate'] = new Date();

		if(project.endDate)
			initialValues['endDate'] = new Date(project.endDate);
		else
			initialValues['endDate'] = new Date();


		return initialValues;
		
	}

class ProjectSettingsForm extends Component{
	constructor(props){
		super(props);
		this.state = {files: []};
	}
	componentDidMount(){
		this.props.getEmployeesData();
		this.props.getProject(this.props.params.id);
	}
	render(){
		return (
			<form onSubmit={this.props.handleSubmit}>
				<div className="uk-grid uk-margin-top">
				<Field className="uk-width-1-2" name="name" component={TextField} hintText="Project Name" />&nbsp;&nbsp;
				<Field className="uk-width-1-2" name="vendor" component={TextField} hintText="Project Vendor" />
			</div>

			<div className="uk-grid uk-margin-top">
				<Field className="uk-width-2-3" name="lead" component={SelectField} hintText="Project Lead">
					{
						this.props.Employees.map((employee) => {
							return <MenuItem key={employee.id} value={JSON.stringify({value: employee.id, text: employee.username})} primaryText={employee.username} />
						})
					}
				</Field>
			</div>
			<div className="uk-grid uk-margin-top">
				<div className="uk-width-2-3">
				<Field data={this.props.Employees.map((employee) => {return {text: employee.username, value: employee.id}})} name="viewers" component={ChipInputField} hintText="Project Viewers" />
				</div>
			</div>

			<div className="uk-grid uk-margin-top">
				<div className="uk-width-1-2">
				<Field name="startDate" component={DatePicker} hintText="Start Date" />
				</div>
				<div className="uk-width-1-2">
				<Field name="endDate" component={DatePicker} hintText="Delivery Date" />
				</div>
			</div>
			<button style={{display: 'None'}} type="submit" />
 			</form>
		);
	}
}

function mapStateToProps(state){
	return {Employees: state.Employees, Project: state.Project};
}
function mapDispatchToProps(dispatch){
	return bindActionCreators({getProject: getProject, getEmployeesData: getEmployeesData}, dispatch);
}


ProjectSettingsForm = reduxForm({
	form: 'ProjectSettingsForm2',
	enableReinitialize: true
})(ProjectSettingsForm);

ProjectSettingsForm = connect(mapStateToProps, mapDispatchToProps)(ProjectSettingsForm);

export default ProjectSettingsForm;