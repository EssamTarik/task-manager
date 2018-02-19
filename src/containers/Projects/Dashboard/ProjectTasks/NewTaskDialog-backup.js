import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import InputElement from 'react-input-mask';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import getProjectPeople from '../../../../actions/Employees/getProjectPeople';
import {readDate} from '../../../../helpers/date';
import {connect} from 'react-redux';
import TaskIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import BugIcon from 'material-ui/svg-icons/action/bug-report';
import StoryIcon from 'material-ui/svg-icons/action/receipt';
import HighPriorityIcon from 'material-ui/svg-icons/action/trending-up';
import LowPriorityIcon from 'material-ui/svg-icons/action/trending-down';
import MediumPriorityIcon from 'material-ui/svg-icons/action/trending-flat';
import {bindActionCreators} from 'redux';
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui';

let dontChangeFiles = false;
let allFiles = [];

const validate = (formProps) => {
	let errors = {};
	if(!formProps.name)
		errors.name = "Field is empty";
	let numReg = /^[1-9][0-9]*$/;
	
	if(!numReg.test(formProps.time)){
		errors.time = "Must be a number greater than 0";
	}

	if(!formProps.priority){
		errors.priority = "Field is empty";
	}

	if(!formProps.type){
		errors.type = "Field is empty";
	}

	if(!formProps.owner){
		errors.owner = "Field is empty";
	}

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
//  onClick = {(event) => {removeAttachment(i); change(allFiles);}}
let change = () => {} ;

const removeAttachment = (i) => {
	allFiles.splice(i, 1);
	change({replaceAttachments: true, data: allFiles})
}


const renderAttachments = (files) => {
	if(files.length>0){
		console.log()
		return (
			<ul>
			{
				allFiles.map((file, i) => {
					return <li onClick={() => {removeAttachment(i)}} key={i}>{file.name}</li>;
				})
			}
			</ul>
		);
	}else{
		return <p style={{textAlign: "center"}}>Drop Attachments</p>
	}
}

let dropzoneref = {};

const renderDropzoneInput = (field) => {
	console.log(field);
	change = field.input.onChange;

	if(field.meta.pristine)
		allFiles = [];

	let files = field.input.value;
	if(dontChangeFiles){
		dontChangeFiles = false;
	}else{
		if(!Array.isArray(files)){
			files = [];
			if(field.input.value.replaceAttachments){
				allFiles = field.input.value.data;
				files = allFiles;
			}
		}
		else{			
			files.map((file) => {allFiles.push(file);})
		}
	}
	return (
		<div>
		<Dropzone disableClick ref={(ref) => {dropzoneref=ref;}} className="uk-scrollable-box" style={{marginTop: 20, width: "100%", height: 200, border: '1px dashed black'}} onDrop={(files, e) => {field.input.onChange(files)}}>
		{
			renderAttachments(files)
		}
		</Dropzone>
		<button onClick={(() => dropzoneref.open())}>upload</button>
		</div>
	);
}

class NewTaskDialog extends Component{
	constructor(props){
		super(props);
		this.state = {files: []};
		this.onDrop = this.onDrop.bind(this);
		this.props.getProjectPeople(this.props.projectID);
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
		allFiles = [];
	}
	componentDidUpdate(){
		if(this.props.open == false)
			dontChangeFiles = true;
	}
	render(){
		return (
			<Dialog
				title="New Task"
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
				<Field component={TextField} fullWidth={true} floatingLabelText="Name" name="name" />
				<Field component={TextField} fullWidth={true} floatingLabelText="Time(hr)" name="time" />

				<div className="uk-grid">
				<div className="uk-width-1-2">
				<Field name="type" fullWidth={true} component={SelectField} floatingLabelText="Task Type">
					<MenuItem leftIcon={<TaskIcon />} value="1" primaryText="Task" />
					<MenuItem leftIcon={<BugIcon />} value="2" primaryText="Bug" />
					<MenuItem leftIcon={<StoryIcon />} value="3" primaryText="Story" />
				</Field>
				</div>
				<div className="uk-width-1-2">
				<Field name="owner" fullWidth={true} component={SelectField} floatingLabelText="Owner">
					{
						this.props.ProjectPeople.map((employee) => {
							if(employee.role != 'viewer')
								return <MenuItem key={employee.key} value={JSON.stringify({key: employee.key, name: employee.name})} primaryText={employee.name} />
						})
					}
				</Field>
				</div>
				<div className="uk-width-1-1">
					<Field name="priority" fullWidth={true} component={SelectField} floatingLabelText="Priority">
						<MenuItem leftIcon={<LowPriorityIcon color="#00E676" />} value="3" primaryText="Low" />
						<MenuItem leftIcon={<MediumPriorityIcon color="#FFD600" />} value="2" primaryText="Medium" />
						<MenuItem leftIcon={<HighPriorityIcon color="#D50000" />} value="1" primaryText="High" />
					</Field>
				</div>
				<div className="uk-width-1-1">
					<Field name="files" component={renderDropzoneInput} />
				</div>
				</div>
				<button type="submit" style={{display: 'none'}} />
 			</form>
			</Dialog>
		);
	}
}

function mapStateToProps(state){
	return {ProjectPeople: state.ProjectPeople};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getProjectPeople: getProjectPeople}, dispatch);
}

NewTaskDialog =  connect(mapStateToProps, mapDispatchToProps)(NewTaskDialog);

NewTaskDialog = reduxForm({
	form: 'NewTaskForm',
	validate
})(NewTaskDialog);

export default NewTaskDialog;