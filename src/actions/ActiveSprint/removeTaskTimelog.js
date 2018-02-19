import fire, {auth} from '../../api/firebaseAPI';

const removeTaskTimelog = (taskPath, key) => {
	return (dispatch) => {
		fire.ref(`taskTimelog/${taskPath}/${key}`).remove();
	}
}

export default removeTaskTimelog;