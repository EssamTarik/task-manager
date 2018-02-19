import fire, {storage} from '../../api/firebaseAPI';
import uuid from 'uuid/v4';
import lodash from 'lodash';
import getActiveSprint from '../ActiveSprint/getActiveSprint';

const editTask = (data, projectID, taskPath, task, sprintActive) => {
	return (dispatch) => {
		let files = data.files;
		delete data.files;
		let attachmentKey = uuid();
		data = JSON.parse(JSON.stringify(data));

		if(files)
			data.attachmentKey = attachmentKey;

		fire.ref(`projects/${projectID}/totalTime`).once('value', (snapshot) => {
			let newTotalTime = (parseInt(snapshot.val()) - parseInt(task.time)) + parseInt(data.time);
			fire.ref(`projects/${projectID}/totalTime`).set(newTotalTime);
		})

		if(files && files.length > 0){
			let taskKey = taskPath.split('/')[taskPath.split('/').length-1];
			fire.ref(`attachments/${projectID}/`).orderByChild('taskID').equalTo(taskKey).once('value', (attachmentSnapshot) => {
				

				let sprintID = taskPath.split('/')[0] + '/tasks';
				let attachments = files.map((file) => {return file.name});
				if(attachmentSnapshot.val()){
					attachmentKey = Object.keys(attachmentSnapshot.val())[0];
					attachments = attachments.concat(attachmentSnapshot.val()[attachmentKey].files);
				}
				
				fire.ref(`attachments/${projectID}/${attachmentKey}`).set({
					sprintID: sprintID, taskID: taskKey, files: attachments
				});
				
				files.map((file) => {
					storage.ref(`sprints/${attachmentKey}/${file.name}`).put(file).then((response) => {
						// alert('uploaded');
					});
				})
			})
		}

		if(sprintActive){
			let FoundTaskKey = false;
			let taskKey = taskPath.split('/')[2];
			fire.ref(`activeSprint/${projectID}`).once('value', (activeSprintSnapshot) => {
				let pipelines = ['todo', 'inprogress', 'done'];
				for(let j=0; j<pipelines.length; j++){
					let tasks = activeSprintSnapshot.val()[pipelines[j]];
					if(tasks){
						let keys = Object.keys(tasks);
						for(let i=0; i<keys.length; i++){
							let item = tasks[keys[i]];
							if(item.original.split('/')[2] === taskKey){
								FoundTaskKey = keys[i];
								break;
							}
						}
						if(FoundTaskKey){
							fire.ref(`activeSprint/${projectID}/${pipelines[j]}/${FoundTaskKey}`).update(data);
							getActiveSprint(projectID)(dispatch)
							break ;
						}
					}
				}
			})
		}
		// console.log(data);
		// data.startDate = new Date().getTime();
		// let key = fire.ref(`sprints/${projectID}/freeTasks`).push(data).then(
		// 	(snapshot) => {

		// 		fire.ref(`projects/${projectID}/totalTasks`).once('value', (totalTasks) => {
		// 			totalTasks = totalTasks.val() + 1;
		// 			fire.ref(`projects/${projectID}/totalTasks`).set(totalTasks);
		// 		});

		// 		const key = snapshot.key;
		// 		if(files){
		// 			let attachments = files.map((file) => {return file.name});

		// 			fire.ref(`attachments/${projectID}/${attachmentKey}`).set({
		// 				sprintID: "freeTasks", taskID: key, files: attachments
		// 			});
					
		// 			files.map((file) => {
		// 				storage.ref(`sprints/${attachmentKey}/${file.name}`).put(file).then((response) => {
		// 					alert('uploaded');
		// 				});
		// 			}
		// 			)}
		// 		// fire.ref(`employees/${data.owner.key}/tasks`).push(snapshot.key);
		// 		}
		// );
		// console.log(data);
		// console.log(`sprints/${projectID}/${taskPath}`);
		fire.ref(`sprints/${projectID}/${taskPath}`).update(data);
	}
}

export default editTask;