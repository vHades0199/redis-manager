import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { JSONTreeProps } from 'react-json-tree';
import request from 'superagent';
import uuid from 'uuid/v4';

import JSONTree from './BootstrapJSONTree';
import AddNewConnection from '../components/AddNewConnection';
import { ConnectionState } from '../stores/connectionStore';

type Prop = {
  connections: ConnectionState,
};
type State = {
  tree: Object,
  contentType: string,
  content: Object,
};

const treeProps: JSONTreeProps = (handleShowInfo, handleShowKey) => ({
  labelRenderer: (raw: [string, string]) => {
    if (raw[0].indexOf('|') >= 0) {
      const data = raw[0].split('|');
      switch (data[0]) {
        case 'server':
          return (
            <button
              onClick={() => handleShowInfo(data[2])}
              className="text-nowrap btn btn-sm btn-primary"
            >
              {data[1]}
            </button>
          );
        case 'key': {
          const serverArgs = raw[raw.length - 1].split('|');
          return (
            <button
              onClick={() => handleShowKey(data[1], serverArgs[2])}
              className="text-nowrap btn btn-sm btn-primary"
            >
              {data[1]}
            </button>
          );
        }
        default:
          break;
      }
    }
    return <strong>{raw[0]}</strong>;
  },
  getItemString: (type, data, itemType, itemString) => (
    <span className="text-nowrap">
      {itemType} <strong className="badge badge-secondary">{itemString}</strong>
    </span>
  ),
});

function DataView(props: State) {
  switch (props.contentType) {
    case 'array': {
      const items = [];
      props.content.forEach(({ key, value }, inx) => {
        const id = uuid();
        items.push(<dt key={id}>{key}</dt>);
        items.push(<dd key={`key:${id}`}>{value}</dd>);
      });
      return <dl>{items}</dl>;
    }
    default:
      return <pre>{props.content}</pre>;
  }
}

class ConnectionInfoView extends Component<Prop, State> {
  static propTypes = {
    onAddConnection: PropTypes.func.isRequired,
    connections: PropTypes.instanceOf(ConnectionState).isRequired,
  };

  constructor(props: Prop) {
    super(props);

    this.state = {
      tree: {},
      contentType: 'text',
      content: '',
    };
  }
  componentWillReceiveProps(nextProps: Prop) {
    const tree = {};
    nextProps.connections.forEach((v, k) => {
      const id = `server|${v.name}|${k}`;
      tree[id] = {};
      if (v.keys) {
        tree[id][v.keys[0]] = {};
        v.keys[1].forEach((key) => {
          tree[id][v.keys[0]][`key|${key}`] = '';
        });
      }
    });
    this.setState({ tree });
  }
  handleClick = () => {};
  handleShowInfo = (raw: string) => {
    const { connections } = this.props;
    this.setState({
      contentType: 'array',
      content: connections.get(raw).info,
    });
  };

  handleShowKey = (key: string, connectionId) => {
    request
      .post('/api/exec')
      .send({
        connectionId,
        cmd: `GET ${key}`,
      })
      .end((err, { body }) => {
        this.setState({
          contentType: 'text',
          content: body,
        });
      });
  };
  render() {
    return (
      <div className="row h-100">
        <div className="col-3 border border-secondary border-top-0 border-bottom-0 border-left-0">
          <AddNewConnection onSubmit={this.props.onAddConnection} />
          <JSONTree
            data={this.state.tree}
            hideRoot
            {...treeProps(this.handleShowInfo, this.handleShowKey)}
          />
        </div>
        <div className="col-9 h-100 overflow-y">
          <DataView {...this.state} />
        </div>
      </div>
    );
  }
}

export default ConnectionInfoView;
