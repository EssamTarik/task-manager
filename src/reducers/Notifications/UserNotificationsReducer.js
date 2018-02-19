const UserNotificationsReducer = (state=[], action) => {
	switch(action.type){
		case "UserNotificationsFetched":
			return action.payload;
		default:
			return state;
	}
}

export default UserNotificationsReducer;