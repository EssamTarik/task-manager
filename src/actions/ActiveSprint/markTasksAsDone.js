import fire from '../../api/firebaseAPI';

const markTasksAsDone = (path, tasks) => {
	return (dispatch) => {
		let updatedData = {};
		
		tasks.map((task) => {
			updatedData[`${path}/${task.original}/status`] = 'Complete';
			updatedData[`${path}/${task.original}/endDate`] = new Date().getTime();
		});
		// console.log(updatedData);
		fire.ref().update(updatedData);
	}
}

export default markTasksAsDone;
