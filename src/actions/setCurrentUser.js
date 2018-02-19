const setCurrentUser = (user) => {
	console.log('setting user');
	console.log(user);
	return {
		type: 'SetCurrentUser',
		payload: user
	}
}

export default setCurrentUser;