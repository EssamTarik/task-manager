import fire from '../../api/firebaseAPI';

const addActiveSprintTask = (projectID, taskPath) => {
	console.log(`sprints/${projectID}/${taskPath}`);
	console.log(`activeSprint/${projectID}/todo`);
	return (dispatch) => {
		// fire.ref(`sprints/${projectID}/${taskPath}`).once('value', (snapshot) => {
		// 	fire.ref(`activeSprint/${projectID}/todo`).push(snapshot.val());
		// })
	}
}

export default addActiveSprintTask;