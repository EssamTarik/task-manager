const updateEmployeesList = (snapshot) => {
	let employees = [];

	snapshot.forEach( (employee) => {
		employees.push({ value: employee.key, text: employee.val().username });
	});
	
	console.log('fetched employees list');	
	return {
		type: "EmployeesListUpdated",
		payload: employees
	}
};

export default updateEmployeesList;