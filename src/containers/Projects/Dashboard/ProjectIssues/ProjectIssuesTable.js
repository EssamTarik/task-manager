import React, { Component, PropTypes } from 'react';
import sematable, { Table } from 'sematable';
import {CompleteProgressBar,TasksProgressBar, URL, PriorityView, StatusView, TaskDuration} from './TableComponents';
import MediaQuery from 'react-responsive';

const columns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'task', header: 'Task', sortable: true, searchable: true},
  { key: 'status', header: 'Status', sortable: true, Component: StatusView},
  { key: 'owner', header: 'Owner', sortable: true, searchable: true },
  { key: 'sprint', header: 'Sprint', sortable: true, searchable: true },
  { key: 'priority', header: 'Priority', sortable: true, searchable: true, Component: PriorityView},
  { key: 'start', header: 'Start', sortable: true, searchable: true },
  { key: 'due', header: 'Due', sortable: true, searchable: true },
  { key: 'time', header: 'Duration', sortable: true, searchable: true, Component: TaskDuration },
  { key: 'duration', header: 'Actual Duration', sortable: true, searchable: true },
];


const smColumns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'task', header: 'Task', sortable: true, searchable: true },
  { key: 'status', header: 'Status', sortable: true, Component: StatusView},
  { key: 'owner', header: 'Owner', sortable: true, searchable: true },
];


const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
};

class ProjectIssuesTable extends Component {
  render() {
    return (
      <div>
      <MediaQuery query="(min-width: 600px)">
      <Table
        {...this.props}
        columns={columns}
      />
      </MediaQuery>
      <MediaQuery query="(max-width: 599px)">
      <Table
        {...this.props}
        columns={smColumns}
      />
      </MediaQuery>
      </div>
      
    );
  }
}

ProjectIssuesTable.propTypes = propTypes;
export default sematable('ProjectIssuesTable', ProjectIssuesTable, columns, {showFilter: false});