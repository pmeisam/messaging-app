const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cors = require('cors')

require('dotenv').config();
require('./config/database');

const app = express();

const http = require('http').Server(app);
require('./io').init(http);

app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors())

app.use('/api/users', require('./routes/api/users'));
app.use('/api/chats', require('./routes/api/chats'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3001;

// server should be listining to http because of socket.io is added not app
http.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});