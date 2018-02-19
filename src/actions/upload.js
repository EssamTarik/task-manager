import {storage} from '../api/firebaseAPI';
import getEmployeesCards from './getEmployeesCards';

const upload = (path, file) => {

	return (dispatch) => {
		console.log('uploading');
		let ref = storage.ref(path);
		ref.put(file).then((result) => {
			alert('uploaded');
			dispatch(getEmployeesCards());
		})
	}
};

export default upload;