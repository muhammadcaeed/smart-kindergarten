require('rootpath')();
// require('./services/chat.service');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var multer = require('multer');
// 
// var io = require('socket.io')(3000);
//
// io.on('connection', (socket) => {
//   console.log('a user connected');
//     socket.emit('news', 'Welcome!');
//
//     socket.on('send-message', (data) => {
//       console.log('send-message :', data);
//       io.emit('receive-message', data);
//     });
// });

app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:8100', 'http://localhost:8101','http://localhost:8102'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
       res.header('Access-Control-Allow-Origin', origin);
  }
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

// app  .use(cors({credentials: true, origin: 'http://localhost:8100'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//JWT Authentication
app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.url.search('uploads') == '1') {
            console.log('hello : ', req.url.search);
            req.headers.authorization = process.env.AUTH_TOKEN;
        }
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
})
.unless({ path: ['/users/forgot', '/users/authenticate', '/users/register', ] })
);

//folder
app.use(express.static(__dirname));

//routes
app.use('/users', require('./controllers/users.controller'));
app.use('/teachers', require('./controllers/teachers.controller'));

//start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
