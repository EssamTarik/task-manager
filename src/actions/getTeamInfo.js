import fire from '../api/firebaseAPI';
import UpdateTeamInfo from './UpdateTeamInfo';

const getTeamInfo = (id) => {
	
	return (dispatch) => {
		fire.ref('teams/' + id).on('value', (snapshot) => {
			dispatch(UpdateTeamInfo(snapshot.val()));
		});
	};
}

export default getTeamInfo;