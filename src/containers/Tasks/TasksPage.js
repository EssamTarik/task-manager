import React, {Component} from 'react';
import Dragula from 'react-dragula';
import {Card, CardHeader} from 'material-ui/Card';
import getTasks from '../../actions/getTasks';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import {bindActionCreators} from 'redux';
import 'dragula/dist/dragula.min.css';

class Tasks extends Component{
	constructor(props){
		super(props);
		this.components = [];	
		this.addComponent = this.addComponent.bind(this);
		this.readTasks = this.readTasks.bind(this)
		this.props.getTasks();
		this.dragulaDecorator = this.dragulaDecorator.bind(this);
	}
	addComponent(component){
		this.components.push(component);
	}
	dragulaDecorator(components){
		let thismoveTask = this.moveTask;
		if(components){
			let dragula = Dragula(components, {});
			dragula.on('drop', (el, target, source, sibling) => {
				thismoveTask(source.id, target.id, el.id);
			});
		}
	}
	componentDidMount(){
		this.dragulaDecorator(this.components)
	}
	readTasks(column){
		try{
			return this.props.Tasks[column].map((task) => {
				return <Paper style={{padding: 3, margin: 3}} id={task.key} key={task.key}><h6>{task.name}</h6></Paper>
			})
		}catch(e){return null}
	}
	moveTask(source, target, id){
		console.log(source);
		console.log(target);
		console.log(id);
	}
	render(){
		return(
			<div style={{cursor: "-webkit-grab"}} className="uk-grid uk-margin-small-top uk-margin-small-left uk-margin-small-right">
				<div className="uk-width-1-3">
				<center><h3>To Do</h3></center>
				</div>
				<div className="uk-width-1-3">
				<center><h3>In Progress</h3></center>
				</div>
				<div className="uk-width-1-3">
				<center><h3>Done</h3></center>
				</div>

				<pre style={{paddingLeft: 2, paddingRight: 2}} id="todo" ref={this.addComponent} className="uk-width-1-3">
					{this.readTasks('todo')}
				</pre>
				<pre style={{paddingLeft: 2, paddingRight: 2}} id="inprogress" ref={this.addComponent} className="uk-width-1-3">
					{this.readTasks('inprogress')}
				</pre>
				<pre style={{paddingLeft: 2, paddingRight: 2}} id="done" ref={this.addComponent} className="uk-width-1-3">
					{this.readTasks('done')}
				</pre>
			</div>
		);
	}
}

function mapStateToProps(state){
	console.log(state.Tasks);
	return {Tasks: state.Tasks};
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({getTasks: getTasks}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);