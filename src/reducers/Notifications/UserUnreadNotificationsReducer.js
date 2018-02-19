const UserUnreadNotificationsReducer = (state=0, action) => {
	switch(action.type){
		case "UserUnreadNotificationsFetched":
			return action.payload;
		default:
			return state;
	}
}

export default UserUnreadNotificationsReducer;