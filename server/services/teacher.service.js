var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('teachers');
db.bind('plans');
db.bind('activities');

var service = {};

service.getPlans = getPlans;
service.getActivities = getActivities;
service.newActivity = newActivity;
service.newPlan = newPlan;
service.updateTeacher = updateTeacher;
service.getTeacherById = getTeacherById;
service.changePassword = changePassword;
service.unique = unique;
service.confirmation = confirmation;
service.authenticate = authenticate;
service.profileImgUpload = profileImgUpload;

module.exports = service;


function getActivities() {
    var deferred = Q.defer();
    var d = new Date();
    d.setHours(0,0,0);
    db.activities.find({"perform_time" : { $gte : d.toISOString() }}).toArray(function (err, activities) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(activities);
    });
    return deferred.promise;
}

function getPlans() {
    var deferred = Q.defer();
    var d = new Date();
    d.setHours(0,0,0);
    db.plans.find({"activity_time" : { $gte : d.toISOString() }}).toArray(function (err, plans) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(plans);
    });
    return deferred.promise;
}


function newActivity(req) {
  var deferred = Q.defer();
  db.activities.insert(
    req,
    function(err, res) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    }
  )
  return deferred.promise;
}

function newPlan(req) {
  var deferred = Q.defer();
  db.plans.insert(
    req,
    function(err, res) {
      if (err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    }
  )
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

function profileImgUpload(user_id, path, type) {
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
