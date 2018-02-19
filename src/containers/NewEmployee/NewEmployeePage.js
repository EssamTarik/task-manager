import React, {Component} from 'react';
import NewEmployeeForm from './NewEmployeeForm';

class NewEmployeePage extends Component{
	onSubmit(submit){
		console.log(submit);
	}
	render(){
		return(
			<NewEmployeeForm onSubmit={this.onSubmit}/>
		);
	}
}

export default NewEmployeePage;