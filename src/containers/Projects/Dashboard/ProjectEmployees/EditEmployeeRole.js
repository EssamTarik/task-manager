import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import editRole from '../../../../actions/Employees/editRole';

class EditEmployeeRole extends Component{

	constructor(props){
		super(props);
		this.state = {role: ''};
	}

	componentWillReceiveProps(nextProps){
		if(this.props.open === false && nextProps.open === true){
			this.setState({role: nextProps.person.role})
		}
	}

	getRoleValue(person){
		let role = this.state.role;
		if(person)
			role = person.role;

		switch(role){
			case "employee":
				return 0;
			case "viewer":
				return 1;
			case "leader":
				return 2;
			default:
				return 3;
		}
	}
	setRole(event, index, value){
		let role = '';
		switch(value){
			case 0:
				role = 'employee';
				break;
			case 1:
				role = 'viewer';
				break;
			case 2:
				role = 'leader';
				break;
			case 3:
				role = 'owner';
				break;
			default:
				role = '';
		}
		this.setState({role});

	}
	render(){
		return (
			<Dialog
				title={this.props.person.name}
				autoScrollBodyContent={true}
				modal={false}
				actions={[
					<FlatButton label="Ok" primary={true} onTouchTap={
						() => {
							this.props.editRole(this.props.projectID, this.props.person, this.state.role)
							this.props.onRequestClose();
						}
					} keyboardFocused={true} />,
					<FlatButton label="Cancel" onClick={this.props.onRequestClose} />,
				]}
				open={this.props.open}
				onRequestClose={this.props.onRequestClose} >

				<SelectField disabled={this.props.person.role === 'owner'?true:false} className="uk-margin-small-top" value={this.getRoleValue()} onChange={this.setRole.bind(this)}>
					<MenuItem value={0} primaryText="Employee" />
					<MenuItem value={1} primaryText="Viewer" />
					<MenuItem value={2} primaryText="Leader" />
					{this.props.person.role === 'owner'?<MenuItem value={3} primaryText="Owner" /> : null}
				</SelectField>

			</Dialog>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({editRole}, dispatch);
}

export default connect(null, mapDispatchToProps)(EditEmployeeRole);