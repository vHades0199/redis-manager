import React, { Component, ReactElement } from 'react';
import PropTypes from 'prop-types';

const Modal: ?ReactElement<*> = pugReact`../views/modalAddNewConnection.pug`;

type HTMLAttributes = {
  className?: string, // eslint-disable-line react/require-default-props
  target: string,
};
export function ButtonNewConnection({ className = '', target }: HTMLAttributes): ?ReactElement<*> {
  return (
    <button data-target={`#${target}`} className={className} type="button" data-toggle="modal">
      <i className="fa fa-info mr-1" />add connect...
    </button>
  );
}
export function LinkNewConnection({ className = '', target }: HTMLAttributes): ?ReactElement<*> {
  return (
    <a href={`#${target}`} className={className} data-toggle="modal">
      <i className="fa fa-info mr-1" />add connect...
    </a>
  );
}

class AddNewConnection extends Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props) {
    super(props);
    /* eslint-disable react/no-unused-state */
    this.state = {
      db: 0,
      url: '',
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
        id={this.props.id}
        className={this.props.className}
        field={this.state}
        onFieldChange={this.handleFieldChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default AddNewConnection;
