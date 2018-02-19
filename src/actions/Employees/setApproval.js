import fire from '../../api/firebaseAPI';

const setApproval = (employeeKey, status) => {
	return (dispatch) => {
		fire.ref(`employees/${employeeKey}/approved`).set(status)
	};
}

export default setApproval;