import fire from '../../api/firebaseAPI';
import addPeople from '../Employees/addPeople';

const editProject = (projectID, data, originalPeople) => {
	let allPeople = {...originalPeople, ...data.people};
	return (dispatch) => {
		fire.ref(`projects/${projectID}`).update(data).then((snapshot) => {
			addPeople(projectID, Object.keys(allPeople).map((key) => {
				return {id: key, username: allPeople[key].name};
			}))(dispatch);
		});
	}
}

export default editProject;