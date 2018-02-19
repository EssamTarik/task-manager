export default function EmployeesReducer(state=[], action){
	switch(action.type){
		case "EmployeesUpdated":
			return action.payload;			
		default:
			return state;
	}
}