import fire from '../../api/firebaseAPI';
import lodash from 'lodash';
import getSprintNames from '../Sprints/getSprintNames';
import getTaskNames from '../Tasks/getTaskNames';

const getAttachmentsFolders = (projectID, callback) => {
	return (dispatch) => {
		fire.ref(`attachments/${projectID}`).on('value', (snapshot) => {
			let payload = {};
			snapshot.forEach((attachmentNode) => {
				let attachmentKey = attachmentNode.key;
				let attachmentNodeData = attachmentNode.val();
				if(!attachmentNodeData.files)
					return ;

				let sprintID = attachmentNodeData.sprintID == 'freeTasks'?attachmentNodeData.sprintID:attachmentNodeData.sprintID.substring(0, attachmentNodeData.sprintID.length-6);

				if(!payload[sprintID])
					payload[sprintID] = {};
	
				payload[sprintID][attachmentNodeData.taskID] = {key: attachmentKey, files: lodash.toArray(attachmentNodeData.files)};
			});
			dispatch({
				type: "AttachmentsFoldersFetched",
				payload: payload
			});
			callback(payload);

			let sprints = Object.keys(payload);

			getSprintNames(projectID, sprints)(dispatch);
			getTaskNames(projectID, payload)(dispatch);

		});
	}
}

export default getAttachmentsFolders;