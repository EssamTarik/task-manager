import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import {readDate} from '../../helpers/date';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import TextField from 'material-ui/TextField';
import {storage} from '../../api/firebaseAPI';
import uuid from 'uuid/v4';
import RefreshIndicator from 'material-ui/RefreshIndicator';

let initials = "";

const validate = (formProps) => {
	let errors = {};
	if(!formProps.username)
		errors.username = "Field is empty";
	
	if(!formProps.position)
		errors.position = "Field is empty";
	
	let emailReg = /^.+@.+\..+$/;

	if(!emailReg.test(formProps.email))
		errors.email = "Invalid Email";
	
	if(formProps.password && formProps.password.length > 0 && formProps.password.length < 6)
		errors.password = "password must be at least 6 characters long";
	
	if(formProps.password != formProps.confirm)
		errors.confirm = "Password and confirmation must match";
	
	return errors;
}


class EditProfileModal extends Component{
	constructor(props){
		super(props);
		this.state = {working: false, username: "", position: "", email: "", password: "", confirm: "", image: '', errors: {}};
		initials = JSON.stringify(this.state);
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updateConfirm = this.updateConfirm.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}
	uploadImage(imageName, callback){
		this.setState({working: true});
		if(typeof(this.state.image) !== 'string'){
			storage.ref(`images/${imageName}`).put(this.state.image).then(() => {
				callback();
			})			
		}else{
			callback()
		}
	}
	submitForm(event){
		event.preventDefault();
		let errors = validate(this.state);
		let imageName = uuid();
		
		this.setState({errors: errors});
		if(Object.keys(errors) == 0){
			this.uploadImage(imageName, () => {
				let data = {
					username: this.state.username,
					position: this.state.position,
					email: this.state.email,
				};
				if(this.state.password && this.state.password.length > 0)
					data.password = this.state.password;
				if(typeof(this.state.image) !== 'string')
					data.image = imageName

				this.props.onRequestSubmit(data);
				this.setState({working: false});
			})
		}
	}

	componentDidUpdate(){
		//check if the object has undefined
		let keys = Object.keys(this.props.initialValues);
		for(let i=0; i<keys.length; i++){
			if(!this.props.initialValues[keys[i]])
				return ;
		}

		let newState = {
				username: this.props.initialValues.username,
				position: this.props.initialValues.position,
				email: this.props.initialValues.email,
				image: this.props.initialValues.image
			};

		if(initials != JSON.stringify(newState)){
			this.setState(newState);
			initials = JSON.stringify(newState);
		}
	}

	componentWillReceiveProps(nextProps){
		if(this.props.open != nextProps.open)
			this.setState({
				username: this.props.initialValues.username,
				position: this.props.initialValues.position,
				email: this.props.initialValues.email,
				image: this.props.initialValues.image
			});
	}
	updateUsername(event){
		this.setState({username: event.target.value});
	}
	updatePosition(event){
		this.setState({position: event.target.value});
	}
	updateEmail(event){
		this.setState({email: event.target.value});
	}
	updatePassword(event){
		this.setState({password: event.target.value});
	}
	updateConfirm(event){
		this.setState({confirm: event.target.value});
	}
	render(){
		return (
			<Dialog
				title="Edit Profile"
				autoScrollBodyContent={true}
				modal={this.state.working}
				actions={[
					<RefreshIndicator loadingColor="#FF9800" style={{display: this.state.working?"inline-block":'none', position: "relative"}} size={40} left={0} top={0} status='loading' />,
					<FlatButton disabled={this.state.working} label="Save" keyboardFocused={true} primary={true} onTouchTap={this.submitForm} />,
					<FlatButton disabled={this.state.working} label="Cancel" primary={true} onTouchTap={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}>
			<form onSubmit={this.submitForm}>
			
			<TextField onChange={this.updateUsername} value={this.state.username} fullWidth={true} floatingLabelText="Name" errorText={this.state.errors.username} />
			<TextField onChange={this.updatePosition} value={this.state.position} fullWidth={true} floatingLabelText="Position" errorText={this.state.errors.position} />
			<TextField onChange={this.updateEmail} value={this.state.email} fullWidth={true} floatingLabelText="Email" errorText={this.state.errors.email} />
			<TextField onChange={this.updatePassword} type="password" value={this.state.password} fullWidth={true} floatingLabelText="Password" errorText={this.state.errors.password} />
			<TextField onChange={this.updateConfirm} type="password" value={this.state.confirm} fullWidth={true} floatingLabelText="Confirm Password" errorText={this.state.errors.confirm} />
			
			<Dropzone accept="image/*" onDrop={(files) => {this.setState({image: files[0]})}}>
				<img style={{width: '100%', height: '100%'}} src={this.state.image ? (typeof(this.state.image) === 'string' ? this.state.image : this.state.image.preview) : null} />
			</Dropzone>
			<button type="submit" style={{display: 'None'}} />

			</form>
			</Dialog>
		);
	}
}

export default EditProfileModal;