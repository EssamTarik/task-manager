import fire from '../../api/firebaseAPI';
import moveTask from '../Tasks/moveTask';

const moveTasksToBacklog = (path, projectID, tasks) => {
	return (dispatch) => {
		tasks.map((task) => {
			let taskKey = task.original.split('/')[2];
			moveTask(path, 'freeTasks', taskKey, projectID)(dispatch);
		});
	}
}

export default moveTasksToBacklog;
