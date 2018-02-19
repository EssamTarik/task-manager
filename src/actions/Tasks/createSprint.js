import fire, {storage} from '../../api/firebaseAPI';

const createTask = (data, projectID, callback=false) => {
	return (dispatch) => {
		fire.ref(`sprints/${projectID}`).push(data).then(callback);
	}
}

export default createTask;