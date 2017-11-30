import minimist from 'minimist';
import gulp from 'gulp';
import path from 'path';
import child from 'child_process';

import { reactTask, sassTask, watchTask } from 'gulp-utils';
import { reactCfg, sassCfg, browserSyncCfg } from './config/gulp';

gulp.task('sass', () => sassTask(sassCfg));

gulp.task('react', (done) => {
  const options = minimist(process.argv.slice(2), reactCfg.knownOptions);

  const ops = {
    ...reactCfg,
    params: { ...options, file: `${reactCfg.src + options.file}.jsx` },
  };
  if (path.dirname(options.file) !== 'controls') {
    ops.expose = {
      ...reactCfg.expose,
      ...reactCfg.exposePageControl,
    };
  }
  reactTask(done, ops);
});

gulp.task('watch', () => {
  watchTask.init(browserSyncCfg);

  gulp.watch('private/**/*.js', watchTask.reloadTask);
  gulp.watch('private/**/*.css', watchTask.reloadTask);
});

gulp.task('start', (done) => {
  const server = child.spawn('node', ['index.js', '--color']);
  server.stdout.pipe(process.stdout);
  server.stderr.pipe(process.stderr);
  done();
});

gulp.task('default', ['start', 'watch']);
