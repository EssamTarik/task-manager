import fire from '../../api/firebaseAPI';

const getAllSprints = (projectID) => {
	return (dispatch) => {
		fire.ref(`sprints/${projectID}`).on('value', (snapshot) => {
			let payload = [];
			if(snapshot.val() instanceof Object){
				let keys = Object.keys(snapshot.val());
				for(let i=0; i<keys.length; i++){
					let sprint = snapshot.val()[keys[i]];
					if(keys[i] != "freeTasks" && sprint.name){
						let tasks = [];
						try{
							let taskKeys = Object.keys(sprint.tasks);
							for(let j=0; j<taskKeys.length; j++){
								tasks.push({
									key: taskKeys[j],
									...sprint.tasks[taskKeys[j]]
								});
							}
						}catch(e){}

						sprint.tasks = tasks;

						payload.push({
							key: keys[i],
							...sprint
						});
					}
				}
			}

			dispatch({
				type: "AllSprintsFetched",
				payload: payload
			});
		})
	}
}

export default getAllSprints;