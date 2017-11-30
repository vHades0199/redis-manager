import chalk from 'chalk';

import app from './app';

// const env = require('dotenv');

/* if (process.env.NODE_ENV !== 'production') {
  env.load();
} */

const { PORT = 5200 } = process.env;
const packageConfig = require('./package.json');

app.packageName = packageConfig.name;

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(chalk`{blue ${app.packageName}} Start listening on`);
  console.log(chalk`{blue ${app.packageName}} PORT {magenta ${PORT}}`);
  console.log(chalk`{blue ${app.packageName}} ENV {green ${app.get('env')}}`);
});
