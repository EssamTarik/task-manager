import React, {Component} from 'react';
import {connect} from 'react-redux';

class AdminContainer extends Component{
	componentDidMount(){
		if(this.props.LoggedInUser.key && !this.props.LoggedInUser.admin){
			window.location.href = '/';
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.LoggedInUser.key && !nextProps.LoggedInUser.admin){
			window.location.href = '/';
		}
	}
	render(){
		return this.props.children;
	}
}

const mapStateToProps = (state) => {
	return {LoggedInUser: state.LoggedInUser};
}

export default connect(mapStateToProps)(AdminContainer);