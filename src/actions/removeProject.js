import UpdateEmployeesList from './UpdateEmployeesList';
import fire from '../api/firebaseAPI';
import updateProjects from './updateProjects';

const removeProject = (target) => {
	
	 //    this.ref = fire.ref('projects');
		// this.ref.on('value', (snapshot) => {
		// 	thisupdateProjects(snapshot);
		// });


	return ( (dispatch) => {
		fire.ref('projects').child(target).remove().then( () => {
			console.log('removed project');
		});
	} );

}

export default removeProject;