import fire from '../../api/firebaseAPI';

const removePerson = (projectID, personID, removeFrom) => {
	return (dispatch) => {
		fire.ref(`projects/${projectID}/people/${personID}`).remove();
		if(removeFrom)
			fire.ref(`projects/${projectID}/${removeFrom}/${personID}`).remove();
	}
}

export default removePerson;