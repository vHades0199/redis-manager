import { ReduceStore } from 'flux/utils';
import { Map } from 'immutable';

import { ConnectionAction, ConnectionInfo } from '../actions/connectionAction';
import Dispatcher from '../dispatchers/homeDispatcher';

export interface ConnectionState extends Map<string, ConnectionInfo> {}

function save(state) {
  localStorage.setItem('connections', JSON.stringify(state));
}

class ConnectionStore extends ReduceStore<ConnectionState, ConnectionAction> {
  constructor() {
    super(Dispatcher);
  }

  getInitialState(): ConnectionState {
    if (localStorage.connections) return Map(JSON.parse(localStorage.connections));
    return new Map();
  }

  reduce(state: ConnectionState, action: ConnectionAction): ConnectionState {
    let newState = null;
    switch (action.type) {
      case 'add':
        newState = state.set(action.id, action.data);
        break;
      case 'scan':
        {
          const old = state.get(action.id);
          newState = state.set(action.id, {
            ...old,
            keys: action.data,
          });
        }
        break;
      default:
        newState = state;
    }
    save(newState);
    return newState;
  }
}

export default new ConnectionStore();
