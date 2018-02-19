const updateProfileForm = (values) => {

	return {
		type: "ProfileFormUpdated",
		payload: values
	}
};

export default updateProfileForm;