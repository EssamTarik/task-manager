import fire from '../../api/firebaseAPI';

const getProject = (id) => {
	return (dispatch) => {
		fire.ref(`projects`).on('value', (snapshot) => {
			dispatch({
				type: "AllProjectFetched",
				payload: snapshot.val()
			});
		})
	}
}

export default getProject;