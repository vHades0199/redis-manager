import { Router } from 'express';
import bodyParser from 'body-parser';

import getServerInfo from './getServerInfo';

const routes: Router = Router();
const urlencoded = bodyParser.urlencoded({ extended: false });

routes.post('/info', urlencoded, getServerInfo);

export default routes;
