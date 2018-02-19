import fire, {auth, storage} from '../../api/firebaseAPI';
import {browserHistory} from 'react-router';

const checkAuth = () => {
	return (dispatch) => {
		auth.onAuthStateChanged((user) => {
			if(user){
				fire.ref('employees').orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
					if(snapshot.val()){
						let key = Object.keys(snapshot.val())[0];
						let user = snapshot.val()[key];
						if(!user.approved && !user.admin)
							auth.signOut();
						user.key = key;
						storage.ref(`images/${user.image}`).getDownloadURL().then((url) => {
							user.imageURL = url;
							dispatch({
								type: "UserLoggedIn",
								payload: user
							});
						}, (url) => {
							user.imageURL = '/static/img/avatar.png';
							dispatch({
								type: "UserLoggedIn",
								payload: user
							});
						});
					}
				});
			}else{
				browserHistory.push('/login');
			}
		})
	}
}

export default checkAuth;