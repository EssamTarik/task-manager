import fire from '../../api/firebaseAPI';
import {browserHistory} from 'react-router';

const removeProject = (projectID, people) => {
	return (dispatch) => {
		fire.ref(`projects/${projectID}`).remove();
		Object.keys(people).forEach((key) => {
			fire.ref(`employees/${key}/projects/${projectID}`).remove();
		});
		browserHistory.push('/');
	}
}

export default removeProject;