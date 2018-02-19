import fire from '../api/firebaseAPI';
import UpdateSpecificProject from './UpdateSpecificProject';

const getSpecificProject = (id) => {
	console.log('fetching project data');
	
	return (dispatch) => {
		fire.ref('projects/'+id).on('value' , (snapshot) => {
			console.log('dispatching', snapshot.val());
			dispatch(UpdateSpecificProject(snapshot.val()));
		})
	}
}

export default getSpecificProject;
