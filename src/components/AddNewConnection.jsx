import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Modal = pugReact`../views/modalAddNewConnection.pug`;

class AddNewConnection extends Component {
  constructor(props) {
    super(props);
    /* eslint-disable react/no-unused-state */
    this.state = {
      db: 0,
      name: 'local',
      port: '6379',
      host: 'localhost',
      password: '',
    };
  }

  handleFieldChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <Modal
        field={this.state}
        onFieldChange={this.handleFieldChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}
AddNewConnection.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddNewConnection;
