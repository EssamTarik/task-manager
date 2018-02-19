import React, {Component} from 'react';

let dropStyle = {paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, borderColor: "#E0E0E0", borderStyle: "dashed"};
let taskClass = "uk-panel uk-panel-box uk-panel-box-primary uk-border-rounded uk-grid";
let taskStyle = {cursor: "move", margin: 3};


class SprintContainer extends Component{
	render(){
		return (
			<div id={this.props.key} ref={this.props.addComponent} style={dropStyle} >
			{
				this.props.sprint.tasks.map((task) => {
					return(
						<div onClick={() => this.props.openEditTaskDialog(task, `${sprint.key}/tasks`)} key={task.key} style={taskStyle} className={taskClass} id={task.key} key={task.key}>
						<div style={{paddingLeft: 0}} className="uk-width-1-2">{this.readTaskPriority(task.priority)} {task.name}</div>
						<div style={{textAlign: "right"}} className="uk-width-1-2">{this.readTaskIcon(task.type)}{this.getPersonName(task.owner.key)}</div>
						</div>
					);
				})
			}
			</div>
		);
	}
}

export default SprintContainer;