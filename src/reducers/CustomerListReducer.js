const CustomerListReducer = (state = [{text: 'default', value: 'default'}], action) => {
	switch(action.type){
		case "UpdateCustomersList":
			return action.payload;
		default:
			return state;
	}
}

export default CustomerListReducer;