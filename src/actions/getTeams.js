import UpdateTeams from './UpdateTeams';
import fire from '../api/firebaseAPI';


const getTeams = () => {

	return (dispatch) => {
		console.log('fetching teams');
		fire.ref('teams').on('value', (snapshot) => {
			console.log('fetched teams');
			dispatch(UpdateTeams(snapshot));
		});
	}
};

export default getTeams;