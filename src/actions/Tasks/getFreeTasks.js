import fire from '../../api/firebaseAPI';
import lodash from 'lodash';

const getFreeTasks = (projectID) => {
	return (dispatch) => {
		fire.ref(`sprints/${projectID}/freeTasks`).on('value', (snapshot) => {
			let arr = [];
			try{
				let keys = Object.keys(snapshot.val());
				for(let i = 0; i<keys.length; i++){
					arr.push({
						key: keys[i],
						...snapshot.val()[keys[i]]
					});
				}
			}catch(e){
			}

			arr = lodash.orderBy(arr, ['priority'], ['asc']);

			dispatch({
				type: "FreeTasksFetched",
				payload: arr
			});
		});
	}
}

export default getFreeTasks;