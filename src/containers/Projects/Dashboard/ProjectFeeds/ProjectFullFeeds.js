import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import uuid from 'uuid/v4';
import FeedsTable from './FeedsTable';

class ProjectFullFeeds extends Component{
	componentDidUpdate(prevProps, prevState){
		//this is to avoid wrong material-ui dialog's position (too much padding-top)
		if(prevProps.open === false && this.props.open === true)
			setTimeout(() => {window.dispatchEvent(new Event('resize'));}, 0);
	}
	render(){
		return (
			<Dialog
				contentStyle={{width: "90%", maxWidth: "none"}}
				open={this.props.open}
				title="Full Feeds"
				actions={<FlatButton onClick={this.props.onRequestClose} onTouchTap={this.props.onRequestClose} label="Exit" primary={true} keyboardFocused={true} />}
				modal={false}
				onRequestClose={this.props.onRequestClose}
				autoScrollBodyContent={true}>

			<div style={{paddingTop: 20}}>
			{/*<Table style={{height: "100%"}}>
			  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				<TableRow>
					<TableHeaderColumn style={{width: "20%"}}>Time</TableHeaderColumn>
					<TableHeaderColumn>Event</TableHeaderColumn>
				</TableRow>
			  </TableHeader>
			  <TableBody displayRowCheckbox={false}>
			  		{
			  			this.props.data.map((event) => {
			  				return (
				  				<TableRow key={uuid()}>
			  					<TableHeaderColumn style={{width: "20%"}}>{event.time}</TableHeaderColumn>
			  					<TableHeaderColumn>{event.text}</TableHeaderColumn>
			  					</TableRow>
			  				);
			  			})
			  		}
			  </TableBody>
			</Table>*/}
			<FeedsTable data={this.props.data} />
			</div>
			</Dialog>
		);
	}
}

export default ProjectFullFeeds;