import React from 'react';
import { Container } from 'flux/utils';
import request from 'superagent';

import { ConnectionInfo } from '../actions/connectionAction';
import Dispatcher from '../dispatchers/homeDispatcher';
import ConnectionStore from '../stores/connectionStore';
import ConnectionInfoView from '../components/ConnectionInfoView';

function onAddConnection(data: ConnectionInfo) {
  request
    .post('/api/info')
    .send(data)
    .end((err, res) => {
      if (!err) {
        Dispatcher.dispatch({
          type: 'add',
          data: {
            ...data,
            info: JSON.parse(res.text),
          },
        });
      }
    });
}

function getStores() {
  return [ConnectionStore];
}

function getState(prevState) {
  const connections = ConnectionStore.getState();

  return {
    ...prevState,
    connections,
    currentConnect: null,
    onAddConnection,
  };
}

const View = props => <ConnectionInfoView {...props} />;

export default Container.createFunctional(View, getStores, getState);
