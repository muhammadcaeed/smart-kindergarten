var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
let profileImgPath = '';
var multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) { cb(null, './uploads/profile-images/'); },
    filename: function (req, file, cb) {
      console.log('multer req : ', req.body);
        var datetimestamp = Date.now();
        cb(null, req.body.user_id);
        profileImgPath =  `${req.body.path}/uploads/profile-images/${req.body.user_id}`;
        console.log('prof Image: ', profileImgPath);
    },
    onFileUploadComplete: function(file){
        done = true;
    },
});

var upload = multer({
  storage: storage,
  limits:{ fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      ext = ext.toLowerCase();
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return cb('Only images are allowed');
      }
      cb(null, true)
  }
}).single('file');

// routes

router.post('/inbox', inbox);
router.get('/getChat', getChat);
router.post('/chat', chat);
router.post('/forgot', forgot);
router.post('/showHealthData', showHealthData);
router.post('/collectData', collectData);
router.get('/findByUserId/:_id', findByUserId);
router.post('/sendNotification', sendNotification);
router.post('/registerDevice', registerDevice);
router.delete('/teacher/:_id', _deleteTeacher);
router.post('/teacher', createTeacher);
router.put('/updateteacher/:_id', updateTeacher);
router.get('/teacher/:current', getCurrentTeacher);
router.put('/changePasswordAdmin', changePasswordAdmin);
router.get('/searchteachers/:tname', searchTeachers);
router.get('/teachers', getAllTeachers);
router.put('/changePassword', changePassword);
router.put('/unique/:user', unique);
router.put('/confirmation', confirmation);
router.put('/updatechild/:_id', updateChild);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/children', getAllChildren);
router.get('/:current', getCurrent);
router.get('/searchchildren/:cname', searchChildren);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.post('/child', child);
router.post('/profileImgUpload', profileImgUpload);
module.exports = router;


function inbox(req, res) {
  userService.inbox(req.body)
    .then(function (inbox) {
        res.send(inbox);
    })
    .catch(function (err) {
          res.status(400).send(err);
    });
}


function getChat(req, res) {
  userService.getChat()
    .then(function (chat) {
        res.send(chat);
    })
    .catch(function (err) {
          res.status(400).send(err);
    });
}


function chat(req, res) {
  console.log('chat :', req.body);
  userService.chat(req.body)
    .then(function (user) {
        res.send(user);
    })
    .catch(function (err) {
          res.status(400).send(err);
    });
}



function forgot(req, res) {
  userService.forgot(req.body)
    .then(function (user) {
        res.send('Success: An email is sent to you')
    })
    .catch(function (err) {
          res.status(400).send(err);
    });
}


function showHealthData(req, res) {
  userService.showHealthData(req.body)
  .then(function (data) {
      res.send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}


function collectData(req, res) {
    userService.collectData(req.body)
      .then(function (devices) {
          res.send(devices);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}


function findByUserId(req, res) {
    userService.findByUserId(req.params._id)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function sendNotification(req, res) {
    userService.sendNotification(req.body.notification)
        .then(function (devices) {
            res.send(devices);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function registerDevice (req, res) {
  userService.registerDevice(req.body[0], req.body[1])
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function _deleteTeacher(req, res) {
    userService.deleteTeacher(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function createTeacher(req, res) {
    userService.createTeacher(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTeacher(req, res) {
  userService.updateTeacher(req.body[0], req.body[1])
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function getCurrentTeacher(req, res) {
    userService.getTeacherById(req.params.current)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function changePasswordAdmin(req ,res) {
  userService.changePasswordAdmin(req.body[0], req.body[1])
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

function changePassword(req ,res) {
  userService.changePassword(req.body[0], req.body[1], req.body[2])
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

function unique(req, res) {
  userService.unique(req.params.user)
    .then(function (data) {
      if (data.status) res.sendStatus(200);
      else
        res.sendStatus(400);
    })
    .catch(function (err) {
      res.status(400).send(err);
    })
}

function confirmation(req, res) {
  userService.confirmation(req.body[0], req.body[1])
  .then(function () {
    res.sendStatus(200);
  })
  .catch(function (err) {
    res.status(400).send(err);
  })
}

function updateChild(req, res) {
  userService.updateChild(req.body[0], req.body[1])
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function profileImgUpload(req ,res) {
    upload(req,res,function(err){
            if(err){
                if (err.code = 'LIMIT_FILE_SIZE') err = 'Selected file is too large';
                 res.json({err_code: 1, err_desc: err});
                 return;
            }
            userService.profileImgUpload(req.body.user_id, profileImgPath, req.body.type)
                .then(function () {
                    res.json({err_code: 0, err_desc: null});
                })
                .catch(function (err) {
                     res.json({err_code: 1, err_desc: err});
                })
        });
}

function authenticate(req, res) {
    userService.authenticate(req.body.username, req.body.password, req.body.type)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.send({ error: 'Username or password is incorrect' });
            }
        })
        .catch(function (err) {
            res.send('Username or password is incorrect');
        });
}

function register(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllChildren(req, res) {
    userService.getAllChildren()
        .then(function (children) {
            res.send(children);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTeachers(req, res) {
    userService.getAllTeachers()
        .then(function (teachers) {
            res.send(teachers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function searchChildren(req, res) {
    userService.searchChildren(req.params.cname)
        .then(function (children) {
            res.send(children);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function searchTeachers(req, res) {
    userService.searchTeachers(req.params.tname)
        .then(function (teachers) {
            res.send(teachers);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.params.current)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function child(req, res) {
    userService.createChild(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
