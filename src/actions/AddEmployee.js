import fire from '../api/firebaseAPI';
import {browserHistory} from 'react-router';

const AddEmployee = (data) => {
	return (dispatch) => {
		fire.ref('employees').push(data).then(() => {
			console.log('employee saved');
			browserHistory.push('/elist');
		});
	}
};

export default AddEmployee;