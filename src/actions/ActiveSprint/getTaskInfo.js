import fire from '../../api/firebaseAPI';

const getTaskInfo = (projectID, taskPath, clear) => {
	return (dispatch) => {
		if(clear){
			fire.ref(`sprints/${projectID}/${taskPath}`).off('value')
			dispatch({
				type: 'TaskInfoFetched',
				payload: {}
			});
		}else
			fire.ref(`sprints/${projectID}/${taskPath}`).on('value', (snapshot) => {
				dispatch({
					type: 'TaskInfoFetched',
					payload: snapshot.val()
				})	
			})
	}
}

export default getTaskInfo;