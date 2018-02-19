import fire from '../../api/firebaseAPI';
import markTasksAsDone from './markTasksAsDone';
import moveTasksToBacklog from './moveTasksToBacklog';

const completeSprint = (projectID, sprint, incompleteTasks = [] , incompleteTasksAction = false) => {
	return (dispatch) => {
		let sprintKey = sprint.key;
		let sprintTasks = sprint.tasks.length;
		fire.ref(`sprints/${projectID}/${sprintKey}`).update({complete: true, active: false});
		fire.ref(`activeSprint/${projectID}`).set({});
		
		fire.ref(`projects/${projectID}/finishedTasks`).once('value', (finishedTasks) => {
			finishedTasks = finishedTasks.val() + sprintTasks;
			fire.ref(`projects/${projectID}/finishedTasks`).set(finishedTasks);
		});
		fire.ref(`projects/${projectID}/currentTasks`).set(0);
		fire.ref(`projects/${projectID}/currentCompleteTasks`).set(0);
		
		switch(incompleteTasksAction){
			case 1:
				markTasksAsDone(`sprints/${projectID}/${sprintKey}/tasks`, incompleteTasks)(dispatch);
				break;
			
			case 2:
				moveTasksToBacklog(`${sprintKey}/tasks`, projectID, incompleteTasks)(dispatch);
				break;
				
			default:
				break;
		}
		
		dispatch({
			type: 'SprintCompleted'
		});
	}
}

export default completeSprint;
