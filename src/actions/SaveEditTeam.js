import fire from '../api/firebaseAPI';
import {browserHistory} from 'react-router';

const SaveTeam = (id, data) => {

	return (dispatch) => {
		fire.ref('teams/' + id).set(data).then(() => {
			console.log('team saved');
			browserHistory.push('/tlist');
			dispatch({type: 'team updated'});
		});
	};

}

export default SaveTeam;