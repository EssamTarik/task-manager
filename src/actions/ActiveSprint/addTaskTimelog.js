import fire, {auth} from '../../api/firebaseAPI';

const addTaskTimelog = (taskPath, data, callback) => {
	return (dispatch) => {
		fire.ref(`taskTimelog/${taskPath}`).push({...data, user: auth.currentUser.email}).then(() => {
			if(callback)
				callback();
		});
	}
}

export default addTaskTimelog;