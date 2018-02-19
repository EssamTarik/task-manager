import fire from '../api/firebaseAPI';
import {browserHistory} from 'react-router';

const SaveTeam = (team) => {

	return (dispatch) => {
		fire.ref('teams').push(team).then(() => {
			console.log('team saved');
			browserHistory.push('/tlist');
			dispatch({type: 'team saved'});
		});
	}

}

export default SaveTeam;