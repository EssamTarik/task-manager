import {auth} from '../api/firebaseAPI';
import setCurrentUser from './setCurrentUser';
import { browserHistory } from 'react-router'

const checkAuth = () => {
	console.log('checkAuth');
	return (dispatch) => {
		auth.onAuthStateChanged(function(user) {
		
		  if (user) {
		  		console.log('user logged in');
			  	dispatch(setCurrentUser(user));

		  } else {
		  		console.log('user not logged in');
				browserHistory.push('/login');
			  	dispatch(setCurrentUser(null));
		  
		  }
		
		});

	}
}

export default checkAuth;