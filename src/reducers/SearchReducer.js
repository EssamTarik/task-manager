export default function EmployeesReducer(state="", action){
	
	switch(action.type){
		case "EmployeesFilteredByName":
			return action.payload;
		default:
			return "";
	}
}