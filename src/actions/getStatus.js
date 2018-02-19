import UpdateStatus from './UpdateStatus';
import fire from '../api/firebaseAPI';


const getStatus = () => {

	return (dispatch) => {
		console.log('fetching status');
		fire.ref('status').on('value', (snapshot) => {
			console.log('fetched status');
			dispatch(UpdateStatus(snapshot));
		});
	}
};

export default getStatus;