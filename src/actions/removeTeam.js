import fire from '../api/firebaseAPI';

const removeTeam = (id) =>{
	return (dispatch) => {
		fire.ref('teams/' + id).remove().then(() => {
			console.log('team removed');
			dispatch({type: 'team removed'});
		});
	}
}

export default removeTeam;