const UpdateSpecificProject = (project) => {
	console.log('fetched project data');
	return {
		type: 'SpecificProjectUpdated',
		payload: project
	};
}

export default UpdateSpecificProject;