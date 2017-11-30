import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONTree from './BootstrapJSONTree';

import AddNewConnection from '../components/AddNewConnection';
import { ConnectionState } from '../stores/connectionStore';

type Prop = {
  connections: ConnectionState,
};

class ConnectionInfoView extends Component<Prop> {
  static propTypes = {
    onAddConnection: PropTypes.func.isRequired,
    connections: PropTypes.instanceOf(ConnectionState).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleClick = () => {};
  handleShowInfo = (raw: string) => {
    this.setState({
      showInfo: true,
      currentId: raw,
    });
  };
  render() {
    const { connections } = this.props;
    const tree = {};
    connections.forEach((item, key) => {
      tree[`server|${item.name}|${key}`] = {};
    });
    const labelRenderer = (raw: [string]) => {
      if (raw[0].startsWith('server')) {
        const data = raw[0].split('|');
        return (
          <button
            onClick={() => this.handleShowInfo(data[2])}
            className="text-nowrap btn btn-sm btn-primary"
          >
            {data[1]}
          </button>
        );
      }
      return <strong>{raw}</strong>;
    };
    const getItemString = (type, data, itemType, itemString) => (
      <span className="text-nowrap">
        {itemType} <strong className="badge badge-secondary">{itemString}</strong>
      </span>
    );

    let infoView = null;
    if (this.state.currentId) {
      const data = connections.get(this.state.currentId);
      const items = [];
      data.info.forEach(({ key, value }) => {
        items.push(<dt>{key}</dt>);
        items.push(<dd>{value}</dd>);
      });
      infoView = <dl>{items}</dl>;
    }
    return (
      <div className="row h-100">
        <div className="col-3 border border-secondary border-top-0 border-bottom-0 border-left-0">
          <AddNewConnection onSubmit={this.props.onAddConnection} />
          <JSONTree
            data={tree}
            hideRoot
            getItemString={getItemString}
            labelRenderer={labelRenderer}
          />
        </div>
        <div className="col-9 h-100 overflow-y">{this.state.showInfo && infoView}</div>
      </div>
    );
  }
}

export default ConnectionInfoView;
