import fire from '../../api/firebaseAPI';

const readSprint = (projectID, sprintID) => {
	return (dispatch) => {
		fire.ref(`sprints/${projectID}/${sprintID}`).on('value', (snapshot) => {
			dispatch({
				type: "SprintFetched",
				payload: snapshot.val()
			});
		})
	}
}

export default readSprint;