function EmployeesListReducer(state = [{value: 'defaultreducer', text: 'default'}], action){

	switch(action.type){
		case 'EmployeesListUpdated':
			return action.payload;
		default:
			return state;
	}

}

export default EmployeesListReducer;