import fire, {storage} from '../../api/firebaseAPI';

const getTaskAttachments = (projectID, taskKey) => {
	return (dispatch) => {
			let urls = {};
			fire.ref(`attachments/${projectID}`).orderByChild('taskID').equalTo(taskKey).on('value', (snapshot) => {
				if(snapshot.val()){
					let attachmentKey = Object.keys(snapshot.val())[0];
					let files = snapshot.val()[attachmentKey].files;
					files.forEach((file) => {
						storage.ref(`sprints/${attachmentKey}/${file}`).getDownloadURL().then((url) => {
							urls[file] = url;
							if(Object.keys(urls).length === files.length)
								dispatch({
									type: 'TaskAttachmentsFetched',
									payload: urls
								})
						})
					})
				}else{
					dispatch({
						type: 'TaskAttachmentsFetched',
						payload: {}
					})
				}
			});
	}
}

export default getTaskAttachments;