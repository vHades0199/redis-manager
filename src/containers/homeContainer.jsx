import React, { CSSProperties } from 'react';
import { Container } from 'flux/utils';
import request from 'superagent';

import { ConnectionInfo } from '../actions/connectionAction';
import Dispatcher from '../dispatchers/homeDispatcher';
import ConnectionStore from '../stores/connectionStore';
import ConnectionInfoView from '../components/ConnectionInfoView';
import ExecCommand from '../components/ExecCommand';

type RedisConnectionInfo = {
  name: string,
  db: number,
  host: string,
  url: string,
  password: string,
};

function onAddConnection(data: RedisConnectionInfo) {
  request
    .post('/api/info')
    .send(data)
    .end((err, res: { body: ConnectionInfo }) => {
      if (!err) {
        const info = res.body;
        Dispatcher.dispatch({
          type: 'add',
          id: info.id,
          data: { ...info, name: data.name },
        });
        request
          .post('/api/exec')
          .send({
            connectionId: info.id,
            cmd: 'SCAN 0 MATCH * COUNT 100',
          })
          .end((error, { body }) => {
            if (!error) {
              Dispatcher.dispatch({
                type: 'scan',
                id: info.id,
                data: body,
              });
            }
          });
      }
    });
}

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

function getStores() {
  return [ConnectionStore];
}

function getState() {
  const connections = ConnectionStore.getState();

  return {
    connections,
    onAddConnection,
    onCmdFocus,
  };
}

type State = {
  onCmdFocus: (focus: boolean) => CSSProperties,
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
