import React, {Component} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router';
import uuid from 'uuid/v4';

let imgColStyle = {width: "20%", textAlign: "center"};
let fill = {};

class DataTable extends Component{

	constructor(props){
		super(props);
		this.onSearch = this.onSearch.bind(this);
		this.state = {SearchFilter: ""};
	}

	onSearch(event){
		this.state.SearchFilter = event.target.value;
		this.setState(this.state);
	}
	matchText(text){
		if(!String.prototype.includes){
			String.prototype.includes = function(s){
				return this.indexOf(s) >= 0;
			}
		}
		if(text.toLowerCase().includes(this.state.SearchFilter.toLowerCase()))
			return true;
		else
			return false;
	}
	shouldComponentUpdate(nextProps, nextState){
		if(nextProps.focused){
			return true;
		}else{
			return false;
		}
	}
	render(){
		return (
			<div>
			<div style={{textAlign: "center"}}>Search : <TextField style={{width: "50%"}} id={uuid()} onChange = {this.onSearch} value={this.state.SearchFilter} /></div>
			<Table>
			  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
				  <TableHeaderColumn style={imgColStyle}>Image</TableHeaderColumn>
				  <TableHeaderColumn>Name</TableHeaderColumn>
				  <TableHeaderColumn>Position</TableHeaderColumn>
				  <TableHeaderColumn>Email</TableHeaderColumn>
				</TableRow>
			  </TableHeader>
			  <TableBody displayRowCheckbox={false}>
				{this.props.data.map((employee) => {
					if(this.state.SearchFilter != '' && (this.matchText(employee.username) || this.matchText(employee.position) || this.matchText(employee.email) ))
						return (
							<TableRow key={employee.id}>
							  <TableRowColumn style={imgColStyle}><Avatar src={this.props.images[employee.id]} /></TableRowColumn>
							  <TableRowColumn><a onClick={(event) => {this.props.openModal(employee)}}>{employee.username}</a></TableRowColumn>
							  <TableRowColumn>{employee.position}</TableRowColumn>
							  <TableRowColumn>{employee.email}</TableRowColumn>
							</TableRow>
						);
					else if(this.state.SearchFilter == '')
						return (
							<TableRow key={employee.id}>
							  <TableRowColumn style={imgColStyle}><Avatar src={this.props.images[employee.id]} /></TableRowColumn>
							  <TableRowColumn><a onClick={(event) => {this.props.openModal(employee)}}>{employee.username}</a></TableRowColumn>
							  <TableRowColumn>{employee.position}</TableRowColumn>
							  <TableRowColumn>{employee.email}</TableRowColumn>
							</TableRow>
						);
				})}
			  </TableBody>
			</Table>
			</div>
		);
	}
}

export default DataTable;