import { Dispatcher } from 'flux';

import { ConnectionAction } from '../actions/connectionAction';

function getDispatcher(): Dispatcher<ConnectionAction> {
  if (global.AppDispatcher) return global.AppDispatcher;
  global.AppDispatcher = new Dispatcher();
  return global.AppDispatcher;
}

export default getDispatcher();
