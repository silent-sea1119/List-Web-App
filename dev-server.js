
const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const yaml = require('js-yaml');
const log4js = require('log4js');

log4js.configure({
    appenders: [{ type: 'console' }],
    replaceConsole: false
});

const logger = log4js.getLogger();
const yamlPath = path.resolve('app.yml');
const yamlConfig = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
const devserver = yamlConfig.devserver;
const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    },
    historyApiFallback: true
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(devserver.port, (err) => {
  if (err) {
    logger.trace(err);
    return;
  }
  logger.info('Listening at http://0.0.0.0:3000');
});
