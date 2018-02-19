import React, { Component, PropTypes } from 'react';
import sematable, { Table } from 'sematable';
import {UserState} from './TableComponents';
import MediaQuery from 'react-responsive';

const columns = [
  { key: 'email', header: 'Email', sortable: true, searchable: true, primaryKey: true },
  { key: 'username', header: 'User', sortable: true, searchable: true},
  { key: 'position', header: 'Position', sortable: true, searchable: true},
  { key: 'state', header: 'State', sortable: true, searchable: true, Component: UserState},
];

const smColumns = [
  { key: 'email', header: 'Email', sortable: true, searchable: true, primaryKey: true },
  { key: 'username', header: 'User', sortable: true, searchable: true},
  { key: 'state', header: 'State', sortable: true, searchable: true, Component: UserState},
];


const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
};

class UsersTable extends Component {
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

UsersTable.propTypes = propTypes;
export default sematable('AdminUsersTable', UsersTable, columns);