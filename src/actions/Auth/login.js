import fire, {auth} from '../../api/firebaseAPI';
import {browserHistory} from 'react-router';

const login = (data, callback) => {
	return (dispatch) => {
		auth.signInWithEmailAndPassword(data.email, data.password).then(() => {
			fire.ref('employees').orderByChild('email').equalTo(data.email.toLowerCase()).once('value', (snapshot) => {
				let userKey = Object.keys(snapshot.val())[0];
				console.log(userKey);
				let user = snapshot.val()[userKey];
				if(user.admin || user.approved){
					window.location.href = '/';
				}else{
					auth.signOut();
					callback({message: 'This user is pending approval'});
				}
			});
		}).catch(callback);
	}
}

export default login;