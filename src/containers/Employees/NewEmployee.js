import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import {readDate} from '../../helpers/date';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui';


const renderDropzoneInput = (field) => {
	let files = field.input.value;
	if(!Array.isArray(files))
		files = [];
	else
		files = files[0];
	return (
		<Dropzone onDrop={(files, e) => {field.input.onChange(files)}}>
			<img style={{width: '100%', height: '100%'}} src={files.preview} />
		</Dropzone>
	);
}

let existingEmails = [];

const validate = (formProps) => {
	let errors = {};
	if(!formProps.username)
		errors.username = "Field is empty";
	
	if(!formProps.position)
		errors.position = "Field is empty";
	
	let emailReg = /^.+@.+\..+$/;

	if(!emailReg.test(formProps.email))
		errors.email = "Invalid Email";
//	else if(existingEmails.indexOf(formProps.email) != -1)
//		errors.email = "This email is already taken";
	
	if(!formProps.password)
		errors.password = "Field is empty";
	else if(formProps.password.length < 6)
		errors.password = "Password must be at least 6 charcters long";
	else if(formProps.password != formProps.confirm)
		errors.confirm = "Password and confirmation do not match";
	
	return errors;
}


class NewEmployee extends Component{
	componentDidMount(){
//		existingEmails = this.props.existingEmails;
	}
	componentDidUpdate(){
//		existingEmails = this.props.existingEmails;
	}
	render(){
		return (
			<Dialog
				title="New Employee"
				autoScrollBodyContent={true}
				modal={false}
				actions={[
					<FlatButton label="Ok" keyboardFocused={true} primary={true} onTouchTap={this.props.onRequestSubmit} />,
					<FlatButton label="Cancel" primary={true} onTouchTap={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}>
			<form onSubmit={this.props.handleSubmit}>
			<Field autoComplete="off" name="username" component={TextField} fullWidth={true} floatingLabelText="Name" />
			<Field autoComplete="off" name="position" component={TextField} fullWidth={true} floatingLabelText="Position" />
			<Field autoComplete="off" name="email" component={TextField} fullWidth={true} floatingLabelText="Email" />
			<Field name="password" component={TextField} fullWidth={true} floatingLabelText="Password" type="password" />
			<Field name="confirm" component={TextField} fullWidth={true} floatingLabelText="Confirm Password" type="password" />
			<Field name="image" component={renderDropzoneInput} />
			<button type="submit" style={{display: 'None'}} />

			</form>
			</Dialog>
		);
	}
}

NewEmployee = reduxForm({
	form: 'NewEmployeeForm',
	validate
})(NewEmployee);

export default NewEmployee;
