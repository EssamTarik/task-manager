import fire from '../api/firebaseAPI';
import lodash from 'lodash';

const getTasks = () => {
	let tasks = {};

	return (dispatch) => {
		fire.ref('tasks').on('value', (snapshot) => {
			snapshot.forEach((status) => {
				tasks[status.key] = [];
				status.forEach((task) => {
					tasks[status.key].push(task.val());
					tasks[status.key][tasks[status.key].length - 1]['key'] = task.key;
				})
			});

			dispatch({
				type: "TasksFetched",
				payload: tasks
			});
		});

	}
}

export default getTasks;