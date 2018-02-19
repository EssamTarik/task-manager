import fire from '../../api/firebaseAPI';
import automaticDurationStart from './automaticDurationStart';

const moveTask = (source, target, id, projectID, customEndDate=false, callback) => {
	return (dispatch) => {
		fire.ref(`activeSprint/${projectID}/${source}/${id}`).once('value', (snapshot) => {
			let status = "To Do";
			let endDate = false;
			let startDate = new Date().getTime();
			
			if(target == 'done'){
				status = "Done"
				if(customEndDate)
					endDate = customEndDate.getTime();
				else{
					endDate = new Date();
					endDate = endDate.getTime();
				}
			}else if(target == 'inprogress'){
				status = "In Progress"
				startDate = new Date().getTime();
			}

			let updatedData = {};
			updatedData[`sprints/${projectID}/${snapshot.val().original}/status`] = status
			updatedData[`sprints/${projectID}/${snapshot.val().original}/endDate`] = endDate;
			

			fire.ref(`sprints/${projectID}/${snapshot.val().original}/startDate`).once('value', (startDateSnapshot) => {
				// console.log(startDateSnapshot.val())
				 if(!startDateSnapshot.val() && startDate){
					 	fire.ref(`sprints/${projectID}/${snapshot.val().original}/startDate`).set(startDate);
				 }else if(!startDateSnapshot.val() && target == 'done'){
					startDate = new Date().getTime();
				 	fire.ref(`sprints/${projectID}/${snapshot.val().original}/startDate`).set(startDate);
				 }
			});

			fire.ref(`activeSprint/${projectID}/${source}/${id}`).remove().then(function(){
			})
			let movedTask = snapshot.val();
	

			Object.assign(movedTask, {status});
			
			if(target === 'done' && movedTask.paused === false && !isNaN(movedTask.duration)){
				movedTask.duration += new Date().getTime() - movedTask.lastAutomaticTime;
			}

			fire.ref(`activeSprint/${projectID}/${target}`).push(movedTask).then(function(movedTaskSnapshot){
				if(target === 'inprogress')
					automaticDurationStart(projectID, movedTaskSnapshot.key)(dispatch);
				
				fire.ref().update(updatedData);

				if(callback)
					callback(Object.assign(movedTask, {key: movedTaskSnapshot.key}));
			});

		});
	}
}

export default moveTask;