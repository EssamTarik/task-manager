const UpdateProfilePage = (employee) => {
	
	employee = employee.val();

	return {
		type: "ProfilePageUpdated",
		payload: employee
	}
};

export default UpdateProfilePage;