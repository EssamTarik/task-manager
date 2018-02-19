import fire from '../../api/firebaseAPI';

const dates = {};

const getTaskStartDate = (activeSprint, projectID) => {
	return (dispatch) => {
		activeSprint.todo.map((task, i) => {
			fire.ref(`sprints/${projectID}/${task.original}/startDate`).on('value', (startDateSnapshot) => {
				if(startDateSnapshot.val()){
					dates[task.key] = startDateSnapshot.val();
					dates = Object.assign({}, dates);
				}else{
					delete dates[task.key];
					dates = Object.assign({}, dates);

				}
				if(i === activeSprint.todo.length-1)
					dispatch({
							type: 'TaskStartDatesFetched',
							payload: dates
					});
			})
		});
		activeSprint.inprogress.map((task, i) => {
			fire.ref(`sprints/${projectID}/${task.original}/startDate`).on('value', (startDateSnapshot) => {
				if(startDateSnapshot.val()){
					dates[task.key] = startDateSnapshot.val();
					dates = Object.assign({}, dates);

				}else{
					delete dates[task.key];
					dates = Object.assign({}, dates);
				}
				if(i === activeSprint.inprogress.length-1)
					dispatch({
							type: 'TaskStartDatesFetched',
							payload: dates
					});
			})
		});
		activeSprint.done.map((task, i) => {
			fire.ref(`sprints/${projectID}/${task.original}/startDate`).on('value', (startDateSnapshot) => {
				if(startDateSnapshot.val()){
					dates[task.key] = startDateSnapshot.val();
					dates = Object.assign({}, dates);
				}else{
					delete dates[task.key];
					dates = Object.assign({}, dates);
				}
				if(i === activeSprint.done.length-1)
					dispatch({
							type: 'TaskStartDatesFetched',
							payload: dates
					});
			})
		});
	}
	
}

export default getTaskStartDate