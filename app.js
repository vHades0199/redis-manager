import sf from 'sf';
import path from 'path';
import Express from 'express';
// import browserify from 'browserify-middleware';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import flash from 'express-flash';
import { Map } from 'immutable';

import routes from './routes';
import NODE_ENV_CONTANT from './utils/node-env';

const redisConnections = Map({});
const app = new Express();

app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'pug');

// app.use(flash());
app.use((req, res, next) => {
  req.redisConnections = redisConnections;

  res.locals.sf = sf;
  res.locals.getFlashes = () => req.flash();

  //  req.rClient = client;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
  secret: 'redismanager',
  resave: true,
  saveUninitialized: false,
}));
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, 'public')));
if (app.get('env') === NODE_ENV_CONTANT.DEV) {
  app.use(Express.static(path.resolve(__dirname, 'private')));
}

routes(app);

export default app;
