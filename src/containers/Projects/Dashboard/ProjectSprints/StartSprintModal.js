import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import InputElement from 'react-input-mask';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {readDate} from '../../../../helpers/date';
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
	
	if(formProps.startDate && formProps.endDate){
		let sameDate = readDate(formProps.startDate) == readDate(formProps.endDate);
		let timeAhead = formProps.startDate.getTime() > formProps.endDate.getTime()
		if(timeAhead && !sameDate){
			errors.startDate = "End date must be ahead of start date";
			errors.endDate = "End date must be ahead of start date";
		}
	}else{
		errors.startDate = "Field is Empty";
		errors.endDate = "Field is Empty";
	}
	return errors;
}


class StartSprintModal extends Component{
	constructor(props){
		super(props);
		this.state = {files: []};
		this.onDrop = this.onDrop.bind(this);
	}
	onDrop(files){
		console.log(files);
		let newState = this.state;
		files.map((file) => {
			newState.files.push(file);
		});
		this.setState(newState);
	}
	render(){
		return (
			<Dialog
				title="Start Sprint"
				autoScrollBodyContent={true}
				modal={false}
				actions={[
					<FlatButton label="Ok" primary={true} onTouchTap={this.props.onRequestSubmit} />,
					<FlatButton label="Cancel" onTouchTap={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}
			>
			<form onSubmit={this.props.handleSubmit}>
				<Field component={DatePicker} fullWidth={true} floatingLabelText="Start Date" name="startDate" />
				<Field component={DatePicker} fullWidth={true} floatingLabelText="End Date" name="endDate" />
				
				<button type="submit" style={{display: 'none'}} />
 			</form>
			</Dialog>
		);
	}
}

StartSprintModal = reduxForm({
	form: 'StartSprintForm',
	enableReinitialize: true,
	validate
})(StartSprintModal);

export default StartSprintModal;