import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui';

const validate = (formProps) => {
	let errors = {};
	if(!formProps.email)
		errors.email = "Please enter an email";
	if(!formProps.password)
		errors.password = "Please enter a password";
	return errors;
}

class LoginForm extends Component{
	render(){
		return(
			<form onSubmit={this.props.handleSubmit}>
			<Field name="email" fullWidth={true} floatingLabelText="Email" component={TextField} />
			<Field name="password" type="password" fullWidth={true} floatingLabelText="password" component={TextField} />
			<div style={{textAlign: "right"}}>
				<RaisedButton disabled={this.props.disabled} primary={true} label="Login" type="submit" />
			</div>
			</form>
		);
	}
}

LoginForm = reduxForm({
	form: "LoginForm",
	validate
})(LoginForm);

export default LoginForm;