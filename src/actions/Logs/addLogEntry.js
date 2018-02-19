import fire from '../../api/firebaseAPI';

const addLogEntry = (userKey, text, projectID, item) => {
	return (dispatch) => {
		let additionalAttrs = {};
		if(item)
			Object.assign(additionalAttrs, {type: item.type, name: item.name});
		fire.ref(`logs/${projectID}`).push({userKey: userKey, text: text, time: new Date().getTime(), ...additionalAttrs});
	}
}

export default addLogEntry;