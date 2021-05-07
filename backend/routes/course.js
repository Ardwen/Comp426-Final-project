const router = require('express').Router();
let Course = require('../model/Course.js');
let User = require('../model/User.js');
let Invitation = require('../model/Invitation.js')

router.route('/add').post((req, res) => {
  const courseName = req.body.courseName;
  const date = req.body.date;
  const time = req.body.time;
  const participants = req.body.participants;
  const hostName = req.body.host;

  const newCourse = new Course({
    courseName,
    date,
    time,
    participants
  });

  newCourse.save(function (err, curcourse) {

    if (err) {
      res.status(400).json('Error: ' + err); return;
    }

    User.findOneAndUpdate(
      { userName: hostName},
      { $push: { courses: curcourse} },
      {returnOriginal:false},
      function (error, success) {
           if (error) {
              res.status(400).json('Error: ' + error); return;
           }
        const courseID = curcourse._id;
        const sentByID = hostName;
        participants.forEach(
          function(participant){
             const sendToID = participant;
             console.log(sendToID)
             const newInvitation = new Invitation({
               courseID,
               sentByID,
               sendToID,
               courseName,
               date,
               time
             });
             newInvitation.save(function (err, inv) {
               if (err) {
                 console.log(err);
               }
               User.findOneAndUpdate(
                 { userName: sendToID },
                 { $push: { mailBox: inv } },
                 function (error, success) {
                   if (error) {
                     console.log(error);
                   }
                 }
               );
             });
        });
     });
     res.json(curcourse);
   });
});

router.route('/:id').get((req, res) => {
  Course.findById(req.params.id)
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:username/:id').delete((req, res) => {
  User.updateOne({userName:req.params.username }, { "$pull": { "courses": { "_id":req.params.id } } }, { safe: true,multi:true}, function(err, obj) {
  }
 ).then(exercise => res.json(exercise))
 .catch(err => res.status(400).json('Error: ' + err));
 });


router.route('/update/:id').post((req, res) => {
  Course.findById(req.params.id)
    .then(course => {
      course.courseName = req.body.courseName;
      course.time = req.body.time;
      course.date = Date.parse(req.body.date);
      course.participants = req.body.participants;
      course.save()
        .then(() => res.json('Course updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
