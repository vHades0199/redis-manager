import { ReduceStore } from 'flux/utils';
import { Map } from 'immutable';

import { ConnectionAction, ConnectionInfo } from '../actions/connectionAction';
import Dispatcher from '../dispatchers/homeDispatcher';

export interface ConnectionState extends Map<string, ConnectionInfo> {}

class ConnectionStore extends ReduceStore<ConnectionState, ConnectionAction> {
  constructor() {
    super(Dispatcher);
  }

  getInitialState(): ConnectionState {
    return new Map();
  }

  reduce(state: ConnectionState, action: ConnectionAction): ConnectionState {
    switch (action.type) {
      case 'add':
        return state.set(action.id, action.data);
      case 'save':
        localStorage.setItem('connections', state);
        return state;
      case 'scan': {
        const old = state.get(action.id);
        return state.set(action.id, {
          ...old,
          keys: action.data,
        });
      }
      default:
        return state;
    }
  }
}

export default new ConnectionStore();
