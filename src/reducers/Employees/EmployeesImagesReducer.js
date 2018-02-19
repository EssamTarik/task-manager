const EmployeesImagesReducer = (state={}, action) => {
	switch(action.type){
		case "EmployeesImagesFetched":
			return action.payload;
		default:
			return state;
	}
}

export default EmployeesImagesReducer;