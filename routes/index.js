import { Express } from 'express';
import home from './home';
import api from './api';

export default (app: Express) => {
  app.get('/', home);
  app.use('/api', api);
  // app.get('./tools', tools);
};
