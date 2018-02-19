import {storage} from '../api/firebaseAPI';
import UpdateCardsImages from './UpdateCardsImages';

const getCardsImages = (employees) => {
	
	let newImages = {};
	return ((dispatch) => {
		employees.forEach( (employee) => {
			
			if(employee.val().image){
				storage.ref('images/'+employee.val().image).getDownloadURL().then( (imageURL) => {
					newImages[employee.key] = imageURL;

					//for some reason , the json object can't be read properly when passed as it is
					//it needs to be converted to a string then parsed when received
					//maybe cuz it cant handle the key names well ?!!!
					
					dispatch(UpdateCardsImages(JSON.stringify(newImages)));
				}, () => {
					newImages[employee.key] = '/static/img/avatar.png';
					dispatch(UpdateCardsImages(JSON.stringify(newImages)));
				});
			}
			else{
				newImages[employee.key] = '/static/img/avatar.png';
				dispatch(UpdateCardsImages(JSON.stringify(newImages)));
			}

		});
	
	});
}

export default getCardsImages;