import ProjectWidget from '../components/Projects/ProjectWidget';
import React from 'react';

const updateProjects = (projects) => {

	let allProjects = {raw: projects};

	projects.forEach( (status) => {
		allProjects[status.key] = [];
		status.forEach ((widget) => {
				allProjects[status.key].push(<ProjectWidget key={widget.key} manager = {widget.val().manager} col={status.key} key={widget.key} id={widget.key} title={widget.val().title} desc={widget.val().desc} />);
		});
	});
	console.log('allProjects');
	console.log(allProjects);

	return {
		type: "ProjectsUpdated",
		payload: allProjects
	}
};

export default updateProjects;