import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {reduxForm, Field, change} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import ChipInputField from '../../components/ChipInputField';
import getEmployeesData from '../../actions/getEmployeesData';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {readDate} from '../../helpers/date';
import Dropzone from 'react-dropzone';
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  DatePicker
} from 'redux-form-material-ui';

let bottomLeft = {position: 'fixed', right: 20, bottom: 20}

const validate = (formProps) => {
	let errors = {};
	if(!formProps.name)
		errors.name = "Field is empty";
	if(!formProps.vendor)
		errors.vendor = "Field is empty";
	if(!formProps.owner)
		errors.owner = "Field is empty";
	if(formProps.startDate && formProps.endDate){
		let sameDate = readDate(formProps.startDate) == readDate(formProps.endDate);
		let timeAhead = formProps.startDate.getTime() >= formProps.endDate.getTime()
		// if(timeAhead && !sameDate){
		if(timeAhead){
			errors.startDate = "End date must be ahead of start date";
			errors.endDate = "End date must be ahead of start date";
		}
	}else{
		errors.startDate = "Field is Empty";
		errors.endDate = "Field is Empty";
	}
	return errors;
}

class NewProject extends Component{
	constructor(props){
		super(props);
		this.props.getEmployeesData();
		this.state = {image: false};
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.open != this.props.open){
			this.setState({image: false});
		}
	}

	render(){
		return (
			<Dialog
				contentStyle={{width: "90%"}}
				open={this.props.open}
				actions={[<FlatButton label="Save" primary={true} keyboardFocused={true} onTouchTap={this.props.submit} />, <FlatButton label="Cancel" onTouchTap={this.props.close} />]}
				modal={false}
				title="New Project"
				autoScrollBodyContent={true}
				onRequestClose={this.props.close}
			>

			<form onSubmit={this.props.handleSubmit}>

			<div className="uk-grid uk-margin-top">
			<div className="uk-width-1-2">
				<Field fullWidth={true} autoComplete="off" name="name" component={TextField} floatingLabelText="Project Name" />&nbsp;&nbsp;
			</div>
			<div className="uk-width-1-2">
				<Field fullWidth={true} autoComplete="off" className="uk-width-1-2" name="vendor" component={TextField} floatingLabelText="Project Vendor" />
			</div>
			</div>

			<div className="uk-margin-top">
				<Field name="owner" fullWidth={true} component={SelectField} floatingLabelText="Project Owner">
					{
						this.props.Employees.map((employee) => {
							return <MenuItem key={employee.id} value={JSON.stringify({value: employee.id, text: employee.username})} primaryText={employee.username} />
						})
					}
				</Field>
				<Dropzone accept="image/*" onDrop={(files) => {this.setState({image: files[0]}); this.props.change('image', files[0])}}>
					<img src={this.state.image.preview} style={{width: '100%', height: '100%'}} />
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
			</form>

			</Dialog>
		);
	}
}

function mapStateToProps(state){
	return {Employees: state.Employees};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({change, getEmployeesData: getEmployeesData}, dispatch);
}

NewProject = reduxForm({
	form: 'NewProjectForm',
	validate
})(NewProject);

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);