import fire from '../../api/firebaseAPI';

const editSprint = (projectID, sprintID, data, active) => {
	return (dispatch) => {
		let updatedData = {};
		if(active){
			updatedData[`activeSprint/${projectID}/name`] = data.name;
			
			data.startDate.setHours(0,0,0,0);
			data.endDate.setHours(0,0,0,0);

			updatedData[`activeSprint/${projectID}/startDate`] = data.startDate.getTime();
			updatedData[`activeSprint/${projectID}/endDate`] = data.endDate.getTime();
			fire.ref().update(updatedData);
		}
		data.startDate = data.startDate.getTime();
		data.endDate = data.endDate.getTime();

		fire.ref(`sprints/${projectID}/${sprintID}`).update(data);
	}
}

export default editSprint;