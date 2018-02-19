import fire, {storage} from '../../api/firebaseAPI';
import uuid from 'uuid/v4';
import addNotification from '../Notifications/addNotification';

const createTask = (data, projectID) => {
	return (dispatch) => {
		let files = data.files;
		delete data.files;
		data.status = "To Do";
		let attachmentKey = uuid();
		data = JSON.parse(JSON.stringify(data));

		if(files)
			data.attachmentKey = attachmentKey;

		// console.log(data);
		// data.startDate = new Date().getTime();
		let key = fire.ref(`sprints/${projectID}/freeTasks`).push(data).then(
			(snapshot) => {

				fire.ref(`projects/${projectID}/totalTasks`).once('value', (totalTasks) => {
					totalTasks = totalTasks.val() + 1;
					fire.ref(`projects/${projectID}/totalTasks`).set(totalTasks);
				});
				
				fire.ref(`projects/${projectID}/totalTime`).once('value', (totalTime) => {
					totalTime = parseInt(totalTime.val()) + parseInt(data.time);
					fire.ref(`projects/${projectID}/totalTime`).set(totalTime);
				});

				addNotification(data.owner.key, `You were assigned task "${data.name}"`, `projects/${projectID}`)(dispatch);

				const key = snapshot.key;
				if(files){
					let attachments = files.map((file) => {return file.name});

					fire.ref(`attachments/${projectID}/${attachmentKey}`).set({
						sprintID: "freeTasks", taskID: key, files: attachments
					});
					
					files.map((file) => {
						storage.ref(`sprints/${attachmentKey}/${file.name}`).put(file).then((response) => {
							// alert('uploaded');
						});
					}
					)}
				// fire.ref(`employees/${data.owner.key}/tasks`).push(snapshot.key);
				}
		);
	}
}

export default createTask;