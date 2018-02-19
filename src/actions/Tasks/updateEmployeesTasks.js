import fire from '../../api/firebaseAPI';
import lodash from 'lodash';

const updateEmployeesTasks = (projectID, people) => {
	return (dispatch) => {
		let taskOwners = {};
		if(people){
			Object.keys(people).map((personKey) => {
				taskOwners[`projects/${projectID}/people/${personKey}/taskCount`] = 0;
			});
			fire.ref(`sprints/${projectID}`).once('value', (snapshot) => {
				if(snapshot.val()){
					snapshot.forEach((sprint) => {
						if(sprint.key === 'freeTasks'){
							lodash.toArray(sprint.val()).map((task) => {
								let ownerFirebasePath = `projects/${projectID}/people/${task.owner.key}/taskCount`;
								if(taskOwners.hasOwnProperty(ownerFirebasePath))
									taskOwners[ownerFirebasePath] += 1;
							});
						}else{
							lodash.toArray(sprint.val().tasks).map((task) => {
								let ownerFirebasePath = `projects/${projectID}/people/${task.owner.key}/taskCount`;
								if(taskOwners.hasOwnProperty(ownerFirebasePath))
									taskOwners[ownerFirebasePath] += 1;
							});
						}
					});
					fire.ref().update(taskOwners);
				}
			});
		}
	}
}

export default updateEmployeesTasks;