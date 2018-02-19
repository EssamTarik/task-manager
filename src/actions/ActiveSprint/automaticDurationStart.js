import fire from '../../api/firebaseAPI';

const automaticDurationStart = (projectID, key, callback) => {
	return (dispatch) => {
		fire.ref(`activeSprint/${projectID}/inprogress/${key}`).update({paused: false, lastAutomaticTime: new Date().getTime()});
	}
}

export default automaticDurationStart;