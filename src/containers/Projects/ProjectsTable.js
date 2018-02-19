import React, { Component, PropTypes } from 'react';
import sematable, { Table } from 'sematable';
import {CompleteProgressBar,TasksProgressBar, URL, remainingDays, SprintProgressBar} from './TableComponents';
import MediaQuery from 'react-responsive';

const columns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'name', header: 'Project', sortable: true, searchable: true, Component: URL},
  { key: 'completion', header: 'Complete %', sortable: true, Component: CompleteProgressBar },
  { key: 'owner', header: 'Owner', sortable: true, searchable: true },
  // { key: 'tasks', header: 'Tasks', sortable: true, searchable: true, Component: TasksProgressBar },
  { key: 'sprint', header: 'Sprint', sortable: true, searchable: true, Component: SprintProgressBar },
  { key: 'startDate', header: 'Start Date', sortable: true, searchable: true },
  { key: 'endDate', header: 'End Date', sortable: true, searchable: true },
  { key: 'remainingDays', header: 'Remaining Days', sortable: true, searchable: true, Component: remainingDays },
];

const UnclickableColumns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'name', header: 'Project', sortable: true, searchable: true},
  { key: 'completion', header: 'Complete %', sortable: true, Component: CompleteProgressBar },
  { key: 'owner', header: 'Owner', sortable: true, searchable: true },
  // { key: 'tasks', header: 'Tasks', sortable: true, searchable: true, Component: TasksProgressBar },
  { key: 'sprint', header: 'Sprint', sortable: true, searchable: true, Component: SprintProgressBar },
  { key: 'startDate', header: 'Start Date', sortable: true, searchable: true },
  { key: 'endDate', header: 'End Date', sortable: true, searchable: true },
  { key: 'remainingDays', header: 'Remaining Days', sortable: true, searchable: true, Component: remainingDays },
];


const smColumns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'name', header: 'Project', sortable: true, searchable: true, Component: URL },
  { key: 'completion', header: 'Complete %', sortable: true, Component: CompleteProgressBar },
  // { key: 'lead', header: 'Leader', sortable: true, searchable: true },
];

const UnclickableSmColumns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'name', header: 'Project', sortable: true, searchable: true},
  { key: 'completion', header: 'Complete %', sortable: true, Component: CompleteProgressBar },
  // { key: 'lead', header: 'Leader', sortable: true, searchable: true },
];


const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
};

class AppsTable extends Component {
  render() {
    return (
      <div>
      <MediaQuery query="(min-width: 600px)">
      <Table
        {...this.props}
        columns={this.props.disabled?UnclickableColumns:columns}
      />
      </MediaQuery>
      <MediaQuery query="(max-width: 599px)">
      <Table
        {...this.props}
        columns={this.props.disabled?UnclickableSmColumns:smColumns}
      />
      </MediaQuery>
      </div>
      
    );
  }
}

AppsTable.propTypes = propTypes;
export default sematable('allApps', AppsTable, columns);