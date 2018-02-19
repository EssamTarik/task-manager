import React, { Component, PropTypes } from 'react';
import sematable, { Table } from 'sematable';
import {CompleteProgressBar,TasksProgressBar, URL, remainingDays, SprintProgressBar, DateView, TaskTypeIcon, UserImage, StatusView} from './TableComponents';

const columns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'type', header: 'Type', sortable: true, Component: TaskTypeIcon},
  { key: 'status', header: 'Status', sortable: true, Component: StatusView},
  { key: 'time', header: 'Time', sortable: true, searchable: true, Component: DateView},
  { key: 'image', header: 'User', Component: UserImage},
  { key: 'taskName', header: 'Task', sortable: true, searchable: true },
];


const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
};

class LogTable extends Component {
  render() {
    return (
      <div>
      <Table
        {...this.props}
        columns={columns}
      />
      </div>
      
    );
  }
}

LogTable.propTypes = propTypes;
export default sematable('MinimalFeedsTable', LogTable, columns, {autoHidePagination: true, showFilter: false, showPageSize: false});