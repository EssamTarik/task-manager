const UpdateTeams = (snapshot) =>{

	let teams = [];
	snapshot.forEach( (team) => {
		teams.push({value: team.key, text: team.val().name});
	});
	
	return {
		type: 'TeamListUpdated',
		payload: teams
	};
}

export default UpdateTeams;