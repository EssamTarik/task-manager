import fire from '../api/firebaseAPI';
import {browserHistory} from 'react-router';

const removeEmployee = (id) => {
	
	console.log('trying to delete Employee');

	return ( (dispatch) => {
		fire.ref('employees/' + id).remove().then( () => {
			console.log('removed employee');
			location.reload();
		});
	} );

}

export default removeEmployee;