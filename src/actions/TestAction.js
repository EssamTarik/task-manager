import lodash from 'lodash';

const TestAction = () =>{

	console.log('UpdateTeamsaction');
	let payload = [{text: 'new', value: 'new'}];
	console.log(payload);
	
	return {
		type: 'TeamListUpdated',
		payload: payload
	};
}

export default TestAction;