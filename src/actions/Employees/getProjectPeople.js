import fire from '../../api/firebaseAPI';

const objectToArray = (obj, owner, viewers, leaders) => {
	let arr = [];
	
	if(obj){
		Object.keys(obj).map((key) => {
			let role = "employee"
			if(key == owner)
				role = "owner";
			else if(viewers.indexOf(key) != -1)
				role = "viewer";
			else if(leaders.indexOf(key) != -1)
				role = "leader";

			arr.push({key: key, role: role, ...obj[key]})
		});
	}
	return arr;
}

const getProjectPeople = (projectID, callback) => {
	return (dispatch) => {
		fire.ref(`projects/${projectID}`).on('value', (snapshot) => {
			if(snapshot.val()){
				let people = snapshot.val().people;
				let owner = snapshot.val().owner.value;
				let viewers = [];
				let leaders = [];

				if(snapshot.val().viewers){
					let keys = Object.keys(snapshot.val().viewers);
					keys.map((key) => {
						viewers.push((key));
					});
				}

				if(snapshot.val().leaders){
					let keys = Object.keys(snapshot.val().leaders);
					keys.map((key) => {
						leaders.push((key));
					});
				}

				let payload = objectToArray(people, owner, viewers, leaders);
				dispatch({
					type: "ProjectPeopleFetched",
					payload: payload
				});
				if(callback)
					callback(payload);
			}else{
				dispatch({
					type: "ProjectPeopleFetched",
					payload: []
				});
			}
		})
	}
}

export default getProjectPeople;