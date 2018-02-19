import fire, {auth} from '../../api/firebaseAPI';
import addNotification from '../Notifications/addNotification';

const createEmployee = (data, errorCallback, callback) => {
	let dataCopy = JSON.parse(JSON.stringify(data));
	return (dispatch) => {

		auth.createUserWithEmailAndPassword(dataCopy.email, dataCopy.password).then(() => {
			delete dataCopy.confirm;
			delete dataCopy.password;
			
			fire.ref('employees').orderByChild('admin').equalTo(true).once('value', (snapshot) => {
				snapshot.forEach((admin) => {
					addNotification(admin.key, `user ${dataCopy.username} is pending approval`, `/admin/users`)(dispatch);
				})
			})

			fire.ref('employees').push(dataCopy).then(callback)
		}).catch((error) => {
			errorCallback(error);
		});
	}
}

export default createEmployee;
