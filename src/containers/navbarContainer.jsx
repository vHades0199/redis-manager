import React from 'react';
import { Container } from 'flux/utils';
import request from 'superagent';

import ConnectionStore from '../stores/connectionStore';
import { ConnectionInfo } from '../actions/connectionAction';
import Dispatcher from '../dispatchers/homeDispatcher';
import AddNewConnection, { LinkNewConnection } from '../components/AddNewConnection';

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

function getStores() {
  return [ConnectionStore];
}

function getState() {
  return {
    onAddConnection,
  };
}

type State = {
  onAddConnection: (data: RedisConnectionInfo) => void,
};

const View = (props: State) => (
  <div className="d-flex flex-column flex-grow">
    <ul className="navbar-nav">
      <li className="nav-item">
        <LinkNewConnection className="nav-link" target="addNewConnection" />
        <AddNewConnection id="addNewConnection" onSubmit={props.onAddConnection} />
      </li>
      <li className="nav-item">
        <a href="#current" className="nav-link">
          <span className="sr-only">(current)</span>
        </a>
      </li>
      <li className="nav-item">
        <a href="#commands" className="nav-link">
          <i className="fa fa-info mr-1" />
          <span>commands</span>
        </a>
      </li>
      <li className="nav-item">
        <a href="#tools" className="nav-link">
          <i className="fa fa-wrench mr-1" />
          <span>tools</span>
        </a>
      </li>
    </ul>
  </div>
);

export default Container.createFunctional(View, getStores, getState);
