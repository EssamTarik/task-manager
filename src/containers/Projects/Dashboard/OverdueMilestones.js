import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getAllSprints from '../../../actions/Tasks/getAllSprints';
import {readDate, readDurationString} from '../../../helpers/date';
import moment from 'moment';

class OverdueMilestones extends Component{
	componentDidMount(){
		this.props.getAllSprints(this.props.projectID);
	}
	getDelay(sprint){
		let duration = -1;
		let postfix = '';
		let className = "";
		let endDate = new Date(sprint.endDate);
		endDate.setHours(0,0,0,0);

		if(sprint.complete){
			if(sprint.completeDate){
				let completeDate = new Date(sprint.completeDate);
				completeDate.setHours(0,0,0,0);

				let endDate = new Date(sprint.endDate);
				endDate.setHours(0,0,0,0);

				duration = moment.duration(endDate.getTime() - completeDate.getTime()).asDays();
				duration = Math.round(duration);
				if(duration >= 0){
					className="uk-text-success"
					postfix = "Early"
				}
			}else{
				return null;
			}
		}else if(sprint.active){
			let today = new Date();
			today.setHours(0,0,0,0);
			duration = moment.duration(endDate.getTime() - today.getTime());
			duration = Math.round(duration.asDays());
			if(duration >= 0){
				className="uk-text-success"
				postfix = "remaining"
			}
		}else{
			return null;
		}
		if(duration < 0){
			className="uk-text-danger"
			postfix = "Delay"
		}

		return <span>&nbsp; | &nbsp;<span className={`uk-text-bold ${className}`}>{`${Math.abs(duration)} day(s) ${postfix}`}</span></span>
	}

	getStatus(sprint){
		let className = "";
		let status = "";

		if(sprint.complete){
			className = "uk-text-success";
			status = "Complete"
		}else if(sprint.active){
			className = "uk-text-warning";
			status = "Active";
		}else{
			className = "uk-text-primary";
			status = "Pending";
		}

		return <span className={`uk-text-bold ${className}`}>{status}</span>

	}

	getTotalDuration(sprint){
		let totalDuration = 0;
		sprint.tasks.forEach((task) => {
			if(task.time)
				totalDuration += parseInt(task.time);
		})
		return totalDuration;
	}

	renderSprints(){
		return this.props.AllSprints.map((sprint) => {
			if(sprint.name)
			return (
				<li key={sprint.key}>
					<div className="uk-grid">
						<div className="uk-width-1-1 uk-margin-small-bottom">
							<h5 style={{color: '#0277BD'}} className="uk-text-bold">{sprint.name} | <span style={{color: 'white', backgroundColor: '#0277BD', padding: 2, fontWeight: 'normal'}} className="uk-border-rounded">{this.getTotalDuration(sprint)} hr</span></h5>
						</div>
						<div className="uk-width-1-1">
							Status: {this.getStatus(sprint)}
						</div>
						<div className="uk-width-1-1">
						Start: <span className='uk-text-bold'>{readDate(new Date(sprint.startDate))}</span>,
						&nbsp;
						End(estimated): <span className='uk-text-bold'>{readDate(new Date(sprint.endDate))}</span>
						
						{this.getDelay(sprint)}
						</div>
						{sprint.complete && sprint.completeDate ?(
							<div>
								Delivered at: <span className='uk-text-bold'>{readDate(new Date(sprint.completeDate))}</span>
							</div>
						) : null}
						<div className="uk-width-1-1">

						</div>
					</div>
				</li>
			);
		})
	}
	render(){
		return (
				<ul className="uk-margin-small-left uk-list uk-list-striped uk-list-line">
					{this.renderSprints()}
				</ul>
		);
	}
}

const mapStateToProps = (state) => {
	return {AllSprints: state.AllSprints};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({getAllSprints}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OverdueMilestones);