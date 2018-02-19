
const CardImagesReducer = (state = {}, action) => {
	switch(action.type){
		case "CardImagesUpdated":
 			return action.payload;
 		default:
	 		return state;
	}
}

export default CardImagesReducer;