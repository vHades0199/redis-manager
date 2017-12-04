import React, { Component, CSSProperties, FormEvent } from 'react';
import { ConnectionState } from '../stores/connectionStore';

type Prop = {
  className?: string,
  connections: ConnectionState,
  getStyleOnFocus: (focus: boolean) => CSSProperties,
  onSubmit: (cmd: string, (res: Object) => void) => void,
};
type State = {
  style: CSSProperties,
  selectConnection: string,
  cmd: string,
  log: string,
};

export default class ExecCommand extends Component<Prop, State> {
  constructor(props: Prop) {
    super(props);

    this.state = {
      style: props.getStyleOnFocus(false),
      selectConnection: props.connections.isEmpty() ? '' : props.connections.first().id,
      cmd: '',
      log: '',
    };
  }

  handleFocus = (focus) => {
    this.setState({
      style: this.props.getStyleOnFocus(focus),
    });
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { cmd, log } = this.state;
    this.setState({
      log: `${log}${cmd}\n`,
    });
    this.props.onSubmit(cmd, (res) => {
      if (res) {
        this.setState({
          log: `${log}${res}\n`,
        });
      }
    });
  };

  handleSelectConnection = (key) => {
    this.setState({
      selectConnection: key,
    });
  };

  handleCmdChange = ({ target: { value } }) => {
    this.setState({ cmd: value });
  };

  render() {
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    const connections = this.props.connections.map(v => v.name).toObject();
    const { className } = this.props;
    return (
      <div
        className={className}
        style={this.state.style}
        onClick={() => this.handleFocus(true)}
        onBlur={() => this.handleFocus(false)}
        onKeyPress={() => {}}
        tabIndex="-1"
        role="presentation"
      >
        <div className="btn-group" data-toggle="buttons">
          {Object.keys(connections).map(k => (
            <label
              className={`btn btn-secondary ${k === this.state.selectConnection ? 'active' : ''}`}
              htmlFor={`selCon-${k}`}
              key={`selCon-${k}`}
              onClick={() => this.handleSelectConnection(k)}
              onKeyPress={() => {}}
            >
              <input
                id={`selCon-${k}`}
                type="radio"
                name="options"
                autoComplete="off"
                value={k}
                checked={k === this.state.selectConnection}
                onChange={({ target: { value } }) => this.handleSelectConnection(value)}
              />
              <span>{connections[k]}</span>
            </label>
          ))}
        </div>
        <pre />
        <form className="py-1" onSubmit={this.handleSubmit}>
          <label htmlFor="command">current Instance:</label>
          <div className="input-group input-group-sm">
            <span className="input-group-addon" id="basic-addon3">
              redis&gt;
            </span>
            <input
              className="form-control"
              id="command"
              aria-describedby="basic-addon3"
              type="text"
              value={this.state.cmd}
              onChange={this.handleCmdChange}
              onFocus={() => this.handleFocus(true)}
            />
            <span className="input-group-btn">
              <button className="btn btn-secondary" type="submit">
                send
              </button>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
