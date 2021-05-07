const router = require("express").Router();
let Course = require("../model/Course.js");
let User = require("../model/User.js");
let Invitation = require("../model/Invitation.js");


router.route("/add").post((req, res) => {
  const courseID = req.body.courseID;
  const sentByID = req.body.sentByID;
  const sendToID = req.body.sendToID;

  const newInvitation = new Invitation({
    courseID,
    sentByID,
    sendToID
  });

  newInvitation.save(function (err, inv) {
    if (err) {
      res.status(400).json("Error: " + err);
      return;
    }
    User.findOneAndUpdate(
      { userName: sendToID },
      { $push: { mailBox: inv } },
      function (error, success) {
        if (error) {
          res.status(400).json("Error: " + error);
          return;
        }
        res.json(inv);
      }
    );
  });
});

router.route("/accept/:id").get((req, res) => {
  Invitation.findById(req.params.id)
    .then((inv) =>{

      Course.findById(inv.courseID)
       .then((course)=> User.findOneAndUpdate(
         { userName: inv.sendToID },
         { $push: { courses: course }, $pull: { mailBox: inv } },
         function (error, success) {
           if (error) {
             res.status(400).json("Error: " + error);
             return;
           }
         }
       )).catch((err) => {res.status(400).json("Error: " + err);return;});
    })
    .catch((err) => {res.status(400).json("Error: " + err);return;});

  Invitation.findByIdAndDelete(req.params.id)
    .then(() => res.json("Invitation accepted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Invitation.findByIdAndDelete(req.params.id)
    .then(() => res.json("Exercise deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
