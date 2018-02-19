const UpdateStatus = (snapshot) =>{

	let status = [];
	snapshot.forEach( (statusObj) => {
		status.push({value: statusObj.key, text: statusObj.val().name});
	});
	
	return {
		type: 'statusListUpdated',
		payload: status
	};
}

export default UpdateStatus;