import fire from '../../api/firebaseAPI';

const getProject = (id) => {
	return (dispatch) => {
		fire.ref(`projects/${id}`).on('value', (snapshot) => {
			dispatch({
				type: "ProjectFetched",
				payload: snapshot.val()
			});
		})
	}
}

export default getProject;