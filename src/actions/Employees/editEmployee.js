import fire from '../../api/firebaseAPI';

const editEmployee = (submit, key, projects) => {
	return (dispatch) => {
		fire.ref(`employees/${key}`).update(submit);
		let updatedData = {};
		Object.keys(projects).map((project) => {
			updatedData[`projects/${project}/people/${key}/name`] = submit.username;
			fire.ref(`projects/${project}/lead`).once('value', (lead) => {
				if(lead.val() && lead.val().value && lead.val().value == key)
					fire.ref(`projects/${project}/lead/text`).set(submit.username);
			});
		});
		// console.log(updatedData);
		fire.ref().update(updatedData);
	}
}

export default editEmployee;