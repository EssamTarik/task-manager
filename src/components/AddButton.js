import React, {Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FontIcon from 'material-ui/FontIcon';

let bottomLeft = {position: 'fixed', right: 20, bottom: 20, zIndex: 1000}

class AddButton extends Component{
	render(){
		if(this.props.iconClassName)
			return (
				<FloatingActionButton disabled={this.props.disabled} onClick = {this.props.onClick} style={this.props.style?this.props.style:bottomLeft}>
				<FontIcon className={this.props.iconClassName} />
				</FloatingActionButton>
			);
		else if(this.props.svgIcon)
			return (
				<FloatingActionButton disabled={this.props.disabled} onClick = {this.props.onClick} style={this.props.style?this.props.style:bottomLeft}>
					{this.props.svgIcon}
				</FloatingActionButton>	
			);
		else
			return (
				<FloatingActionButton disabled={this.props.disabled} onClick = {this.props.onClick} style={this.props.style?this.props.style:bottomLeft}>
					<ContentAdd />
				</FloatingActionButton>
			);
	}
}

export default AddButton;