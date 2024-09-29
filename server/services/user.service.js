const request = require('request');
const sgMail = require('@sendgrid/mail');
var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('children');
db.bind('teachers');
db.bind('devices');
db.bind('health');
db.bind('activities');
db.bind('chat');
db.bind('rooms');

var service = {};

service.inbox = inbox;
service.getChat = getChat;
service.chat = chat;
service.forgot = forgot;
service.showHealthData = showHealthData;
service.collectData = collectData;
service.findByUserId = findByUserId;
service.sendNotification = sendNotification;
service.registerDevice = registerDevice;
service.deleteTeacher = _deleteTeacher;
service.createTeacher = createTeacher;
service.updateTeacher = updateTeacher;
service.getTeacherById = getTeacherById;
service.changePasswordAdmin = changePasswordAdmin;
service.getAllTeachers = getAllTeachers;
service.searchTeachers = searchTeachers;
service.changePassword = changePassword;
service.unique = unique;
service.confirmation = confirmation;
service.updateChild = updateChild;
service.authenticate = authenticate;
service.getAll = getAll;
service.getAllChildren = getAllChildren;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.createChild = createChild;
service.searchChildren = searchChildren;
service.profileImgUpload = profileImgUpload;

module.exports = service;

function inbox(req) {
  var deferred = Q.defer();
  var usernames = {};
  var roomName;
  db.rooms.findOne({ $and: [ { teacher_id : mongo.helper.toObjectID(req[0]) }, { parent_id : mongo.helper.toObjectID(req[1]) } ] }, function(err, record) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (!record) {
      db.rooms.insert({
        teacher_id: mongo.helper.toObjectID(req[0]),
        parent_id: mongo.helper.toObjectID(req[1]),
        room: req[0] + req[1]
      }, function(err, res) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (res) {
          roomName = room;
          console.log('res :', res);
          // deferred.resolve();
        }
      });
    }
    if (record) roomName = record.room;

    var io = require('socket.io')(3000);

    io.on('connection', (socket) => {
      socket.on('add-user', (username) => {
        socket.username = username;
        socket.room = roomName;
        usernames[username] = username;

        socket.join = roomName;
        console.log('connected to room : ', roomName);
        socket.emit('updatechat', 'SERVER', 'you have connected to :', roomName);
        // echo to room 1 that a person has connected to their room
        socket.broadcast.to(roomName).emit('updatechat', 'SERVER', username + ' has connected to this room');
        // socket.emit('updaterooms', rooms, roomName);
      })

      socket.on('sendchat', function (data) {
    		// we tell the client to execute 'updatechat' with 2 parameters
    		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    	});

      socket.on('disconnect', function(){
    		// remove the username from global usernames list
    		delete usernames[socket.username];
    		// update list of users in chat, client-side
    		io.sockets.emit('updateusers', usernames);
    		// echo globally that this client has left
    		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    		socket.leave(socket.room);
    	});
  });


    //
    //   socket.on('send-message', (data) => {
    //     // console.log('send-message :', data);
    //     io.emit('receive-message', data);
    //   });
  });
  return deferred.promise;
}


function getChat(req) {
  var deferred = Q.defer();
  db.chat.find({},{_id:0}).sort( { timestamp: 1 } ).toArray(function(err, chat) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (chat) {
      console.log('chat :', chat);
      deferred.resolve(chat);
    }
    if(!chat) deferred.resolve();
  });
  return deferred.promise;
}


function chat(chat) {
  console.log('chat: ', chat);
  var deferred = Q.defer();
  db.chat.insert(
    chat,
    function(err, res) {
      console.log('res :', res);
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (res) deferred.resolve();
    }
  )
  return deferred.promise;
}

function forgot(req) {
    var email = req[0];
    var username = req[1];
    var deferred = Q.defer();

    // db.users.findOne({ username: username }, function (err, user) {
    db.users.findOne( { $and: [ { email : email }, { username : username } ] } , function (err, record) {
      if (err) deferred.reject(err.name + ': ' + err.message);
        if (!record) {
          console.log('err :', 'rec');
          deferred.reject('User not found');
        }
        if(record) {
          console.log('record :', record);
          var pass = 'AKx342asHj123sxsW';
          hash = bcrypt.hashSync(pass, 10);
          db.users.update(
            { user_id: record._id },
            { $set: {hash: hash} },
            function(err, success) {
              if (err) deferred.reject(err.name + ': ' + err.message);
              if (success) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                  to: email,
                  from: 'info@smartkindergarten.com',
                  subject: 'New Password Request - Smart Kindergarten',
                  text: 'Your new password is :'+ pass,
                  html: '<strong>Your new password is :  ' + pass,
                };
                sgMail.send(msg);
                deferred.resolve(success);}
            }
          )
        }

    });

    return deferred.promise;
}


function showHealthData(data) {
  console.log('data: ', data);
  var deferred = Q.defer();
  db.health.find({
  //   $and: [
  //     {
  //   user_id : data[0]
  // }
    // ,
    //     {createdAt: {
    //       $gte:data[1],
    //       $lte:data[2]
    //     }}
    // ]
  }).sort( { createdAt: 1 }).toArray(function (err, health) {
    if (err) deferred.reject(err.name + ': ' + err.message);

    if(health) {
      db.activities.find({
        perform_time: {
          $gt: data[1],
          $lt: data[2]
        }
      }).sort( { createdAt: 1 }).toArray(function (err, activities) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      if(activities) {
        db.health.find({}, {createdAt: 1}).toArray(function(err, projections) {
          if (err) deferred.reject(err.name + ': ' + err.message);
          console.log(health);
          if(projections) deferred.resolve([activities, health, projections]);
        })
      }
    });
  }
  })
  return deferred.promise;
}
function collectData(data) {
  var deferred = Q.defer();

  db.health.findOne( { $and: [ { user_id : data.user_id }, { createdAt : data.createdAt } ] }, function (err, record) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      if(record) {
        db.health.update(
          { user_id: mongo.helper.toObjectID(data.user_id) },
          { $set: data },
          function (err, result) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (result) {
              console.log('record updated');
              deferred.resolve(result);
            }
          });
      }
      else {
        db.health.insert(
          data,
          function(err, result) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            console.log('record inserted');
            deferred.resolve(result);
          }
        )
      }
  });

  return deferred.promise;
}

function findByUserId(_id) {
  var deferred = Q.defer();

  db.children.findOne({ user_id :  mongo.helper.toObjectID(_id) }, function(err, child) {
    if (err)  deferred.reject(err.name + ': ' + err.message);
    if (child) {
      console.log(child);
      deferred.resolve(child);
    }
  })
return deferred.promise;
}

function sendNotification(notification) {
  console.log('msg :', notification);
  var deferred = Q.defer();

  db.devices.find().toArray(function (err, devices) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      // return users (without hashed passwords)
      tokens = _.map(devices, function (device) {
        if(device.token && device.token.length > 0) {
          return device.token;
        }
      });
      let pushOptions = {
          tokens: tokens,
          profile: "dev",
          notification: {
              message: notification
          }
      };

      // let pushToken = config.pushToken;
      let pushToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODJiYWMxMS1hY2Q5LTQ2NzctYTI0My1jYzUzNGRiODcxZmQifQ.Ra9LK7kyAXUjGzzemjt3Slgju_khQGejG-WU_4Gs-lY';
      console.log('pushToken :', pushToken);

      request({
          method: 'POST',
          url: 'https://api.ionic.io/push/notifications',
          body: pushOptions,
          headers: {
              "Content-Type":"application/json",
              "Authorization": "Bearer " + pushToken
          },
          json: true
      }, function(err, response, body) {
          if (err) {
              console.log('Error Creating Notification: ' , err);
          }
          console.log('body : ', body);
          console.log('Succesfull Notification Created');
      });

      deferred.resolve(devices);
  });

  return deferred.promise;
}

function registerDevice(_id, token) {
  var deferred = Q.defer();

  db.devices.findOne({ user_id: mongo.helper.toObjectID(_id), token: token }, function(err, device) {
    if (err) {
      console.log('error no record found');
      deferred.reject(err.name + ': ' + err.message);
    }
    if (device) {
      console.log('device already registered');
      deferred.resolve();
    }
    if(!device) {
      var newDevice = {
        user_id: mongo.helper.toObjectID(_id),
        token: token
      };
      db.devices.insert(
        newDevice,
        function (err, doc) {
          if (err) deferred.reject(err.name + ': ', + err.message);

          deferred.resolve();
        });
    }
  })
    return deferred.promise;
}

function  _deleteTeacher(_id) {
    var deferred  = Q.defer();

    db.teachers.findOne( { user_id: mongo.helper.toObjectID(_id) }, function(err, teacher) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (teacher) {
            db.teachers.remove( { _id: mongo.helper.toObjectID(teacher._id) }, function(err) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                db.users.remove( { _id: mongo.helper.toObjectID(_id) }, function(err) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    deferred.resolve();
                });
            });
        }
    });
    return deferred.promise;
}


function createTeacher(userParam) {
     var deferred = Q.defer();
    // validation
    db.users.findOne(
        { email: userParam[0].email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                deferred.reject('Email already exists');
            } else {
                db.users.findOne(
            { username: userParam[0].username },
                    function (err, user) {
                        if (err) deferred.reject(err.name + ': ' + err.message);

                        if (user) {
                            // username already exists
                            deferred.reject('Username already exists');
                        } else {
                            createTeacherUser();
                        }
                    });
            }
        }
    )

    function createTeacherUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam[0], 'password');
        user.type = 'teacher';
        var teacher = userParam[1];

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam[0].password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();

                db.users.findOne({ username: userParam[0].username }, function(err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    if (user) {
                        teacher.user_id = user._id;
                        db.teachers.insert(
                            teacher,
                            function (err, doc) {
                              console.log('teacher : ', teacher);
                                if (err) deferred.reject(err.name + ': ' + err.message);

                                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                const msg = {
                                  to: user.email,
                                  from: 'info@smartkindergarten.com',
                                  subject: 'Smart Kindergarten',
                                  text: 'No more meetings when you have Smart Kindergarten installed. Parents and Teachers remain updated anytime.',
                                  html: '<strong>Welcome ' + teacher.tname + ' at Smart Kindergarten</strong><br /><p>No more meetings when you have Smart Kindergarten installed. Parents and Teachers remain updated anytime.</p>',
                                };
                                sgMail.send(msg);
                                deferred.resolve();
                            });
                    }
                });
            });
    }
    return deferred.promise;
}

function updateTeacher(user, teacher) {
    var deferred = Q.defer();

    db.users.findById(user._id, function (err, oldUser) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (oldUser) {
          var userSet = {email: user.email, username: user.username};
          var teacherSet = { tname: teacher.tname, address: teacher.address, mobileno: teacher.mobileno }
          db.users.update(
            { _id: mongo.helper.toObjectID(user._id) },
            { $set: userSet },
            function (err, userDoc) {
              if (err) deferred.reject(err.name + ': ' + err.message);

              if (userDoc) {
                db.teachers.update(
                  {_id: mongo.helper.toObjectID(teacher._id) },
                  { $set: teacherSet},
                  function (err, childDoc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    deferred.resolve();
                  }
                )

              }
            })
        }
    })
    return deferred.promise;
  }

function getTeacherById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            db.teachers.findOne({ user_id :  mongo.helper.toObjectID(_id) }, function(err, teacher) {
                if (err)  deferred.reject(err.name + ': ' + err.message);

                if (teacher) {
                    deferred.resolve([_.omit(user, 'hash'), teacher]);
                }
            })
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function changePasswordAdmin(_id, new_pass) {
  var deferred = Q.defer();
  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (user) {
      let new_hash = bcrypt.hashSync(new_pass, 10);
      db.users.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: {hash: new_hash} },
        function (err, success) {
          if (err) deferred.reject(err.name + ': ' + err.message);
          if (success) deferred.resolve('Password changed successfully');
      });
    }
    else deferred.reject('Something went wrong');
  })
  return deferred.promise;
}

function changePassword(_id, current_pass, new_pass) {
  var deferred = Q.defer();
  db.users.findById(_id, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (user) {
      if (bcrypt.compareSync(current_pass, user.hash)) {
        if(bcrypt.compareSync(new_pass, user.hash)) deferred.reject('New password must be different from current');

        let new_hash = bcrypt.hashSync(new_pass, 10);
        db.users.update(
          { _id: mongo.helper.toObjectID(_id) },
          { $set: {hash: new_hash} },
          function (err, success) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (success) deferred.resolve('Password changed successfully');
        });
      }
    else deferred.reject('Incorrect current password');
    }
  })
  return deferred.promise;
}
function unique(username) {
  var deferred = Q.defer();
  db.users.findOne({username:username}, function (err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (user) deferred.resolve({status: 1});
    deferred.resolve({status: 0});
  });
  return deferred.promise;
}

function confirmation(_id, password) {
  var deferred = Q.defer();
  db.users.findById(_id, function(err, user) {
    if (err) deferred.reject(err.name + ': ' + err.message);
    if (user && bcrypt.compareSync(password, user.hash)) deferred.resolve();
    else deferred.reject('Incorrect password');
  })
  return deferred.promise;
}

function updateChild(user, child) {
    var deferred = Q.defer();

    db.users.findById(user._id, function (err, oldUser) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (oldUser) {
          var userSet = {email: user.email, username: user.username};
          var childSet = { cname: child.cname, gname: child.gname, address: child.address, mobileno: child.mobileno }
          db.users.update(
            { _id: mongo.helper.toObjectID(user._id) },
            { $set: userSet },
            function (err, userDoc) {
              if (err) deferred.reject(err.name + ': ' + err.message);
              // deferred.resolve();

              if (userDoc) {
                db.children.update(
                  {_id: mongo.helper.toObjectID(child._id) },
                  { $set: childSet},
                  function (err, childDoc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    deferred.resolve();
                  }
                )

              }
            })
        }
    })
    return deferred.promise;
  }

function authenticate(username, password, type) {
    var deferred = Q.defer();

    // db.users.findOne({ username: username }, function (err, user) {
    db.users.findOne( { $and: [ { type : type }, { username : username } ] } , function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                // username: user.username,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user, 'hash');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getAllTeachers() {
    var deferred = Q.defer();
    db.teachers.find().toArray(function (err, teachers) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(teachers);
    });
    return deferred.promise;
}

function getAllChildren() {
    var deferred = Q.defer();
    db.children.find().toArray(function (err, children) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(children);
    });
    return deferred.promise;
}

function searchTeachers(tname) {
    var deferred = Q.defer();

    db.teachers.find({ tname: { $regex: tname, $options: 'i' } }).toArray(function (err, teachers) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(teachers);
    });
    return deferred.promise;
}

function searchChildren(cname) {
    var deferred = Q.defer();

    db.children.find({ cname: { $regex: cname, $options: 'i' } }).toArray(function (err, children) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(children);
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            db.children.findOne({ user_id :  mongo.helper.toObjectID(_id) }, function(err, child) {
                if (err)  deferred.reject(err.name + ': ' + err.message);

                if (child) {
                    deferred.resolve([_.omit(user, 'hash'), child]);
                }
            })
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
{ username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            // username: userParam.username,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
            });
    }
    return deferred.promise;
}


function profileImgUpload(user_id, path, type) {
  console.log(`user_id : ${user_id}`);
  console.log(`path : ${path}`);
  console.log(`type : ${type}`);
    var deferred = Q.defer();
    var set = { avatar_path: path };
    if (type && type == 'teacher') {
      db.teachers.findOne( { user_id: mongo.helper.toObjectID(user_id) }, function(err, teacher) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          if (teacher) {
            console.log('teacher found');
              db.teachers.update(
                  { user_id: mongo.helper.toObjectID(user_id) },
                  { $set: set },
                  function (err, doc) {
                      if (err) deferred.reject(err.name + ': ' + err.message);
                      deferred.resolve();
                  });
              }
      });
    }
    else {
      db.children.findOne( { user_id: mongo.helper.toObjectID(user_id) }, function(err, child) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          if (child) {
              db.children.update(
                  { user_id: mongo.helper.toObjectID(user_id) },
                  { $set: set },
                  function (err, doc) {
                      if (err) deferred.reject(err.name + ': ' + err.message);
                      deferred.resolve();
                  });
              }
      });
    }

    return deferred.promise;
}

function  _delete(_id) {
    var deferred  = Q.defer();

    db.children.findOne( { user_id: mongo.helper.toObjectID(_id) }, function(err, child) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (child) {
            db.children.remove( { _id: mongo.helper.toObjectID(child._id) }, function(err) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                db.users.remove( { _id: mongo.helper.toObjectID(_id) }, function(err) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    deferred.resolve();
                });
            });
        }
    });
    return deferred.promise;
}

// rest of the functions

function createChild(userParam) {
     var deferred = Q.defer();

    // validation

    db.users.findOne(
        { email: userParam[0].email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                deferred.reject('Email already exists');
            } else {
                db.users.findOne(
            { username: userParam[0].username },
                    function (err, user) {
                        if (err) deferred.reject(err.name + ': ' + err.message);

                        if (user) {
                            // username already exists
                            deferred.reject('Username already exists');
                        } else {
                            createChildUser();
                        }
                    });
            }
        }
    )


    function createChildUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam[0], 'password');
        user.type = 'parent';
        var child = userParam[1];

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam[0].password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();

                db.users.findOne({ username: userParam[0].username }, function(err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    if (user) {
                        child.user_id = user._id;
                        db.children.insert(
                            child,
                            function (err, doc) {
                                if (err) deferred.reject(err.name + ': ' + err.message);

                                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                const msg = {
                                  to: user.email,
                                  from: 'info@smartkindergarten.com',
                                  subject: 'Smart Kindergarten',
                                  text: 'No more meetings when you have Smart Kindergarten installed. Parents and Teachers remain updated anytime.',
                                  html: '<strong>Welcome ' + child.gname + ' at Smart Kindergarten</strong><br />No more meetings when you have Smart Kindergarten installed. Parents and Teachers remain updated anytime.',
                                };
                                sgMail.send(msg);

                                deferred.resolve();
                            });
                    }
                });
            });
    }
    return deferred.promise;
}
