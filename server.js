const express = require('express');
const cors = require('cors');
const learning = require('./routes/ma');
const file = require('./routes/file');
const {appLog} = require('./app/config/logger');
const path = require('path');
const moment = require('moment');
const bodyParser = require('body-parser');
const CONFIG = require('./app/config/app');
const chatbot = require('./chatbot/index');
let app = express();
// var server = require('http').Server(app);
chatbot(app);
function webPageNotFound(req, res, next) {
  res.status(404);
   res.render('errors/404', { url: req.url });
}

/**
 * Express configurations
 */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment =  moment;
app.use(bodyParser.json());

app.set('view engine', 'jade');
app.set('views', './views')
app.set('view engine', 'jade');

/**
 * Express routes
 */
app.use('/learning', learning);
app.use('/api', require('./routes/api/user'));
app.use('/api', require('./routes/api/message'));
app.use('/api', require('./routes/api/tasks'));
app.use('/file', file);

app.get('/', function(req, res) {
  res.json('Basic server');
});

/**
 * Serving static files
 */

app.use('/public', express.static(path.join(__dirname, 'public')));

/**
* Web sockets
*/

/**
 * Error pages
 */

app.use(webPageNotFound);
app.use(function(error, req, res, next) {
  res.status(500);
  appLog.log('info', 'Server error ->', error.toString());
  res.render('errors/500', {title:'500: Internal Server Error', error: error});
});


/**
 * App listening
 */
app.listen(CONFIG.PORT, function() {
  console.log(`Server listening on port ${CONFIG.PORT}`);
});
