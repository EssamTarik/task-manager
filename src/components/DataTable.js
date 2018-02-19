import React, {Component} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router';
import uuid from 'uuid/v4';

let imgColStyle = {width: "20%", textAlign: "center"};
let fill = {};


/*
	so the plan is
	user sends an array first of columns with their styles like
	columns = [name, age, shit]
	styles = {name: {width: '10%'}, age: {}}
	data = [
		{name: 'essam', age: 20},
		{name: essam, age: 21}
	]
*/


class DataTable extends Component{

	constructor(props){
		super(props);
		this.onSearch = this.onSearch.bind(this);
		this.state = {SearchFilter: ""};
	}

	onSearch(event){
		if(!String.prototype.includes){
			String.prototype.includes = function(s){
				return this.indexOf(s) >= 0;
			}
		}
		this.state.SearchFilter = event.target.value;
		this.setState(this.state);
	}
	
	matchText(haystack){
		if(this.state.SearchFilter != ""){
			for(let i=0; i<this.props.cols.length; i++){
				
				let col = this.props.cols[i];
				if(haystack[col].toLowerCase().includes(this.state.SearchFilter.toLowerCase())){
					return true;
				}
			}
			return false;

		}else{
			return true;
		}
	}
	
	render(){
		return (
			<div>
			<div style={{textAlign: "center"}}>Search : <TextField style={{width: "50%"}} id={uuid()} onChange = {this.onSearch} value={this.state.SearchFilter} /></div>
			<Table>
			  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
				{
					this.props.cols.map((col) => {
						return <TableHeaderColumn key={uuid()} style={this.props.styles[col] || {}}>{col}</TableHeaderColumn>;
					})
				}
				</TableRow>
			  </TableHeader>
			  <TableBody displayRowCheckbox={false}>
				{
					this.props.data.map( (obj) => {
						if(this.matchText(obj))
							return (<TableRow key={uuid()}>
								{
									this.props.cols.map( (col) => {
										return <TableRowColumn key={uuid()} style={this.props.styles[col]}>{obj[col]}</TableRowColumn>
									})
								}
							</TableRow>);
					})
				}
			  </TableBody>
			</Table>
			</div>
		);
	}
}

export default DataTable;