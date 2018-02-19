import fire from '../api/firebaseAPI';

const getSprintName = (projectID, sprintID, callback) => {
	fire.ref(`sprints/${projectID}/${sprintID}/name`).once('value', (name) => {
		callback(name.val());
	});
}

const isUserInProject = (projectID, userID, callback) => {
	fire.ref(`projects/${projectID}/people/${userID}`).once('value', (user) => {
		console.log(user.val());
		if(user.exists())
			callback(true);
		else
			callback(false);
	});
}

export {getSprintName, isUserInProject};