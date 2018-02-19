import {auth} from '../../api/firebaseAPI';

const resetPassword = (email) => {
	return (dispatch) => {
		auth.sendPasswordResetEmail(email);
	}
}

export default resetPassword;