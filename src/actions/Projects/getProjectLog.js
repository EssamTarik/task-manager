import fire from '../../api/firebaseAPI';
import lodash from 'lodash';

const getProjectLog = (projectID, callback) => {
	return (dispatch) => {
		let userKeys = [];
		fire.ref(`logs/${projectID}`).limitToLast(200).orderByChild('time').on('value', (snapshot) => {
			let payload = [];
			if(snapshot.val()){
				snapshot.forEach((logEntry) => {
					if(userKeys.indexOf(logEntry.val().userKey) === -1)
						userKeys.push(logEntry.val().userKey);

					payload.push({key: logEntry.key, ...logEntry.val()})
				})
			}

			if(callback)
				callback(userKeys);

			dispatch({
				type: "LogFetched",
				payload: payload
			});
		})
	}
}

export default getProjectLog;