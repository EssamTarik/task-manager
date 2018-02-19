import fire from '../../api/firebaseAPI';
import addPeople from '../Employees/addPeople';

const createProject = (data) => {
	return (dispatch) => {
		fire.ref('/projects').push(data).then((snapshot) => {
			addPeople(snapshot.key, Object.keys(data.people).map((key) => {
				return {id: key, username: data.people[key].name};
			}))();
		});
	}
}

export default createProject;