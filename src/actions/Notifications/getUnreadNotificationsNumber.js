import fire from '../../api/firebaseAPI';
import lodash from 'lodash';

const getUnreadNotificationsNumber = (userKey) => {
	return (dispatch) => {
		fire.ref(`notifications/${userKey}/unread`).on('value', (unreadNumber) => {
			let payload = 0;
			if(unreadNumber.val())
				payload = parseInt(unreadNumber.val());

			dispatch({
				type: "UserUnreadNotificationsFetched",
				payload: parseInt(payload)
			});
		});
	}
}

export default getUnreadNotificationsNumber;