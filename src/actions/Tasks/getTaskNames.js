import fire from '../../api/firebaseAPI';

const getTaskNames = (projectID, sprints) => {
	let taskNames = {};
	return (dispatch) => {
		let sprintKeys = Object.keys(sprints);
		for(let i=0; i<sprintKeys.length; i++){
			let sprintKey = sprintKeys[i];
			let sprint = sprints[sprintKey];
			taskNames[sprintKey] = {};

			Object.keys(sprint).map((taskKey) => {
				let taskNamePath = sprintKey == 'freeTasks' ? `sprints/${projectID}/${sprintKey}/${taskKey}/name`:`sprints/${projectID}/${sprintKey}/tasks/${taskKey}/name`;

				fire.ref(taskNamePath).once('value', (name) => {
					taskNames[sprintKey][taskKey] = name.val();
					dispatch({
						type: "TaskNamesFetched",
						payload: taskNames
					})
				});
			});
		}
	}
}

export default getTaskNames;