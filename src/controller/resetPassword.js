const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.updatePassword = (req, res) => {
  console.log(req);
  const email = req.params.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmedPassword = req.body.confirmedPassword;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify old password
      bcrypt.compare(oldPassword, user.hash_password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        if (!result) {
          return res.status(401).json({ message: "Wrong password" });
        }

        // Verify new password and confirmed password match
        if (newPassword !== confirmedPassword) {
          return res.status(400).json({
            message: "New password and confirmed password do not match",
          });
        }

        // Hash new password and update user
        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          }
          user.hash_password = hash;
          user
            .save()
            .then(() => {
              res
                .status(200)
                .json({ message: "Password updated successfully" });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: err });
            });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
