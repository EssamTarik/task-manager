const updateEmployees = (employees) => {
	let cards = [];
	employees.forEach( (employee) => {
		cards.push(employee.val());
		cards[cards.length-1]['id'] = employee.key;
	});
	
	return {
		type: "EmployeesUpdated",
		payload: cards,
	}
};

export default updateEmployees;