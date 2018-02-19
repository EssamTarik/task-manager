const updateEmployees = (employees) => {
	console.log(employees);
	return {
		type: "EmployeesUpdated",
		payload: employees
	}
};

export default updateEmployees;