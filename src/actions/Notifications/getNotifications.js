import fire from '../../api/firebaseAPI';
import lodash from 'lodash';

const getNotifications = (userKey, text) => {
	return (dispatch) => {
		fire.ref(`notifications/${userKey}/notifications`).limitToLast(100).on('value', (snapshot) => {
			let notifications = lodash.toArray(snapshot.val());
			dispatch({
				type: "UserNotificationsFetched",
				payload: notifications
			});
		});
		fire.ref(`notifications/${userKey}/unread`).set(0);
	}
}

export default getNotifications;