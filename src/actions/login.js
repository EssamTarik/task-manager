import {auth} from '../api/firebaseAPI';
import { browserHistory } from 'react-router'

const signup = (data) => {

	return () => {
		auth.signInWithEmailAndPassword(data.email, data.password).then(() => {
			console.log('user logged in');
			window.location.href = '/plist';
			// browserHistory.push('/plist');
		});
	}

}

export default signup;