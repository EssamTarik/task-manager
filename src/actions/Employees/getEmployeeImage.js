import fire, {storage} from '../../api/firebaseAPI';

let images = {};
const getEmployeeImage = (key) => {
	return (dispatch) => {
		fire.ref(`employees/${key}/image`).on('value', (snapshot) => {
			if(snapshot.val()){
				storage.ref(`images/${snapshot.val()}`).getDownloadURL().then((url) => {
					images[key] = url
					dispatch({
						type: "EmployeesImagesFetched",
						payload: Object.assign({}, images)
					})
				}, () => {
					images[key] = '/static/img/avatar.png';
					dispatch({
						type: "EmployeesImagesFetched",
						payload: Object.assign({}, images)
					})
				})
			}else{
					images[key] = '/static/img/avatar.png';
					dispatch({
						type: "EmployeesImagesFetched",
						payload: Object.assign({}, images)
					})
			}
		})
	}
}

export default getEmployeeImage;