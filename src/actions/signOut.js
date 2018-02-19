import {auth} from '../api/firebaseAPI';

const signOut = () => {
	console.log('signing out');
	return () => {
		auth.signOut().then( () => {
			console.log('signed out');
		});
	}
}

export default signOut;