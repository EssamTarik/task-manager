import React, { Component, PropTypes } from 'react';
import sematable, { Table } from 'sematable';
import AppsTableActions from './AppsTableActions';

const columns = [
  { key: 'id', header: 'ID', sortable: true, searchable: true, primaryKey: true },
  { key: 'name', header: 'Application', sortable: true, searchable: true },
  { key: 'role', header: 'Role', sortable: true, searchable: true },
  { key: 'actions', header: 'Actions', Component: AppsTableActions },
];

const propTypes = {
  headers: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  primaryKey: PropTypes.string.isRequired,
};

class AppsTable extends Component {
  render() {
    return (
      <Table
        {...this.props}
        selectable
        columns={columns}
      />
    );
  }
}

AppsTable.propTypes = propTypes;
export default sematable('allApps', AppsTable, columns);