import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { JSONTreeProps } from 'react-json-tree';
import request from 'superagent';
import uuid from 'uuid/v4';
import ReactJson from 'react-json-view';

import JSONTree from './BootstrapJSONTree';
import AddNewConnection from '../components/AddNewConnection';
import { ConnectionState } from '../stores/connectionStore';

type Prop = {
  connections: ConnectionState,
  className: string,
};
type State = {
  tree: Object,
  content: Object | Array | String,
};

const treeProps: JSONTreeProps = (handleShowInfo, handleShowKey) => ({
  labelRenderer: (raw: [string, string]) => {
    if (raw[0].indexOf('|') >= 0) {
      const data = raw[0].split('|');
      switch (data[0]) {
        case 'server':
          return (
            <button
              onClick={e => handleShowInfo(data[2], e)}
              className="text-nowrap btn btn-sm btn-primary"
            >
              {data[1]}
            </button>
          );
        case 'key': {
          const serverArgs = raw[raw.length - 1].split('|');
          return (
            <button
              onClick={e => handleShowKey(data[1], serverArgs[2], e)}
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

function DataView(props) {
  if (props.content == null) return null;
  if (props.content instanceof Array) {
    const items = [];
    props.content.forEach(({ key, value }) => {
      const id = uuid();
      items.push(<dt key={id}>{key}</dt>);
      items.push(<dd key={`key:${id}`}>{value}</dd>);
    });
    return <dl>{items}</dl>;
  }
  const viewProps = {
    name: props.selectedKey,
    iconStyle: 'circle',
    onEdit: ({ updated_src }) => {
      props.onChange(updated_src);
    },
    onAdd: ({ updated_src }) => {
      props.onChange(updated_src);
    },
    onDelete: ({ updated_src }) => {
      props.onChange(updated_src);
    },
    onSelect: () => {},
  };
  if (props.content instanceof Object) {
    return <ReactJson src={props.content} {...viewProps} />;
  }

  return (
    <textarea
      className="form-control"
      rows="4"
      value={props.content}
      onChange={({ target: { value } }) => props.onChange(value)}
    />
  );
}
DataView.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedKey: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
};

function getKey(connectionId, key, cb) {
  request
    .post('/api/exec')
    .send({
      connectionId,
      cmd: `GET ${key}`,
    })
    .end(cb);
}

function updateTree(connections) {
  const tree = {};
  connections.forEach((v, k) => {
    const id = `server|${v.name}|${k}`;
    tree[id] = {};
    if (v.keys) {
      tree[id][v.keys[0]] = {};
      v.keys[1].forEach((key) => {
        tree[id][v.keys[0]][`key|${key}`] = '';
      });
    }
  });
  return tree;
}

class ConnectionInfoView extends Component<Prop, State> {
  static propTypes = {
    onAddConnection: PropTypes.func.isRequired,
    connections: PropTypes.instanceOf(ConnectionState).isRequired,
  };

  constructor(props: Prop) {
    super(props);

    this.state = {
      tree: updateTree(props.connections),
      content: null,
    };
  }

  componentWillReceiveProps(nextProps: Prop) {
    this.setState({ tree: updateTree(nextProps.connections) });
  }

  handleClick = () => {};
  handleShowInfo = (raw: string, e) => {
    e.stopPropagation();
    const { connections } = this.props;
    this.setState({
      content: connections.get(raw).info,
      connectionId: raw,
      selectedKey: null,
    });
  };

  handleShowKey = (key: string, connectionId: string) => {
    getKey(connectionId, key, (err, { body }) => {
      let content = body;
      try {
        content = JSON.parse(body);
      } finally {
        this.setState({
          connectionId,
          selectedKey: key,
          content,
        });
      }
    });
  };

  handleContentChange = (content) => {
    this.setState({ content });
  };

  handleSave = () => {
    const { connectionId, selectedKey, content } = this.state;
    const data = content instanceof Object ? JSON.stringify(content) : content;
    request
      .post('/api/exec')
      .send({
        connectionId,
        cmd: `SET ${selectedKey} '${data}'`,
      })
      .end((err, { body }) => {});
  };

  handleRefresh = () => {
    const { connectionId, selectedKey } = this.state;
    getKey(connectionId, selectedKey, (err, { body }) => {
      let content = body;
      try {
        content = JSON.parse(body);
      } finally {
        this.setState({
          content,
        });
      }
    });
  };

  render() {
    return (
      <div className={`row no-gutters no-overflow ${this.props.className}`}>
        <div className="col-3 mh-100">
          <AddNewConnection onSubmit={this.props.onAddConnection} />
          <JSONTree
            data={this.state.tree}
            hideRoot
            {...treeProps(this.handleShowInfo, this.handleShowKey)}
          />
        </div>
        <div className="col-9 pl-1 d-flex flex-column mh-100">
          <div
            className="btn-toolbar flex-no-shrink"
            role="toolbar"
            aria-label="Toolbar with button groups"
          >
            <div className="btn-group mr-2" role="group" aria-label="First group">
              <button type="button" className="btn btn-secondary" onClick={this.handleSave}>
                save
              </button>
              <button type="button" className="btn btn-secondary" onClick={this.handleRefresh}>
                refresh
              </button>
            </div>
          </div>
          <div className="overflow-y flex-grow">
            <DataView {...this.state} onChange={this.handleContentChange} />
          </div>
        </div>
      </div>
    );
  }
}

export default ConnectionInfoView;
