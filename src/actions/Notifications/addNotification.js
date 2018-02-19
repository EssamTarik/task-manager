import fire from '../../api/firebaseAPI';

const addNotification = (userKey, text, url) => {
	return (dispatch) => {
		fire.ref(`notifications/${userKey}/notifications`).push({url: url, userKey: userKey, text: text, time: new Date().getTime()});
		fire.ref(`notifications/${userKey}/unread`).once('value', (unreadNumber) => {
			let unreadVal = 0;
			if(unreadNumber.val())
				unreadVal = unreadNumber.val();
			fire.ref(`notifications/${userKey}/unread`).set(parseInt(unreadVal)+1);
		});
	}
}

export default addNotification;