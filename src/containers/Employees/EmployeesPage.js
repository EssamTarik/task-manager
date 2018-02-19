import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getEmployeesData from '../../actions/getEmployeesData';
import getCardsImages from '../../actions/getCardsImages';
import createEmployee from '../../actions/Employees/createEmployee';
import editEmployee from '../../actions/Employees/editEmployee';
import {bindActionCreators} from 'redux';
import DataTable from '../../components/Employees/EmployeesDataTable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import NewEmployee from './NewEmployee';
import EditEmployee from './EditEmployee';
import Snackbar from 'material-ui/Snackbar';
import uuid from 'uuid/v4';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import {storage} from '../../api/firebaseAPI';

const Cols = [{property: 'name', title: 'Name'}, {property: 'position', title: 'Position'}];
let bottomLeft = {position: 'fixed', right: 20, bottom: 20}

class EmployeesPage extends Component{
	constructor(props){
		super(props);
		this.props.getEmployeesData();
		this.employee = {};
		this.openNewEmployeeModal = this.openNewEmployeeModal.bind(this);
		this.closeNewEmployeeModal = this.closeNewEmployeeModal.bind(this);
		this.NewEmployeeFormRef = this.NewEmployeeFormRef.bind(this);
		this.onNewEmployeeSubmit = this.onNewEmployeeSubmit.bind(this);
		this.submitNewEmployeeForm = this.submitNewEmployeeForm.bind(this);
		this.uploadUserImage = this.uploadUserImage.bind(this);
		this.openEditEmployeeModal = this.openEditEmployeeModal.bind(this);
		this.closeEditEmployeeModal = this.closeEditEmployeeModal.bind(this);
		this.EditEmployeeFormRef = this.EditEmployeeFormRef.bind(this);
		this.onEditEmployeeSubmit = this.onEditEmployeeSubmit.bind(this);
		this.submitEditEmployeeForm = this.submitEditEmployeeForm.bind(this);
		this.openUploadToast = this.openUploadToast.bind(this);
		this.closeUploadToast = this.closeUploadToast.bind(this);
		this.toastStyle = {};
		this.uploadToastMessage = "";
		this.state = {NewEmployeeModalOpen: false, EditEmployeeModalOpen: false, uploadToastOpen: false};
	}
	closeUploadToast(){
		let newState = this.state;
		newState.uploadToastOpen = false;
		this.setState(newState);
	}
	openUploadToast(){
		let newState = this.state;
		newState.uploadToastOpen = true;
		this.setState(newState);
	}
	openNewEmployeeModal(){
		let newState = this.state;
		newState.NewEmployeeModalOpen = true;
		this.setState(newState);
	}
	closeNewEmployeeModal(){
		let newState = this.state;
		newState.NewEmployeeModalOpen = false;
		this.setState(newState);
	}
	NewEmployeeFormRef(form){
		this.NewEmployeeForm = form;
	}

	openEditEmployeeModal(employee){
		// console.log(employee);
		this.employee = employee;
		let newState = this.state;
		newState.EditEmployeeModalOpen = true;
		this.setState(newState);
	}
	closeEditEmployeeModal(){
		let newState = this.state;
		// this.EditEmployeeForm.reset();
		newState.EditEmployeeModalOpen = false;
		this.setState(newState);
	}
	EditEmployeeFormRef(form){
		this.EditEmployeeForm = form;
	}

	uploadUserImage(image, imageName){
		let getEmployeesData = this.props.getEmployeesData;
		this.uploadToastMessage = "Your image is being uploaded";
		this.openUploadToast();
		this.toastStyle = {};
		storage.ref(`images/${imageName}`).put(image).then((snapshot) => {
			this.uploadToastMessage = "Your image was Successfully uploaded";
			this.openUploadToast();
			this.toastStyle = {backgroundColor: "#009688"}
			getEmployeesData();
		});
	}
	onNewEmployeeSubmit(submit){
		submit.email = submit.email.toLowerCase();
		this.closeNewEmployeeModal();
		this.props.reset('NewEmployeeForm');
		if(submit.image instanceof Array && submit.image.length > 0){
			let imageName = uuid();
			let image = submit.image[0];
			this.uploadUserImage(image, imageName);
			submit.image = imageName;
		}
		this.props.createEmployee(submit);
	}

	submitNewEmployeeForm(){
		this.NewEmployeeForm.submit();
	}

	onEditEmployeeSubmit(submit){
		let data = JSON.parse(JSON.stringify(submit));

		this.closeEditEmployeeModal();
		this.props.reset('EditEmployeeForm');
		let id = this.employee.id;
		let projects = this.employee.projects;
		if(!projects)
			projects = [];
		if(typeof(submit.image) == 'string' || submit.image instanceof String){
			delete data.image;
		}else if(typeof(submit.image) == 'array' || submit.image instanceof Array){
			let imageName = uuid();
			let image = submit.image[0];
			this.uploadUserImage(image, imageName);
			data.image = imageName;
		}
		this.props.editEmployee(data, id, projects);
	}

	submitEditEmployeeForm(){
		this.EditEmployeeForm.submit();
	}
	render(){
		return (
			<MuiThemeProvider>
			<div className="" style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>
			<h2 className="uk-h2">Employees</h2>
			<DataTable focused={this.state.EditEmployeeModalOpen == false && this.state.NewEmployeeModalOpen == false} openModal={this.openEditEmployeeModal} data = {this.props.Employees} images={this.props.Images} />
			{/*<FloatingActionButton onClick={this.openNewEmployeeModal} style={bottomLeft}>
				<ContentAdd />
			</FloatingActionButton>
			
			<NewEmployee 
				ref={this.NewEmployeeFormRef}
				open={this.state.NewEmployeeModalOpen}
				existingEmails = {this.props.Employees.map((employee) => {return employee.email})}
				onSubmit={this.onNewEmployeeSubmit}
				onRequestSubmit={this.submitNewEmployeeForm}
				onRequestClose={this.closeNewEmployeeModal} />*/}

			<EditEmployee 
				ref={this.EditEmployeeFormRef}
				initialValues={
					{
						username: this.employee.username,
						position: this.employee.position,
						email: this.employee.email,
						image: this.props.Images[this.employee.id]
					}
				}
				open={this.state.EditEmployeeModalOpen}
				onSubmit={this.onEditEmployeeSubmit}
				onRequestSubmit={this.submitEditEmployeeForm}
				onRequestClose={this.closeEditEmployeeModal} />			
			
			<Snackbar
				open={this.state.uploadToastOpen}
				message={this.uploadToastMessage}
				autoHideDuration={2000}
				bodyStyle={this.toastStyle}
				onRequestClose={this.closeUploadToast} />

			</div>
			</MuiThemeProvider>
		);
	}
}

function mapStateToProps(state){
	let images = {};
	try{
		images = JSON.parse(state.CardImages);
	}catch(e){}

	return {Employees: state.Employees, Images: images};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({editEmployee: editEmployee, createEmployee: createEmployee, reset: reset, getEmployeesData: getEmployeesData, getImages: getCardsImages}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeesPage);
