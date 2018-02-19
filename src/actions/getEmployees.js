import UpdateEmployeesList from './UpdateEmployeesList';
import UpdateEmployees from './UpdateEmployeesList';
import fire from '../api/firebaseAPI';

const getEmployees = () => {
	
	return ( (dispatch) => {
		fire.ref('employees').on('value', (snapshot) => {
			dispatch(UpdateEmployeesList(snapshot));
		});
	} );

}

export default getEmployees;