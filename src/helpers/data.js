import {readDate, readDurationString} from './date';
import moment from 'moment';

function readTaskPriority(priority){
		if(typeof(priority) == 'string' || priority instanceof String)
			priority = parseInt(priority);
	
		switch(priority){
			case 1:
				return "high";
			case 2:
				return "medium";
			case 3:
				return "low";
			default:
				return null;
		}
}

const tasksToCSV = (array) => {
	let csv = 'start,end,name,sprint,duration,owner,priority,status,time\n';
	array.forEach((task) => {
		task = Object.assign({}, task);
		delete task.key;
		let str = '';
		if(task.start)
			str += task.start.replace(/\,/g, '-') + ',';
		else
			str += ','
		
		if(task.due)
			str += task.due.replace(/\,/g, '-') + ',';
		else
			str += ','

		str += task.task.replace(/\,/g, '-') + ',';
		str += task.sprint.replace(/\,/g, '-') + ',';
		str += task.duration.replace(/\,/g, '-') + ',';
		str += task.owner.replace(/\,/g, '-') + ',';
		str += readTaskPriority(task.priority).replace(/\,/g, '-') + ',';
		str += task.status.replace(/\,/g, '-') + ',';
		str += task.time.replace(/\,/g, '-');
		csv += str;
		csv += '\n';
	})
	return csv;
}

export {tasksToCSV}