export default function ProfilePageReducer(state={username: ''}, action){

	
	switch(action.type){
		case "ProfilePageUpdated":
			return action.payload;

		case "ProfileFormUpdated":
			return action.payload;

		case "profileUpdated":
			console.log('profile updated im the reducer');
			return state;

		default:
			return state;

	}
}