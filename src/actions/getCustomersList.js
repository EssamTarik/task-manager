import fire from '../api/firebaseAPI';
import UpdateCustomersList from './UpdateCustomersList';


const getCustomersList = () => {
	console.log('fetching customers list');
	
	return (dispatch) => {
		fire.ref('customers').on('value', (snapshot) => {
			dispatch(UpdateCustomersList(snapshot));
		});
	}
}

export default getCustomersList;