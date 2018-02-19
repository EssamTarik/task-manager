import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import SelectField from 'material-ui/SelectField';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/editor/insert-drive-file';
import {blue500, yellow600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getAttachmentsFolders from '../../../../actions/Attachments/getAttachmentsFolders';
import navigateProject from '../../../../actions/Routing/navigateProject';
import MenuItem from 'material-ui/MenuItem';
import FileDialog from './FileDialog';
import {storage} from '../../../../api/firebaseAPI';

let ismounted = false;

class ListExampleFolder extends Component {
	constructor(props){
		super(props);
		this.state = {previews: {}, selectedSprint: null, SprintNames: {}, taskKey: null, fileDialogOpen: false, selectedFile: false};
		this.setSelectedSprint = this.setSelectedSprint.bind(this);
		this.openFileDialog = this.openFileDialog.bind(this);
		this.closeFileDialog = this.closeFileDialog.bind(this);
	}
	componentWillUnmount(){
		ismounted = false;
	}
	componentDidMount(){
		ismounted = true;
		this.props.navigateProject(5);
		this.props.getAttachmentsFolders(this.props.params.id, (attachments) => {
			let allFiles = [];
			let keys = Object.keys(attachments);
			let imageRegex = /^(.*)\.(png|jpg|gif|jpeg)$/i;
			keys.map((key) => {
				let folders = attachments[key];
				Object.keys(folders).map((folderKey) => {
					let folder = folders[folderKey];
					folder.files.map((file) => {
						if(imageRegex.test(file))
							allFiles.push(`${folder.key}/${file}`);
					})
				});
			})
			this.getImagePreviews(allFiles);
		});
	}
	getImagePreviews(allFiles){
		let fetchedFiles = 0;
		let previews = Object.assign({}, this.state.previews);
		allFiles.forEach((file, i) => {
			storage.ref(`sprints/${file}`).getDownloadURL().then((url) => {
				previews[file] = url;
	
				if(++fetchedFiles === allFiles.length && ismounted)
					this.setState({previews});
			})
		})
	}
	getTaskName(taskKey){
		if(this.props.TaskNames[this.state.selectedSprint]){
			return this.props.TaskNames[this.state.selectedSprint][taskKey];
		}
		else
			return "";
	}
	setSelectedTask(taskKey){
		this.setState({selectedTask: taskKey})
	}
	setSelectedFile(file){
		this.setState({selectedFile: file})
		this.openFileDialog();
	}
	openFileDialog(){
		this.setState({fileDialogOpen: true});
	}
	closeFileDialog(){
		this.setState({fileDialogOpen: false});
	}
	renderFolders(){
		if(this.props.Attachments && this.state.selectedSprint && this.props.TaskNames){
			let tasks = Object.keys(this.props.Attachments[this.state.selectedSprint]);
			return (
				<List>
					<Subheader inset={true}>Tasks</Subheader>
					{tasks.map((taskKey) => {
						return (
							<ListItem
							key={taskKey}
							leftAvatar={<Avatar icon={<FileFolder />} />}
							rightIcon={<ActionInfo />}
							onClick = {() => {this.setSelectedTask(taskKey)}}
							primaryText={this.getTaskName(taskKey)}
							/>
						);
					})}
				</List>
			);
		}else{
			return (
				<List>
					<Subheader inset={true}>Tasks</Subheader>
				</List>
			);
		}
	}
	getFiles(){
		try{
			let files = this.props.Attachments[this.state.selectedSprint][this.state.selectedTask].files;
			let attachmentKey = this.props.Attachments[this.state.selectedSprint][this.state.selectedTask].key;
			return files.map((file, i) => {
				return (
					<ListItem
					key={`${this.state.selectedTask}-${i}`}
					leftAvatar={this.state.previews.hasOwnProperty(`${attachmentKey}/${file}`)?<Avatar src={this.state.previews[`${attachmentKey}/${file}`]} /> : <Avatar icon={<ActionAssignment />} backgroundColor={yellow600}/>}
					rightIcon={<ActionInfo />}
					primaryText={file}
					onTouchTap={() => {this.setSelectedFile({key: attachmentKey, name: file})}}
					/>
				);
			})
		}catch(e){
			// console.log(e);
			return null;
		}
	}
	renderFiles(){
		return (
			<List>
				<Subheader inset={true}>Files</Subheader>
				{this.getFiles()}
			</List>
		);
	}
	componentDidUpdate(){
		if(this.state.selectedSprint == null && Object.keys(this.props.SprintNames).length > 0){
			this.setState({selectedSprint: Object.keys(this.props.SprintNames)[0]})
		}
	}
	setSelectedSprint(event, index, value){
		this.setState({selectedSprint: value});
	}
	render(){
		return (
			<div className="uk-grid">
			<div className="uk-width-1-1">
				<SelectField value={this.state.selectedSprint} onChange={this.setSelectedSprint} floatingLabelText="Sprint">
					{
						Object.keys(this.props.Attachments).map((sprintKey) => {
							return <MenuItem value={sprintKey} primaryText={this.props.SprintNames[sprintKey]} key={sprintKey} />
						})
					}
				</SelectField>
			</div>
			<div className="uk-width-1-2">
			{this.renderFolders()}
			</div>
			<div className="uk-width-1-2">
			{this.renderFiles()}
			</div>
			<FileDialog
				open={this.state.fileDialogOpen}
				onRequestClose={this.closeFileDialog}
				file={this.state.selectedFile}
				preview={this.state.previews.hasOwnProperty(`${this.state.selectedFile.key}/${this.state.selectedFile.name}`)?this.state.previews[`${this.state.selectedFile.key}/${this.state.selectedFile.name}`] : null}
				/>

			</div>
		);
	}
}

function mapStateToProps(state){
	// console.log('new tasks');console.log(state.TaskNames);
	return {Attachments: state.Attachments, TaskNames: state.TaskNames, SprintNames: state.SprintNames};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({navigateProject: navigateProject, getAttachmentsFolders: getAttachmentsFolders}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ListExampleFolder);