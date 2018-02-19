import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import InputElement from 'react-input-mask';
import ChipInputField from '../../../components/AddOnlyChipInputField';
import {reduxForm, Field} from 'redux-form';
import getEmployeesData from '../../../actions/getEmployeesData';
import getProject from '../../../actions/Projects/getProject';
import MenuItem from 'material-ui/MenuItem';
import {bindActionCreators} from 'redux';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {connect} from 'react-redux';
import {readDate} from '../../../helpers/date';
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui';

let allFiles = [];

const validate = (formProps) => {
	let errors = {};
	if(!formProps.name)
		errors.name = "Field is empty";
	if(!formProps.vendor)
		errors.vendor = "Field is empty";

	if(!formProps.owner)
		errors.owner = "Field is empty";

	let sameDate = readDate(formProps.startDate) == readDate(formProps.endDate);
	let timeAhead = formProps.startDate.getTime() > formProps.endDate.getTime()
	if(timeAhead && !sameDate){
		errors.startDate = "End date must be ahead of start date";
		errors.endDate = "End date must be ahead of start date";
	}
	return errors;
}

class ProjectSettingsModal extends Component{
	constructor(props){
		super(props);
		this.state = {files: [], image: ''};
		this.onDrop = this.onDrop.bind(this);
		this.excludeWorkingEmployees = this.excludeWorkingEmployees.bind(this);
	}
	excludeWorkingEmployees(employee){
		if(this.props.workingEmployees && Object.keys(this.props.workingEmployees).indexOf(employee.id) == -1)
			return true;
		else if(JSON.stringify({value: employee.id, text: employee.username}) == this.props.initialValues.owner)
			return true;
		else
			return false;
	}
	onDrop(files){
		console.log(files);
		let newState = this.state;
		files.map((file) => {
			newState.files.push(file);
		});
		this.setState(newState);
	}
	componentDidMount(){
		this.props.getEmployeesData();
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.open != this.props.open)
			this.setState({image: ''});
	}
	render(){
		return (
			<Dialog
				title="Project Settings"
				autoScrollBodyContent={true}
				modal={this.props.working}
				actions={[
					<RefreshIndicator loadingColor="#FF9800" style={{display: this.props.working?"inline-block":'none', position: "relative"}} size={40} left={0} top={0} status='loading' />,
					<FlatButton disabled={this.props.working} label="Ok" primary={true} onTouchTap={this.props.onRequestSubmit} />,
					<FlatButton disabled={this.props.working} label="Cancel" onTouchTap={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}

			>
			<form onSubmit={this.props.handleSubmit}>
				<div className="uk-grid uk-margin-top">
				<Field className="uk-width-1-2" name="name" component={TextField} floatingLabelText="Project Name" />&nbsp;&nbsp;
				<Field className="uk-width-1-2" name="vendor" component={TextField} floatingLabelText="Project Vendor" />
			</div>

			<div className="uk-grid uk-margin-top">
				<Field className="uk-width-2-3" name="owner" component={SelectField} floatingLabelText="Project Owner">
					{
						this.props.Employees.filter(this.excludeWorkingEmployees).map((employee) => {
							return <MenuItem key={employee.id} value={JSON.stringify({value: employee.id, text: employee.username})} primaryText={employee.username} />
						})
					}
				</Field>
			</div>
			<div>
				<Dropzone accept="image/*" onDrop={(files) => {this.setState({image: files[0]}); this.props.change('image', files[0])}}>
					<img src={this.state.image && typeof(this.state.image) !== 'string' ?this.state.image.preview:this.props.initialValues.image} style={{width: '100%', height: '100%'}} />
				</Dropzone>
			</div>
			{/*<div className="uk-grid uk-margin-top">
				<div className="uk-width-2-3">
				<Field data={this.props.Employees.map((employee) => {return {text: employee.username, value: employee.id}})} name="viewers" component={ChipInputField} floatingLabelText="Project Viewers" />
				</div>
			</div>*/}

			<div className="uk-grid uk-margin-top">
				<div className="uk-width-1-2">
				<Field name="image" type="hidden" component="input" value={this.state.image} />
				<Field name="startDate" component={DatePicker} floatingLabelText="Start Date" />
				</div>
				<div className="uk-width-1-2">
				<Field name="endDate" component={DatePicker} floatingLabelText="Delivery Date" />
				</div>
			</div>
			<button style={{display: 'None'}} type="submit" />
 			</form>
			</Dialog>
		);
	}
}

function mapStateToProps(state){
	return {Employees: state.Employees};
}
function mapDispatchToProps(dispatch){
	return bindActionCreators({getEmployeesData: getEmployeesData}, dispatch);
}

ProjectSettingsModal = connect(mapStateToProps, mapDispatchToProps)(ProjectSettingsModal);


ProjectSettingsModal = reduxForm({
	form: 'ProjectSettingsForm',
	enableReinitialize: true,
	validate
})(ProjectSettingsModal);

export default ProjectSettingsModal;