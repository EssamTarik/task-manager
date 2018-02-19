import {auth} from '../../api/firebaseAPI';

const logout = () => {
	return (dispatch) => {
		auth.signOut();
	}
}

export default logout;