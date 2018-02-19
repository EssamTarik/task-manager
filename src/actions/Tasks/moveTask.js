import fire from '../../api/firebaseAPI';
import getActiveSprint from '../ActiveSprint/getActiveSprint';

const moveTask = (source, target, id, projectID, active) => {
	return (dispatch) => {
		fire.ref(`sprints/${projectID}/${source}/${id}`).once('value', (snapshot) => {
			fire.ref(`sprints/${projectID}/${source}/${id}`).remove().then(function(){
			})
			fire.ref(`sprints/${projectID}/${target}`).push(snapshot.val()).then(function(newNode){
				let updatedData = {};
				updatedData[`attachments/${projectID}/${snapshot.val().attachmentKey}/sprintID`] = target;
				updatedData[`attachments/${projectID}/${snapshot.val().attachmentKey}/taskID`] = newNode.key;

				fire.ref().update(updatedData);

				if(active){
					switch(active){
						case "target":
							fire.ref(`activeSprint/${projectID}/todo`).push({...snapshot.val(), original: `${target}/${newNode.key}`});
							break;
						default:
							getActiveSprint(projectID)(dispatch);
							break;
					}
				}
			});
		});
	}
}

export default moveTask;