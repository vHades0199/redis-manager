import React from 'react';
import { Container } from 'flux/utils';
import request from 'superagent';

import { ConnectionInfo } from '../actions/connectionAction';
import Dispatcher from '../dispatchers/homeDispatcher';
import ConnectionStore from '../stores/connectionStore';
import ConnectionInfoView from '../components/ConnectionInfoView';

interface RedisConnectionInfo {
  name: string;
  db: number;
  host: string;
  url: string;
  password: string;
}

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

function getStores() {
  return [ConnectionStore];
}

function getState() {
  const connections = ConnectionStore.getState();

  return {
    connections,
    onAddConnection,
  };
}

const View = props => <ConnectionInfoView {...props} />;

export default Container.createFunctional(View, getStores, getState);
