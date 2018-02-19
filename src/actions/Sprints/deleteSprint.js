import fire from '../../api/firebaseAPI';

const deleteSprint = (projectID, sprintID, active, taskNum) => {
	return (dispatch) => {
		fire.ref(`sprints/${projectID}/${sprintID}`).remove();
		if(active){
			fire.ref(`activeSprint/${projectID}`).remove();
			fire.ref(`projects/${projectID}/currentTasks`).set(0);
			fire.ref(`projects/${projectID}/currentCompleteTasks`).set(0);
		}
		fire.ref(`projects/${projectID}/totalTasks`).once('value', (snapshot) => {
			console.log(`${snapshot.val()}-${taskNum}`)
			fire.ref(`projects/${projectID}/totalTasks`).set(snapshot.val()-taskNum);
		});
	}
}

export default deleteSprint;