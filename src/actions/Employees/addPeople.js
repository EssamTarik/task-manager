import fire from '../../api/firebaseAPI';

const addPeople = (projectID, people) => {
	let updatedData = {};
	return (dispatch) => {
		people.map((employee) => {
			/*
				if 0 just add to people
				if 1 add to viewers too
				if 2 add to leaders too
			*/
			switch(employee.role){
				case 1:
					fire.ref(`projects/${projectID}/viewers/${employee.id}/name`).set(employee.username).then((snapshot) => {
					});
					break;

				case 2:
					fire.ref(`projects/${projectID}/leaders/${employee.id}/name`).set(employee.username).then((snapshot) => {
					});
					break;

				default:
					break;
			}

			
			fire.ref(`projects/${projectID}/people/${employee.id}/name`).set(employee.username).then((snapshot) => {
			});
			updatedData[`employees/${employee.id}/projects/${projectID}`] = true;
		});
		fire.ref().update(updatedData);
	}
}

export default addPeople;