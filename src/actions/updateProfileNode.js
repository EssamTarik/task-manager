import profileUpdated from './profileUpdated';
import fire from '../api/firebaseAPI';
import {browserHistory} from 'react-router';

const updateProfileNode = (id, data) => {

	return (dispatch) => {
		console.log('profile updated');
		console.log(id, data);
		fire.ref('employees/' + id).update(data).then(() => {
			dispatch(profileUpdated());
			browserHistory.push('/elist');
		});
	}
};

export default updateProfileNode;