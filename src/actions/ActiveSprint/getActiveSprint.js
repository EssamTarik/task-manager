import fire, {auth} from '../../api/firebaseAPI';
import lodash from 'lodash';

const getActiveSprint = (projectID, user=false, viewAll=false, callback) => {
	return (dispatch) => {
		// fire.ref(`projects/${projectID}/lead/value`).on('value', (lead) => {
		fire.ref(`activeSprint/${projectID}`).on('value', (snapshot) => {
				let totalTasks = 0;
				let completeTasks = 0;
				let completeTasksTime = 0;
				// let viewAll = false;
				// if(lead.val() == user.key){
				// 	viewAll = true;
				// }

				let todo = [];
				snapshot.child('todo').forEach((task) => {
					try{
						if(user && (user.key == task.val().owner.key || viewAll)){
							todo.push({
								key: task.key, ...task.val()
							});
						}
						totalTasks += 1;
					}
					catch(e){
						//console.log(e);
					}
					if(task.val().original){
						fire.ref(`sprints/${projectID}/${task.val().original}`).once('value', (child) => {
							if(!child.val()){
								fire.ref(`activeSprint/${projectID}/todo/${task.key}`).remove();
							}
						})
					}else{
						fire.ref(`activeSprint/${projectID}/todo/${task.key}`).remove();
					}
				});

				let inprogress = [];
				snapshot.child('inprogress').forEach((task) => {
					try{
						if(user && (user.key == task.val().owner.key || viewAll)){
							inprogress.push({
								key: task.key, ...task.val()
							});
						}
						totalTasks += 1;
					}catch(e){
						//console.log(e)
					}

					if(task.val().original){
						fire.ref(`sprints/${projectID}/${task.val().original}`).once('value', (child) => {
							if(!child.val()){
								fire.ref(`activeSprint/${projectID}/inprogress/${task.key}`).remove();
							}
						})
					}else{
						fire.ref(`activeSprint/${projectID}/inprogress/${task.key}`).remove();
					}
				});

				let done = [];
				snapshot.child('done').forEach((task) => {
					try{
						if(user && (user.key == task.val().owner.key || viewAll)){
							done.push({
								key: task.key, ...task.val()
							});
						}
						if(task.val().time)
							completeTasksTime += parseInt(task.val().time);
						totalTasks += 1;
						completeTasks += 1;
					}catch(e){
						//console.log(e);
					}

					if(task.val().original){
						fire.ref(`sprints/${projectID}/${task.val().original}`).once('value', (child) => {
							if(!child.val()){
								fire.ref(`activeSprint/${projectID}/done/${task.key}`).remove();
							}
						})
					}else{
						fire.ref(`activeSprint/${projectID}/done/${task.key}`).remove();
					}
				});			

				let payload = {};
				if(snapshot.val() && snapshot.val().name)
					payload['name'] = snapshot.val().name;

				if(snapshot.val() && snapshot.val().startedBy)
					payload.startedBy = snapshot.val().startedBy;

				if(snapshot.val() && snapshot.val().startDate)
					payload.startDate = snapshot.val().startDate;

				if(snapshot.val() && snapshot.val().endDate)
					payload.endDate = snapshot.val().endDate;

				if(snapshot.val() && snapshot.val().original)
					payload.original = snapshot.val().original;
				
				payload.done = lodash.orderBy(done, ['priority'], ['asc']);
				payload.inprogress = lodash.orderBy(inprogress, ['priority'], ['asc']);
				payload.todo = lodash.orderBy(todo, ['priority'], ['asc']);

				let updatedData = {};
				updatedData[`projects/${projectID}/currentCompleteTasksTime`] = completeTasksTime;
				updatedData[`projects/${projectID}/currentCompleteTasks`] = completeTasks;
				updatedData[`projects/${projectID}/currentTasks`] = totalTasks;

				fire.ref().update(updatedData);
				dispatch({
					type: "ActiveSprintFetched",
					payload: payload
				});

				if(callback)
					callback(payload, projectID);
			});
		// });
	}
}

export default getActiveSprint;