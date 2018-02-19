import fire from '../../api/firebaseAPI';

const markTasksAsDone = (path, tasks) => {
	return (dispatch) => {
		let updatedData = {};
		
		tasks.map((task) => {
			updatedData[`${path}/${task.key}/status`] = 'Complete';
			updatedData[`${path}/${task.key}/endDate`] = new Date().getTime();
		});
		fire.ref().update(updatedData);
	}
}

export default markTasksAsDone;
