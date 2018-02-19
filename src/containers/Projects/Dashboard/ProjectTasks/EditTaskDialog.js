import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import InputElement from 'react-input-mask';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
// import getProjectPeople from '../../../../actions/Employees/getProjectPeople';
import {readDate} from '../../../../helpers/date';
import {connect} from 'react-redux';
import TaskIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import BugIcon from 'material-ui/svg-icons/action/bug-report';
import StoryIcon from 'material-ui/svg-icons/action/receipt';
import HighPriorityIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import LowPriorityIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import MediumPriorityIcon from 'material-ui/svg-icons/navigation/arrow-forward';
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
let dropzoneref = {};
let dropzoneFieldRef = {};

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

class EditTaskDialog extends Component{
	constructor(props){
		super(props);
		this.state = {allFiles: []};
		// this.props.getProjectPeople(this.props.projectID);
		this.renderDropzoneInput = this.renderDropzoneInput.bind(this);
		this.addFile = this.addFile.bind(this);
	}

	// removeAttachment(i, change){
	// 	let newFiles = this.state.allFiles
	// 	newFiles.splice(i, 1);
	// 	this.setState({allFiles: newFiles});
	// 	change({replaceAttachments: true, data: this.state.allFiles})
	// }
	// renderAttachments(files, change){
	// 	if(files.length>0){
	// 		console.log()
	// 		return (
	// 			<ul>
	// 			{
	// 				this.state.allFiles.map((file, i) => {
	// 					return <li onClick={() => {this.removeAttachment(i, change), change}} key={i}>{file.name}</li>;
	// 				})
	// 			}
	// 			</ul>
	// 		);
	// 	}else{
	// 		return <p style={{textAlign: "center"}}>Drop Attachments</p>
	// 	}
	// }
	
	// renderDropzoneInput(field){
	// 	if(field.meta.pristine)
	// 		this.setState({allFiles: []});

	// 	let files = field.input.value;
	// 	if(dontChangeFiles){
	// 		dontChangeFiles = false;
	// 	}else{
	// 		if(!Array.isArray(files)){
	// 			files = [];
	// 			if(field.input.value.replaceAttachments){
	// 				this.setState({allFiles: field.input.value.data});
	// 				files = field.input.value.data;
	// 			}
	// 		}
	// 		else{			
	// 			files.map((file) => {
	// 				let newFiles = this.state.allFiles;
	// 				newFiles.push(file);
	// 				this.setState({allFiles: newFiles});
	// 			})
	// 		}
	// 	}
	// 	return (
	// 		<div>
	// 		<Dropzone disableClick ref={(ref) => {dropzoneref=ref;}} className="uk-scrollable-box" style={{marginTop: 20, width: "100%", height: 200, border: '1px dashed black'}} onDrop={this.addFile}}>
	// 		{
	// 			this.renderAttachments(files, field.input.onChange)
	// 		}
	// 		</Dropzone>
	// 		<button onClick={(() => dropzoneref.open())}>upload</button>
	// 		</div>
	// 	);
	// }
	addFile(files){
		let newFiles = this.state.allFiles;
		files.map((file) => {
			newFiles.push(file);
		})
		this.setState({allFiles: newFiles});
		this.props.dispatch(this.props.change('files', newFiles));
	}
	removeFile(i){
		let newFiles = this.state.allFiles;
		newFiles.splice(i, 1);
		this.setState({allFiles: newFiles});
		this.props.dispatch(this.props.change('files', newFiles));
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.open === true && this.props.open === false){
			this.setState({allFiles: []})
			this.props.change('files', []);
		}
	}
	renderDropzoneInput(){
		return (
			<div>
			<Dropzone disableClick ref={(ref) => {dropzoneref=ref;}} className="uk-scrollable-box" style={{marginTop: 20, width: "100%", height: 200, border: '1px dashed black'}} onDrop={this.addFile}>
			<ul style={{padding: 0}} >
				{
					this.state.allFiles.length == 0 ? <p style={{textAlign: "center"}}>Drop Attachments</p> : this.state.allFiles.map((file, i) => {
						return <li onClick={() => {this.removeFile(i);}} key={`file-${i}`}>{file.name}</li>;
					})
				}
			</ul>
			</Dropzone>
			<div className="uk-margin-small-top" style={{textAlign: "left"}}>
			<RaisedButton primary={true} onTouchTap={(() => dropzoneref.open())} label="upload" />
			</div>
			</div>
		);
	}
	componentDidMount(){
		this.setState({allFiles: []});
	}
	componentDidUpdate(){
		if(this.props.open == false)
			dontChangeFiles = true;
	}
	render(){
		return (
			<Dialog
				title="Edit Task"
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
				<Field multiLine={true} rows={2} autoComplete="off" component={TextField} fullWidth={true} floatingLabelText="Description" name="description" />

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
							if(employee.role != 'viewer' /*&& employee.role != 'owner'*/)
								return <MenuItem key={employee.key} value={JSON.stringify({key: employee.key, name: employee.name})} primaryText={employee.name} />
						})
					}
				</Field>
				</div>
				<div className="uk-width-1-1">
					<Field name="priority" fullWidth={true} component={SelectField} floatingLabelText="Priority">
						<MenuItem leftIcon={<LowPriorityIcon color="#00E676" />} value="3" primaryText="Low" />
						<MenuItem leftIcon={<MediumPriorityIcon color="#FFAB00" />} value="2" primaryText="Medium" />
						<MenuItem leftIcon={<HighPriorityIcon color="#D50000" />} value="1" primaryText="High" />
					</Field>
				</div>
				<div className="uk-width-1-1">
					<Field name="files" component={(field) => {return (<h5 style={{display: "none"}}>files</h5>)}} />
					{this.renderDropzoneInput()}
				</div>
				</div>
				<button type="submit" style={{display: 'none'}} />
 			</form>
			</Dialog>
		);
	}
}

// function mapStateToProps(state){
// 	return {ProjectPeople: state.ProjectPeople};
// }

// function mapDispatchToProps(dispatch){
// 	return bindActionCreators({getProjectPeople: getProjectPeople}, dispatch);
// }

// EditTaskDialog =  connect(mapStateToProps, mapDispatchToProps)(EditTaskDialog);

EditTaskDialog = reduxForm({
	form: 'EditTaskForm',
	enableReinitialize: true,
	validate
})(EditTaskDialog);

export default EditTaskDialog;