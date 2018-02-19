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
		if(text.toLowerCase().includes(this.state.SearchFilter.toLowerCase()))
			return true;
		else
			return false;
	}
	render(){
		console.log(this.props);
		return (
			<div>
			<div style={{textAlign: "center"}}>Search : <TextField style={{width: "50%"}} id={uuid()} onChange = {this.onSearch} value={this.state.SearchFilter} /></div>
			<Table>
			  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
				  <TableHeaderColumn>Name</TableHeaderColumn>
				</TableRow>
			  </TableHeader>
			  <TableBody displayRowCheckbox={false}>
				{this.props.data.map((team) => {
					if(this.state.SearchFilter != '' && (this.matchText(team.text)))
						return (
							<TableRow key={team.value}>
							  <TableRowColumn><Link to={"/teams/" + team.value}>{team.text}</Link></TableRowColumn>
							</TableRow>
						);
					else if(this.state.SearchFilter == '')
						return (
							<TableRow key={team.value}>
							  <TableRowColumn><Link to={"/teams/" + team.value}>{team.text}</Link></TableRowColumn>
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