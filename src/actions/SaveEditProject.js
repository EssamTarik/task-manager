import fire from '../api/firebaseAPI';
import {browserHistory} from 'react-router';

const SaveEditProject = (id, data) => {

	return (dispatch) => {
		fire.ref('projects/' + id).set(data).then(() => {
			console.log('project saved');
			browserHistory.push('/plist');
			dispatch({type: 'project updated'});
		});
	};

}

export default SaveEditProject;