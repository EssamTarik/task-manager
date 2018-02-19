import fire from '../../api/firebaseAPI';

const getAllIncompleteTasks = (projectID) => {
	return (dispatch) => {
		fire.ref(`incompleteTasks/${projectID}`).on('value', (snapshot) => {
			dispatch({
				type: 'AllIncompleteTasksFetched',
				payload: snapshot.val()
			})
		})
	}
}

export default getAllIncompleteTasks;