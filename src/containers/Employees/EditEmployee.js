import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import {readDate} from '../../helpers/date';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
// import {
//   Checkbox,
//   RadioButtonGroup,
//   SelectField,
//   TextField,
//   Toggle,
//   DatePicker
// } from 'redux-form-material-ui';
import TextField from 'material-ui/TextField';

const renderDropzoneInput = (field) => {
	let files = field.input.value;
	if(!Array.isArray(files))
		files = [];
	else
		files = files[0];
	return (
		<Dropzone onDrop={(files, e) => {field.input.onChange(files)}}>
			<img style={{width: '100%', height: '100%'}} src={files.preview?files.preview:field.input.value} />
		</Dropzone>
	);
}


const validate = (formProps) => {
	let errors = {};
	if(!formProps.username)
		errors.username = "Field is empty";
	
	if(!formProps.position)
		errors.position = "Field is empty";
	
	// let emailReg = /^.+@.+\..+$/;

	// if(!emailReg.test(formProps.email))
	// 	errors.email = "Invalid Email";
	
	return errors;
}


class NewEmployee extends Component{
	renderDeprecated(){
		return (
			<Dialog
				title="Edit Employee"
				autoScrollBodyContent={true}
				modal={false}
				actions={[
					<FlatButton label="Ok" keyboardFocused={true} primary={true} onTouchTap={this.props.onRequestSubmit} />,
					<FlatButton label="Cancel" primary={true} onTouchTap={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}>
			<form onSubmit={this.props.handleSubmit}>
			<Field name="username" component={TextField} fullWidth={true} floatingLabelText="Name" />
			<Field name="position" component={TextField} fullWidth={true} floatingLabelText="Position" />
			{/*<Field name="email" component={TextField} fullWidth={true} floatingLabelText="Email" />*/}
			{/*<Field name="image" component={renderDropzoneInput} />*/}
			<img style={{width: "20%", height: '20%'}} src={this.props.initialValues.image} alt="user image"/>
			<button type="submit" style={{display: 'None'}} />
			</form>
			</Dialog>
		);
	}
	render(){
		return (
			<Dialog
				title="Employee"
				modal={false}
				actions={[
					<FlatButton label="Exit" primary={true} onTouchTap={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}>
			<div className="uk-grid">
				<div className="uk-width-1-2">
					<TextField style={{cursor: 'default'}} value={this.props.initialValues.username} floatingLabelText="Name" fullWidth={true} />
					<TextField style={{cursor: 'default'}} value={this.props.initialValues.position} floatingLabelText="Position" fullWidth={true} />
				</div>
				<div className="uk-width-1-2">
					<img src={this.props.initialValues.image} alt="user image"/>
				</div>
			</div>
			</Dialog>
		);
	}
}

// NewEmployee = reduxForm({
// 	form: 'EditEmployeeForm',
// 	enableReinitialize: true,
// 	validate
// })(NewEmployee);

export default NewEmployee;