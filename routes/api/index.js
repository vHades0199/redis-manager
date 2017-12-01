import { Router } from 'express';
import bodyParser from 'body-parser';

import getServerInfo from './getServerInfo';
import getKeys from './getKeys';
import postExec from './postExec';

const routes: Router = Router();
const urlencoded = bodyParser.urlencoded({ extended: false });

routes.post('/info', urlencoded, getServerInfo);
routes.post('/exec', postExec);
routes.get('/keys/:connectionId/:pattern', getKeys);
routes.get('/keys/:connectionId', getKeys);
routes.use((req, res) => {
  res.send(404);
});
export default routes;
