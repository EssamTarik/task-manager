import fire from '../../api/firebaseAPI';

const editRole = (projectID, person, newRole) => {
	return (dispatch) => {
		if(person.role === newRole)
			return false;
		else{
			if(person.role === 'viewer')
				fire.ref(`projects/${projectID}/viewers/${person.key}`).remove();
			else if(person.role === 'leader')
				fire.ref(`projects/${projectID}/leaders/${person.key}`).remove();

			if(newRole === 'viewer')
				fire.ref(`projects/${projectID}/viewers/${person.key}/name`).set(person.name);
			else if(newRole === 'leader')
				fire.ref(`projects/${projectID}/leaders/${person.key}/name`).set(person.name);
			
		}
	}
}

export default editRole;