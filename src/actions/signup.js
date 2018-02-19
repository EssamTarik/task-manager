import {auth} from '../api/firebaseAPI';

const signup = (data) => {

	return () => {
		auth.createUserWithEmailAndPassword(data.email, data.password).then(() => {
			console.log('user created');
		});
	}

}

export default signup;