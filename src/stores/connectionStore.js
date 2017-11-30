import { ReduceStore } from 'flux/utils';
import { Map } from 'immutable';
import uuid from 'uuid/v4';

import { ConnectionAction, ConnectionInfo } from '../actions/connectionAction';
import Dispatcher from '../dispatchers/homeDispatcher';

export interface ConnectionState extends Map<string, ConnectionInfo> {}

class ConnectionStore extends ReduceStore<ConnectionState, ConnectionAction> {
  constructor() {
    super(Dispatcher);
  }

  getInitialState(): ConnectionState {
    return Map([]);
  }

  reduce(state: ConnectionState, action: ConnectionAction): ConnectionState {
    switch (action.type) {
      case 'add':
        return state.set(uuid(), action.data);
      case 'info': {
        const oldData = state.get(action.id);
        return state.set(action.id, { ...oldData, info: action.data });
      }
      case 'save':
        localStorage.setItem('connections', state);
        return state;
      default:
        return state;
    }
  }
}

export default new ConnectionStore();
