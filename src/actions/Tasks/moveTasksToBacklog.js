import fire from '../../api/firebaseAPI';
import moveTask from './moveTask';

const moveTasksToBacklog = (path, projectID, tasks) => {
	return (dispatch) => {
		tasks.map((task) => {
			moveTask(path, 'freeTasks', task.key, projectID)(dispatch);
		});
	}
}

export default moveTasksToBacklog;
