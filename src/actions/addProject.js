import UpdateEmployeesList from './UpdateEmployeesList';
import fire from '../api/firebaseAPI';
import updateProjects from './updateProjects';
import getProjects from './getProjects';

const addProject = (target, widget) => {
	
	 //    this.ref = fire.ref('projects');
		// this.ref.on('value', (snapshot) => {
		// 	thisupdateProjects(snapshot);
		// });



	return ( (dispatch) => {
		fire.ref('projects').child(target).push(widget).then( () => {
			console.log('added project');
		});
	} );

}

export default addProject;