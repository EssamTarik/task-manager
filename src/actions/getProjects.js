import fire from '../api/firebaseAPI';
import updateProjects from './updateProjects';

const getEmployees = () => {
	
	 //    this.ref = fire.ref('projects');
		// this.ref.on('value', (snapshot) => {
		// 	thisupdateProjects(snapshot);
		// });


	console.log('fetching projects');

	return ( (dispatch) => {
		fire.ref('projects').on('value', (snapshot) => {
			console.log('fetched');
			dispatch(updateProjects(snapshot));
		});
	} );

}

export default getEmployees;