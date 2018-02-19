const UpdateCustomersList = (snapshot) => {
	let customers = [];
	snapshot.forEach( (customer) => {
		customers.push({value: customer.key, text: customer.val().name});
	});
	console.log('fetched customers');
	return {
		type: 'UpdateCustomersList',
		payload: customers
	}
}

export default UpdateCustomersList;