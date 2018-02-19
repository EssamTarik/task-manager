import fire from '../../api/firebaseAPI';
import moment from 'moment';

const getTaskTimelog = (taskPath, clickedTaskPath) => {
	return (dispatch) => {
		fire.ref(`taskTimelog/${taskPath}`).on('value', (snapshot) => {
			let taskTotalDuration = 0;
			let log = [];
			let startDate = false;
			snapshot.forEach((entry) => {
				if(startDate === false)
					startDate = entry.val().startDate;
				else if(startDate > entry.val().startDate)
					startDate = entry.val().startDate;

				log.push({key: entry.key, ...entry.val()});
				taskTotalDuration += parseInt(entry.val().duration);
			});
			fire.ref(`sprints/${taskPath}/duration`).set(taskTotalDuration);
			fire.ref(`${clickedTaskPath}/duration`).set(taskTotalDuration);
			console.log(startDate);
			if(startDate){
				fire.ref(`sprints/${taskPath}/startDate`).set(startDate);
				fire.ref(`${clickedTaskPath}/startDate`).set(startDate);
			}
			dispatch({
				type: "TaskTimelogFetched",
				payload: log
			})
		});
	}
}

export default getTaskTimelog;