import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import {storage} from '../../../../api/firebaseAPI';

let prevFile = JSON.stringify({});

class FileDialog extends Component{
	constructor(props){
		super(props);
		this.state = {fileURL: "", status: 0};
		this.setFileURL = this.setFileURL.bind(this);
		this.setFileNotFound = this.setFileNotFound.bind(this);
	}
	componentDidMount(){
		if(this.state.fileURL != this.props.fileURL)
			this.getFileURL();
	}
	componentDidUpdate(){
		if(prevFile != JSON.stringify(this.props.file)){
			prevFile = JSON.stringify(this.props.file);
			this.getFileURL();
		}
	}
	setFileURL(url){
		this.setState({fileURL: url, status: 2});
	}
	setFileNotFound(){
		this.setState({status: 1});
	}
	getFileURL(){
		this.setState({status: 0});
		if(this.props.file && this.props.file.key && this.props.file.name){
			storage.ref(`sprints/${this.props.file.key}/${this.props.file.name}`).getDownloadURL().then(this.setFileURL).catch(this.setFileNotFound);
		}
	}
	renderDownloadArea(){
		if(this.state.status == 0){
			return <p>generating file url, please wait ...</p>
		}else if(this.state.status == 1){
			return <p>Error, File not found</p>
		}else{
			return <a target="_blank" href={this.state.fileURL}><RaisedButton primary={true} label="Download"/></a>;
		}
	}
	render(){
		return (
				<Dialog
					title={`File: ${this.props.file.name}`}
					open={this.props.open}
					modal={false}
					onRequestClose={this.props.onRequestClose}
					>
				{this.props.preview ? <img style={{width: 200, height: 200}} alt={this.props.file.name} src={this.props.preview} /> : null}
				<div style={{textAlign: "center"}} >
					{this.renderDownloadArea()}
				</div>

				</Dialog>
		);
	}
}

export default FileDialog;