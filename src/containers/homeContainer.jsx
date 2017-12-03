import React, { CSSProperties } from 'react';
import { Container } from 'flux/utils';
import request from 'superagent';

import ConnectionStore, { ConnectionState } from '../stores/connectionStore';
import ConnectionInfoView from '../components/ConnectionInfoView';
import ExecCommand from '../components/ExecCommand';

function onCmdFocus(focus: boolean) {
  const style: CSSProperties = {
    flex: '0 0 0%',
    flexBasis: '0%',
    transition: 'flex-basis 1s ease-in-out',
  };
  if (focus) {
    return { ...style, flexBasis: '50%' };
  }
  return style;
}

function onGetKey(connectionId: string, key: string, cb: (res: string) => void) {
  request
    .post('/api/exec')
    .send({
      connectionId,
      cmd: `GET ${key}`,
    })
    .end((err, { body }) => {
      cb(body);
    });
}

function onSaveKey(connectionId: string, key: string, content: Object, cb: (res: string) => void) {
  request
    .post('/api/exec')
    .send({
      connectionId,
      cmd: `SET ${key} '${content}'`,
    })
    .end((err, { body }) => {
      if (!err) cb(body);
    });
}

function getStores() {
  return [ConnectionStore];
}

function getState() {
  const connections = ConnectionStore.getState();

  return {
    connections,
    onCmdFocus,
    onGetKey,
    onSaveKey,
  };
}

type State = {
  connections: ConnectionState,
  onCmdFocus: (focus: boolean) => CSSProperties,
  getKey: (connectionId: string, key: string, cb: (res: string) => void) => void,
  onSaveKey: (
    connectionId: string,
    key: string,
    content: Object,
    cb: (res: string) => void
  ) => void,
};

const View = (props: State) => (
  <div className="d-flex flex-column flex-grow">
    <ConnectionInfoView
      {...props}
      className="flex-grow border border-secondary border-top-0 border-right-0 border-left-0"
    />
    <ExecCommand {...props} className="container-fluid pt-1" getStyleOnFocus={props.onCmdFocus} />
  </div>
);

export default Container.createFunctional(View, getStores, getState);
