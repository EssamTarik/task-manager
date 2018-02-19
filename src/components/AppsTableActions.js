import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

const propTypes = {
  row: PropTypes.object.isRequired,
};

class AppsTableActions extends Component {
  render() {
    const row = this.props.row;
    return (
      <Link to={`/settings/${row.id}`}>
        Settings
      </Link>
    );
  }
}
AppsTableActions.propTypes = propTypes;
export default AppsTableActions;