import fire from '../../api/firebaseAPI';
import lodash from 'lodash';

const getCompleteSprints = (projectID) => {
	return (dispatch) => {
		fire.ref(`sprints/${projectID}`).orderByChild('complete').equalTo(true).on('value', (snapshot) => {
			let payload = [];
			if(snapshot.val() instanceof Object){
				let keys = Object.keys(snapshot.val());
				for(let i=0; i<keys.length; i++){
					if(keys[i] != 'freeTasks'){
						let sprint = snapshot.val()[keys[i]];
						let tasks = [];
						try{
							let taskKeys = Object.keys(sprint.tasks);
							for(let j=0; j<taskKeys.length; j++){
								tasks.push({
									key: taskKeys[j],
									...sprint.tasks[taskKeys[j]]
								});
							}
						}catch(e){
						}

						tasks = lodash.orderBy(tasks, ['priority'], ['asc']);
						sprint.tasks = tasks;

						payload.push({
							key: keys[i],
							...sprint
						});
					}
				}
			}
			dispatch({
				type: "CompleteSprintsFetched",
				payload: payload
			});
		})
	}
}

export default getCompleteSprints;