import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import login from '../../actions/Auth/login';
import LoginForm from './LoginForm';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin'
import {SubmissionError} from 'redux-form';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import NewEmployeeForm from '../Employees/NewEmployee';
import {reset, submit} from 'redux-form';
import uuid from 'uuid/v4';
import createEmployee from '../../actions/Employees/createEmployee';
import resetPassword from '../../actions/Auth/resetPassword';
import {storage} from '../../api/firebaseAPI';

class LoginPage extends Component{
	constructor(props){
		super(props);
		this.state = {signupMessage: "Uploading Image ....", uploading: false, newEmployeeModalOpen: false, errorSnackbarOpen: false, errorMessage: "", loading: 'hidden'};
		this.onSubmit = this.onSubmit.bind(this);
		this.errorCallback = this.errorCallback.bind(this);
		this.closeErrorSnackbar = this.closeErrorSnackbar.bind(this);
		this.onNewEmployeeSubmit = this.onNewEmployeeSubmit.bind(this);
		this.submitNewEmployeeForm = this.submitNewEmployeeForm.bind(this);
		this.openNewEmployeeModal = this.openNewEmployeeModal.bind(this);
		this.closeNewEmployeeModal = this.closeNewEmployeeModal.bind(this);
	}
	errorCallback(error){
		let newState = this.state;
		newState.errorSnackbarOpen = true;
		newState.uploading = false;
		newState.signupMessage = "Uploading Image ....";
		newState.loading = 'hidden';
		newState.errorMessage = error.message;
		this.setState(newState);
	}
	closeErrorSnackbar(){
		let newState = this.state;
		newState.errorSnackbarOpen = false;
		this.setState(newState);
	}
	openNewEmployeeModal(){
		this.setState({newEmployeeModalOpen: true});
	}
	closeNewEmployeeModal(){
		this.setState({newEmployeeModalOpen: false});
	}
	onSubmit(submit){
		let newState = this.state;
		newState.loading = "visible";
		this.setState(newState);
		this.props.login(submit, this.errorCallback);
	}
	submitNewEmployeeForm(){
		this.props.submit("NewEmployeeForm");
	}
	uploadUserImage(image, imageName, callback){
		this.setState({uploading: true});
		storage.ref(`images/${imageName}`).put(image).then(() => {
			this.setState({signupMessage: "Logging In ...."});
			callback();
		});
	}
	onNewEmployeeSubmit(submit){
		submit = Object.assign(submit, {});
		submit.email = submit.email.toLowerCase();
		this.closeNewEmployeeModal();
		this.props.reset('NewEmployeeForm');
		if(submit.image instanceof Array && submit.image.length > 0){
			let imageName = uuid();
			let image = submit.image[0];
			this.uploadUserImage(image, imageName, () => {
				this.props.createEmployee(submit, this.errorCallback, () => {
					this.props.login({email: submit.email, password: submit.password}, this.errorCallback);
				});
			});
			submit.image = imageName;
		}else{
			this.setState({uploading: true, signupMessage: "Logging In ...."});
			this.props.createEmployee(submit, this.errorCallback, () => {
				this.props.login({email: submit.email, password: submit.password}, this.errorCallback);
			});
		}
	}
	render(){
		return (
      		<MuiThemeProvider>
			<div className="uk-grid uk-margin-large-top uk-margin-large-right uk-margin-large-left">
				<div className="uk-width-1-6" />
				<div style={{backgroundColor: "#FAFAFA", padding: 20}} className="uk-border-rounded uk-width-4-6">
				<LoginForm disabled={this.state.uploading} onSubmit={this.onSubmit} />
				<a style={this.state.uploading?{display: "none"}:{}} onClick={this.openNewEmployeeModal}>Register</a>
				<br />
				<a style={this.state.uploading?{display: "none"}:{}} onClick={() => {
					let email = prompt("Please enter your email");
					if(email)
						this.props.resetPassword(email);
				}}>Reset Password</a>
				<center><CircularProgress style={{visibility: this.state.loading}}/></center>
				</div>
			<NewEmployeeForm
				open={this.state.newEmployeeModalOpen}
				onRequestSubmit={this.submitNewEmployeeForm}
				onRequestClose={this.closeNewEmployeeModal}
				onSubmit={this.onNewEmployeeSubmit}
				/>
				
			<Snackbar
				open={this.state.errorSnackbarOpen}
				message={this.state.errorMessage}
				autoHideDuration={4000}
				onRequestClose={this.closeErrorSnackbar} />

			<Snackbar
				open={this.state.uploading}
				message={this.state.signupMessage}
				onRequestClose={this.closeErrorSnackbar} />

			</div>
			</MuiThemeProvider>
		);
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({resetPassword, submit, reset, login: login, createEmployee}, dispatch);
}

export default connect(null, mapDispatchToProps)(LoginPage);
