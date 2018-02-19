import UpdateEmployees from './updateEmployees';
import getCardsImages from './getCardsImages';
import fire from '../api/firebaseAPI';

const getEmployeesCards = () => {
	return ( (dispatch) => {
		fire.ref('employees').on('value', (snapshot) => {
			dispatch(UpdateEmployees(snapshot));
			dispatch(getCardsImages(snapshot));
		});
	} );

}

export default getEmployeesCards;