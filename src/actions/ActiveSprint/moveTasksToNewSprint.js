import fire from '../../api/firebaseAPI';
import moveTask from '../Tasks/moveTask';
import createSprint from '../Tasks/createSprint';
import uuid from 'uuid/v4';

const moveTasksToNewSprint = (path, projectID, tasks) => {
	return (dispatch) => {
		createSprint({name: `new sprint`, active: false, complete: false, startDate: new Date().getTime(), endDate: new Date().getTime()}, projectID, (snapshot) => {
			let newSprintKey = snapshot.key;

			tasks.map((task) => {
				let taskKey = task.original.split('/')[2];
				moveTask(path, `${newSprintKey}/tasks`, taskKey, projectID)(dispatch);
			});

		})(dispatch);
	}
}

export default moveTasksToNewSprint;
