var config = require('config.json');
var express = require('express');
var router = express.Router();
var teacherService = require('services/teacher.service');
let profileImgPath = '';
var multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) { cb(null, './uploads/profile-images/'); },
    filename: function (req, file, cb) {
      console.log('multer req : ', req.body);
        var datetimestamp = Date.now();
        cb(null, req.body.user_id);
        profileImgPath = 'http://192.168.43.215:4000/uploads/profile-images/' + req.body.user_id;
        // profileImgPath = 'http://localhost:4000/uploads/profile-images/' + req.body.user_id;
        // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        // profileImgPath = 'http://localhost:4000/uploads/profile-images/' + file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
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
router.get('/getActivities', getActivities);
router.get('/getPlans', getPlans);
router.post('/newActivity', newActivity);
router.post('/newPlan', newPlan);
router.put('/updateteacher/:_id', updateTeacher);
router.get('/:current', getCurrentTeacher);
router.put('/changePassword', changePassword);
router.put('/unique/:user', unique);
router.put('/confirmation', confirmation);
router.post('/authenticate', authenticate);

router.post('/profileImgUpload', profileImgUpload);
module.exports = router;


function getActivities(req, res) {
    teacherService.getActivities()
        .then(function (activities) {
            res.send(activities);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getPlans(req, res) {
    teacherService.getPlans()
        .then(function (plans) {
            res.send(plans);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function newActivity (req, res) {
  teacherService.newActivity(req.body)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function newPlan (req, res) {
  teacherService.newPlan(req.body)
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function _deleteTeacher(req, res) {
    teacherService.deleteTeacher(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTeacher(req, res) {
  console.log('req body :', req.body);
  teacherService.updateTeacher(req.body[0], req.body[1])
      .then(function () {
          res.sendStatus(200);
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function getCurrentTeacher(req, res) {
    teacherService.getTeacherById(req.params.current)
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

function changePassword(req ,res) {
  teacherService.changePassword(req.body[0], req.body[1], req.body[2])
    .then((data) => res.send(data))
    .catch((err) => res.status(400).send(err))
}

function unique(req, res) {
  teacherService.unique(req.params.user)
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
  teacherService.confirmation(req.body[0], req.body[1])
  .then(function () {
    res.sendStatus(200);
  })
  .catch(function (err) {
    res.status(400).send(err);
  })
}

function profileImgUpload(req ,res) {
    upload(req,res,function(err){
            if(err){
                if (err.code = 'LIMIT_FILE_SIZE') err = 'Selected file is too large';
                 res.json({err_code: 1, err_desc: err});
                 return;
            }
            teacherService.profileImgUpload(req.body.user_id, profileImgPath, req.body.type)
                .then(function () {
                    res.json({err_code: 0, err_desc: null});
                })
                .catch(function (err) {
                     res.json({err_code: 1, err_desc: err});
                })
        });
}

function authenticate(req, res) {
    teacherService.authenticate(req.body.username, req.body.password, req.body.type)
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
