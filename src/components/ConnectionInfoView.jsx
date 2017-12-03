import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConnectionState } from '../stores/connectionStore';
import DataView from '../views/dataView';
import ConnectionTree from '../views/connectionTree';

function updateTree(connections: ConnectionState) {
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

type Prop = {
  connections: ConnectionState,
  className?: string,
  onGetKey: (connectionId: string, key: string, cb: (res: string) => void) => void,
  onSaveKey: (
    connectionId: string,
    key: string,
    content: Object,
    cb: (res: string) => void
  ) => void,
};
type State = {
  tree: Object,
  content: Object | Array | String,
  connectionId: string,
  selectedKey: string,
};
class ConnectionInfoView extends Component<Prop, State> {
  constructor(props: Prop) {
    super(props);

    const state: State = {
      tree: updateTree(props.connections),
      content: null,
    };
    this.state = state;
  }

  componentWillReceiveProps(nextProps: Prop) {
    this.setState({ tree: updateTree(nextProps.connections) });
  }

  handleShowInfo = (raw: string) => {
    const { connections } = this.props;
    this.setState({
      content: connections.get(raw).info,
      connectionId: raw,
      selectedKey: null,
    });
  };

  handleShowKey = (key: string, connectionId: string) => {
    this.props.onGetKey(connectionId, key, (res) => {
      let content = res;
      try {
        content = JSON.parse(content);
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
    this.props.onSaveKey(connectionId, selectedKey, data);
  };

  handleRefresh = () => {
    const { connectionId, selectedKey } = this.state;
    this.props.onGetKey(connectionId, selectedKey, (res) => {
      let content = res;
      try {
        content = JSON.parse(content);
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
          <ConnectionTree
            data={this.state.tree}
            onShowInfo={this.handleShowInfo}
            onShowKey={this.handleShowKey}
          />
        </div>
        <div className="col-9 pl-2 py-2">
          <DataView
            content={this.state.content}
            desc={this.state.selectedKey}
            onChange={this.handleContentChange}
            onSave={this.handleSave}
            onRefresh={this.handleRefresh}
          />
        </div>
      </div>
    );
  }
}
ConnectionInfoView.propTypes = {
  connections: PropTypes.objectOf(ConnectionState).isRequired,
  className: PropTypes.string,
};
ConnectionInfoView.defaultProps = {
  className: '',
};

export default ConnectionInfoView;
