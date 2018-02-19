import fire from '../../api/firebaseAPI';

const getSprintNames = (projectID, sprintKeys) => {
	let sprintNames = {};
	return (dispatch) => {
		sprintKeys.map((key) => {
			if(key == 'freeTasks'){
				sprintNames['freeTasks'] = 'Backlog';
				dispatch({
					type: "SprintNamesFetched",
					payload: sprintNames
				});
			}else{
				fire.ref(`sprints/${projectID}/${key}/name`).once('value', (name) => {
					sprintNames[key] = name.val();
					dispatch({
						type: "SprintNamesFetched",
						payload: sprintNames
					});
				});
			}
		})
	}
}

export default getSprintNames;