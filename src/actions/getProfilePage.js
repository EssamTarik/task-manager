import UpdateProfilePage from './UpdateProfilePage';
import fire from '../api/firebaseAPI';


const getProfilePage = (id) => {

	return (dispatch) => {
		fire.ref('employees/' + id).once('value').then((snapshot) => {
			console.log('fetched');
			dispatch(UpdateProfilePage(snapshot));
		});
	}
};

export default getProfilePage;