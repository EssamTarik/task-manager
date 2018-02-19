import React, {Component} from 'react';
import {connect} from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {bindActionCreators} from 'redux';
import "font-awesome/css/font-awesome.min.css";
import "react-select/dist/react-select.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from './ProjectIssuesTable';
import navigateProject from '../../../../actions/Routing/navigateProject';
import getAllSprints from '../../../../actions/Issues/getAllSprints';
import RaisedButton from 'material-ui/RaisedButton';
import FiltersIcon from 'material-ui/svg-icons/content/filter-list';
import {tableSetFilter, makeSelectors} from 'sematable';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';
import {readDate, readDuration, readDurationString} from '../../../../helpers/date';
import getEmployeesData from '../../../../actions/getEmployeesData';
import PrintIcon from 'material-ui/svg-icons/action/print';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import lodash from 'lodash';
import TableIcon from 'material-ui/svg-icons/image/view-comfy';
import {tasksToCSV} from '../../../../helpers/data';
import FileSaver from 'file-saver';

class ProjectsPage extends Component{
	constructor(props){
		super(props);
		this.filters = [];
		this.state = {selected: null, filters: [], completeField: 3, filtersPopoverOpen: false, anchorEl: null};
		this.onChange = this.onChange.bind(this);
		this.props.getAllSprints(this.props.params.id);
		this.getFilters = this.getFilters.bind(this);
		this.onCompleteChange = this.onCompleteChange.bind(this);
		this.openFiltersPopover = this.openFiltersPopover.bind(this);
		this.closeFiltersPopover = this.closeFiltersPopover.bind(this);
		this.data = [];
	}

	addFilter(key, value){
		let index = -1;
		this.filters.map((filter, i) => {
			if(filter.key == key)
				index = i;
		});
		if(index == -1)
			this.filters.push({key: key, value: value});
		else
			if(value != '')
				this.filters[index].value = value;
			else
				this.filters.splice(index, 1);
		this.getFilters();
	}
	getDurations(){
		let data = this.getData();
		let filtersObject = {};
		this.filters.forEach((filter) => {
			filtersObject[filter.key] = filter.value;
		})
		let filteredData = lodash.filter(data, filtersObject);
		let totalDuration = 0;
		let totalActualDuration = 0;
		filteredData.forEach((item) => {
			if(item.time && !isNaN(item.time))
				totalDuration += parseInt(item.time);
			if(item.originalDuration && !isNaN(item.originalDuration))
				totalActualDuration += parseInt(item.originalDuration);
		});
		if(isNaN(totalDuration))
			totalDuration = 0;

		if(isNaN(totalActualDuration))
			totalActualDuration = 0;
		// console.log(totalDuration);
		// console.log(totalActualDuration);
		return {totalDuration, totalActualDuration};
	}
	getExcelData(){
		let data = this.getData();
		let filtersObject = {};
		this.filters.forEach((filter) => {
			filtersObject[filter.key] = filter.value;
		})
		let filteredData = lodash.filter(data, filtersObject);
		return filteredData;
	}
	getFilters(event){
		if(event)
			event.preventDefault();
		this.props.tableSetFilter('ProjectIssuesTable', this.filters);
	}
	onChange(event, index, value){
		this.setState({selected: value});
	}
	renderSprintList(){
		return this.props.AllSprints.map((sprint) => {
			return <MenuItem key={sprint.key} value={sprint.key} primaryText={sprint.name} />;
		});
	}
	getCurrentSprint(){
		let thisstate = this.state;
		let ret = false;
		if(thisstate.selected == 0){
			let retArray = [];
			retArray = this.props.AllSprints;
			if(retArray.length > 0)
				ret = retArray;

		}else if(thisstate.selected === 1){
			let sprints= lodash.filter(this.props.AllSprints, {complete: true});
			ret = sprints ;
		}else if(thisstate.selected === 2){
			let sprints= lodash.filter(this.props.AllSprints, {complete: false});
			ret = sprints ;
		}
		else{
			this.props.AllSprints.map((sprint) => {
				if(sprint.key == thisstate.selected){
					ret = sprint;
				}
			});
		}
		return ret;
	}
	componentDidMount(){
		this.props.navigateProject(6);
		this.props.getEmployeesData();
	}
	sprintExists(key){
		for(let i=0; i<this.props.AllSprints.length; i++){
			if(this.props.AllSprints[i].key == key)
				return true;
		}
		return false;
	}
	componentDidUpdate(){
		if(this.state.selected == null && this.props.AllSprints[0] || (!this.sprintExists(this.state.selected) && [0, 1, 2].indexOf(this.state.selected) === -1))
			if(this.props.AllSprints.length > 0)
				this.setState({selected: this.props.AllSprints[0].key});
	}
	getData(){
		try{
			if(this.getCurrentSprint() instanceof Array){
				// console.log('array');
				let ret = [];
				let id = 0;
				this.getCurrentSprint().map((sprint) =>{
					sprint.tasks.map((task, i) => {
						let duration = "";
						if(task.duration){
							duration = readDurationString(moment.duration(task.duration));
						}
						ret.push({id: ++id, sprint: sprint.name, time: task.time, displayTime: `${task.time} Hours`, task: task.name, owner: task.owner.name, status: task.status, start: readDate(new Date(task.startDate)), due: task.endDate?readDate(new Date(task.endDate)):"", duration: duration, originalDuration: task.duration, priority: task.priority});
					});
				});
				return ret;
			}else{
				let ret = this.getCurrentSprint().tasks.map((task, i) => {
					let duration = "";
					if(task.duration){
						duration = readDurationString(moment.duration(task.duration));
					}
					return {id: i+1, sprint: this.getCurrentSprint().name, time: task.time, displayTime: `${task.time} Hours`, task: task.name, owner: task.owner.name, status: task.status, start: readDate(new Date(task.startDate)), due: task.endDate?readDate(new Date(task.endDate)):"", duration: duration, originalDuration: task.duration, priority: task.priority};
				});
				return ret;
			}
		}catch(e){
			// console.log(e);
			return [];
		}
	}
	onCompleteChange(event, index, complete){
		let newState = this.state;
		newState.completeField = complete;
		this.setState(newState);
		let status = ["To Do", "Done", "In Progress", ""]
		this.addFilter("status", status[complete]);
	}
	openFiltersPopover(event){
		let newState = this.state;
		newState.filtersPopoverOpen = true;
		newState.anchorEl = event.currentTarget;
		this.setState(newState);
	}
	closeFiltersPopover(){
		let newState = this.state;
		newState.filtersPopoverOpen = false;
		this.setState(newState);
	}
	render(){
		let ownerFilter = lodash.find(this.filters, {key: 'owner'});
		return(
			<div className="uk-grid uk-margin-small-left uk-margin-small-top uk-margin-small-right">
			
			<div className="uk-width-1-2">
			<SelectField value={this.state.selected} onChange={this.onChange} floatingLabelText="Select Sprint" autoWidth={false} style={{float: "left", width: 200}}>
				<MenuItem value={0} primaryText="All Sprints" />
				<MenuItem value={1} primaryText="Complete Sprints" />
				<MenuItem value={2} primaryText="Incomplete Sprints" />
				{this.renderSprintList()}
			</SelectField>
			</div>
			
			<div className="uk-width-1-2">
			
			<div style={{textAlign: "right"}}>
				<RaisedButton icon={<PrintIcon />} onClick={() => {
					let printHTML = document.querySelector('#printArea').innerHTML;
					window.frames["print_frame"].document.body.innerHTML=printHTML;
					window.frames["print_frame"].window.focus();
					window.frames["print_frame"].window.print();
				}} primary={true} className="uk-margin-small-top" />&nbsp;
				<RaisedButton icon={<FiltersIcon />} onClick={this.openFiltersPopover} primary={true} className="uk-margin-small-top" />&nbsp;
				<RaisedButton icon={<TableIcon />} onClick={() => {
					let csvData = tasksToCSV(this.getExcelData());
					let blob = new Blob([csvData], {type: "text/plain;charset=utf-8"});
					FileSaver.saveAs(blob, "report.csv");

				}} primary={true} className="uk-margin-small-top" />
			</div>
			
			<Popover open={this.state.filtersPopoverOpen} anchorEl={this.state.anchorEl} onRequestClose={this.closeFiltersPopover}>
			<div className="uk-grid">
			<div className="uk-width-1-2">
			<SelectField value={this.state.completeField} onChange={this.onCompleteChange} floatingLabelText="Status">
			<MenuItem value={0} primaryText="To Do" />
			<MenuItem value={2} primaryText="In Progress" />
			<MenuItem value={1} primaryText="Done" />
			<MenuItem value={3} primaryText="All" />
			</SelectField>
			</div>

			<div className="uk-width-1-2" />
			
			<div className="uk-width-1-1" style={{marginRight: 10}}> 
			<AutoComplete
			searchText={ownerFilter?ownerFilter.value:''}
			dataSource={this.props.Employees.map((employee) => {return employee.username})}
			style={{paddingTop: 0}} fullWidth={true} floatingLabelText="Owner" filter={AutoComplete.fuzzyFilter} openOnFocus={true}
			onUpdateInput = {
				(text) => {
					this.addFilter('owner', text);
				}
			} />
			</div>
			
			</div>
			</Popover>
			
			</div>

			<div id="printArea" style={{padding: 10, paddingTop: 0}} className="uk-width-1-1">
			<hr style={{clear: "both"}}/>
			<hr />
	    	<Table data={this.getData()} />
	    	<div style={{textAlign: 'center', fontWeight: 'bold'}} className="uk-margin-small-top">
	    	<br />
	    		Intended Total Duration: <span style={{color: '#01579B'}}>{this.getDurations().totalDuration}</span> Hours&nbsp;|&nbsp;
	    		Actual Total Duration : <span style={{color: '#01579B'}}>{Math.round(moment.duration(this.getDurations().totalActualDuration).asHours())}</span> Hours
	    	</div>

	    	<iframe name="print_frame" width="0" height="0" frameBorder="0" src="about:blank"></iframe>
	    	</div>
	    	</div>
    	);
	}
}

function mapStateToProps(state){
	return {Employees: state.Employees, AllSprints: state.AllSprints, filters: makeSelectors('ProjectIssuesTable').getFilter(state)};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getEmployeesData: getEmployeesData, tableSetFilter: tableSetFilter, navigateProject: navigateProject, getAllSprints: getAllSprints}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);