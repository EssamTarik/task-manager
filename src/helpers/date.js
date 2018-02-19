import moment from 'moment';
const readDate = (date) => {
	try{
		if(isNaN(date.getFullYear()))
			throw "invalid date";
		return moment(date).format('ll');
		// return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
	}catch(e){
		return "";
	}
}

const getServerUnixTime = (callback) => {

	fetch("https://script.googleusercontent.com/macros/echo?user_content_key=quv0BK2Zt8byXFGWkDvBY6zznq6ir0v3wumyE_sxP_D3xHeG-lyZrQxSbDwfE2m9xaOQ7cI6X1mvOPyv6AXsVYKFZs1VAQ0Gm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJ9GRkcRevgjTvo8Dc32iw_BLJPcPfRdVKhJT5HNzQuXEeN3QFwl2n0M6ZmO-h7C6eIqWsDnSrEd&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk")
	.then((data) => {return data.json()})
	.then((json) => {
		callback(new Date(json.fulldate).getTime());
	}).catch((error) => {
		callback(new Date().getTime());
	});
}

const readTime = (date) => {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	let retStr = "";

	if(hours > 0)
		retStr += `${hours}`;
	else if(hours == 0)
		retStr += '00';

	if(minutes > 0)
		retStr += `:${minutes}`;
	else if(minutes == 0)
		retStr += `:00`;
		
	return retStr;
}

const readDateTime = (date) => {
	return `${readDate(date)} ${readTime(date)}`;
}

const readDateObject = (date) => {
	try{
		if(isNaN(date.getFullYear()))
			throw "invalid date";
		return {year: date.getFullYear(),month: date.getMonth(),day: date.getDate()};
	}catch(e){
		return "";
	}
}


const readDuration = (start, end) => {
	start = moment(new Date(start));
	end = moment(new Date(end));
	let duration = moment.duration(end.diff(start));
	
	let durationStr = "";

	if(parseInt(duration.days()) > 0)
		durationStr += `${duration.days()}d `;

	if(parseInt(duration.hours()) > 0)
		durationStr += `${duration.hours()}h `;

	if(parseInt(duration.minutes()) > 0)
		durationStr += `${duration.minutes()}m`;


	return durationStr;
}

const readDurationString = (duration) => {

	let durationStr = "";

	if(parseInt(duration.days()) > 0)
		durationStr += `${duration.days()}d`;

	if(parseInt(duration.hours()) > 0)
		durationStr += `${duration.hours()}h `;

	if(parseInt(duration.minutes()) > 0)
		durationStr += `${duration.minutes()}m`;


	return durationStr;
}

export {getServerUnixTime, readDate, readDuration, readDateObject, readDateTime, readDurationString};