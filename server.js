/*
 *  ______     ______     __         __         ______     ______     __     ______   __  __
 * /\  ___\   /\  __ \   /\ \       /\ \       /\  __ \   /\  == \   /\ \   /\  ___\ /\ \_\ \
 * \ \ \____  \ \ \/\ \  \ \ \____  \ \ \____  \ \  __ \  \ \  __<   \ \ \  \ \  __\ \ \____ \
 *  \ \_____\  \ \_____\  \ \_____\  \ \_____\  \ \_\ \_\  \ \_____\  \ \_\  \ \_\    \/\_____\
 *   \/_____/   \/_____/   \/_____/   \/_____/   \/_/\/_/   \/_____/   \/_/   \/_/     \/_____/
 *
 *  Authors:
 *          Ricardo Lopez <rlopez@sporks.io>
 *          David Gardner <smartydude010@hotmail.com>
 *          Sydney Johnson <syjohnso@gmail.com>
 */

var express         = require('express');
var app             = express();
var server          = require('http').createServer(app)
var morgan          = require('morgan');
var io              = require('socket.io').listen(server);
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var routes          = require('./routes');
var logger          = require('./logger');

var serverPort = process.env.PORT || 1338;
logger.info('Using port ' + serverPort);

var serverHost = process.env.HOST || 'localhost';
logger.info('Using host ' + serverHost);

var db = process.env.DB || 'test';
logger.info('Using database ' + db);

// set up the parsers
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// set up logger
app.use(morgan('combined', {'stream': logger.stream }));

// load routes
app.use(routes);

// socket connection
io.sockets.on('connection', function (socket) {

    io.sockets.emit('blast', {msg: 'someone connected!'});

    socket.on('blast', function(data, fn){
        logger.debug(data);
        io.sockets.emit('blast', {msg:data.msg});

        fn();//call the client back to clear out the field
    });

});

// connect to database
mongoose.connect('mongodb://localhost/' + db);
mongoose.connection.once('open', logger.info.bind(logger, 'connected to database'));
mongoose.connection.on('error', logger.error.bind(logger, 'database connection error:'));

// listen on port
server.listen(serverPort, serverHost);