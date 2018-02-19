import fire from '../../api/firebaseAPI';

const startSprint = (projectID, sprint, AllSprintsKeys, userKey, dates) => {
	return (dispatch) => {
		let todo = {}
		sprint.tasks.map((task) => {
			let key=task.key;
			task.original = `${sprint.key}/tasks/${task.key}`;
			delete task.key;
			todo[key] = task;
		})
		let activeSprint = {todo: todo};
		activeSprint.original = sprint.key;
		activeSprint.startedBy = userKey;
		activeSprint.startDate = dates.startDate;
		activeSprint.endDate = dates.endDate;

		let updatedData = {};
		updatedData[`projects/${projectID}/currentTasks`] = sprint.tasks.length;
		updatedData[`sprints/${projectID}/${sprint.key}/startDate`] = dates.startDate;
		updatedData[`sprints/${projectID}/${sprint.key}/endDate`] = dates.endDate;
		
		AllSprintsKeys.map((key) => {
			let active = key == sprint.key ? true:false;
			updatedData[`sprints/${projectID}/${key}/active`] = active;
			updatedData[`sprints/${projectID}/${key}/startedBy`] = userKey;
		});
		activeSprint.name = sprint.name;
		updatedData[`activeSprint/${projectID}`] = activeSprint;
		fire.ref().update(updatedData).then((snapshot) => {
			dispatch({
				type: "SprintStarted"
			})
		})
	}
}

export default startSprint;