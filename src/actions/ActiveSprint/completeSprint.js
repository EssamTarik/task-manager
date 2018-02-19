import fire from '../../api/firebaseAPI';
import {browserHistory} from 'react-router';
import markTasksAsDone from './markTasksAsDone';
import moveTasksToBacklog from './moveTasksToBacklog';
import moveTasksToNewSprint from './moveTasksToNewSprint';

const completeSprint = (projectID, sprint, incompleteTasks = [] , incompleteTasksAction = false) => {
	return (dispatch) => {
		// console.log(projectID);
		// console.log(sprint);
		// console.log(incompleteTasks);
		// console.log(incompleteTasksAction);
		let sprintKey = sprint.original;
		let sprintTasks = sprint.done.length;
		let sprintFinishedTasksTime = 0;
		
		sprint.done.map((task) => {
			sprintFinishedTasksTime += parseInt(task.time);
		});

		let today = new Date();
		today.setHours(0,0,0,0);

		fire.ref(`sprints/${projectID}/${sprintKey}`).update({complete: true, active: false, completeDate: today.getTime()});
		fire.ref(`activeSprint/${projectID}`).set({});
		
		fire.ref(`projects/${projectID}/finishedTasks`).once('value', (finishedTasks) => {
			finishedTasks = finishedTasks.val() + sprintTasks;
			fire.ref(`projects/${projectID}/finishedTasks`).set(finishedTasks);
		});

		fire.ref(`projects/${projectID}/finishedTasksTime`).once('value', (finishedTasksTime) => {
			finishedTasksTime = finishedTasksTime.val() + sprintFinishedTasksTime;
			fire.ref(`projects/${projectID}/finishedTasksTime`).set(finishedTasksTime);
			fire.ref(`projects/${projectID}/burndownLog`).push({time: new Date().getTime()}).then((snap) => {
				let burndownKey = snap.key;
				fire.ref(`projects/${projectID}/totalTime`).once('value', (totalTime) => {
					fire.ref(`projects/${projectID}/burndownLog/${burndownKey}/finishedHours`).set(totalTime.val() - finishedTasksTime);
				})
			});
		});
		let incompleteTasksObject = {};
		incompleteTasks.forEach((task) => {
			task = Object.assign({}, task);
			let key = task.original.split('/')[task.original.split('/').length-1];
			delete task.key;
			incompleteTasksObject[key] = task;
		})

		fire.ref(`incompleteTasks/${projectID}/${sprintKey}`).set(incompleteTasksObject);

		fire.ref(`projects/${projectID}/currentTasks`).set(0);
		fire.ref(`projects/${projectID}/currentCompleteTasks`).set(0);
		
		switch(incompleteTasksAction){
			case 1:
				moveTasksToNewSprint(`${sprintKey}/tasks`, projectID, incompleteTasks)(dispatch);
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
		browserHistory.push(`/projects/${projectID}/tasks`);
	}
}

export default completeSprint;
