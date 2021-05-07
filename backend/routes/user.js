const router = require("express").Router();
let Course = require("../model/Course.js");
var User = require("../model/User.js");
let Invitation = require("../model/Invitation.js");
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'yoionoewewdajdsafaf';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.get("/:username", authenticateJWT, (req, res) => {
  User.findOne({ userName: req.params.username }
    ,function(err,user) {
      if(err){
        res.status(400).json("Error: " + err)
      }
      res.json(user); }
  );
    /*.then((user) => {
      /*for (var courseid in user.courses) {
        Course.findById(courseid)
          .then((course) => {
            currentcourse.push(course);
          })
          .catch((err) => res.status(400).json("Error: " + err));
      }*/
      //res.json({ courses: currentcourse, mailBox: user.mailBox });
      /*res.json(user);
    })
    .catch((err) => res.status(400).json("Error: " + err));*/
});


router.route("/login").post((req, res) => {
  User.findOne({ userName: req.body.userName, userPassword:req.body.userPassword}
    ,function(err,user) {
      if(err){
        res.status(400).json("Error: " + err)
      }
      if (!user){
        res.status(400).json("Error")
        return;
      }
      const accessToken = jwt.sign({ userName: user.userName}, accessTokenSecret);
      res.json({
            accessToken
        });
    }
  );
    /*.then((user) => {
      /*for (var courseid in user.courses) {
        Course.findById(courseid)
          .then((course) => {
            currentcourse.push(course);
          })
          .catch((err) => res.status(400).json("Error: " + err));
      }*/
      //res.json({ courses: currentcourse, mailBox: user.mailBox });
      /*res.json(user);
    })
    .catch((err) => res.status(400).json("Error: " + err));*/
});
/*router.route("/:username/:courseId").get((req, res) => {
  User.findOneAndUpdate(
    { userName: req.params.username },
    { $pull: { courses: req.params.courseId } },
    function (error, success) {
      if (error) {
        res.status(400).json("Error: " + error);
        return;
      } else {
        res.json("sucessfully deleted");
      }
    }
  );
});*/


router.route("/invites/:username").get((req, res) => {
  const currentInvitation = [];
  User.findOne({ userName: req.params.username })
    .then((user) => {
      user.mailBox.forEach(function(inv){
        Course.findById(inv.courseID).then((course) => {
          //console.log(inv);
          const curinv = {
            _id: inv._id,
            courseId: inv.courseID,
            sendById: inv.sendByID,
            courseName: course.courseName,
            date: course.date,
            time: course.time
          };
          console.log(currentInvitation)
          currentInvitation.push(curinv);
        }).catch((err) => console.log(err));
      }).then(res.json({ mailBox: currentInvitation }));

    }).catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post((req, res) => {
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;
  const courses = [];
  const mailBox = [];

  const newUser = new User({
    userName,
    userEmail,
    userPassword,
    courses,
    mailBox
  });
  newUser
    .save()
    .then(() => res.json("Register succesfully!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
