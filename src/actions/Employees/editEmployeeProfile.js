import {auth} from '../../api/firebaseAPI';

const editEmployeeProfile = (email=false, password=false) => {
	return (dispatch) => {
		let user = auth.currentUser;
		if(email)
			user.updateEmail(email);
		if(password)
			user.updatePassword(password);
	}
}

export default editEmployeeProfile;