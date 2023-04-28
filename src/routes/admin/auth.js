const express = require("express");
const {
  signup,
  signin,
  signout,
  getusers,
  deleteUser,
} = require("../../controller/admin/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../../validators/auth");
const { requireSignin } = require("../../common-middleware");
const router = express.Router();

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/admin/signout", signout);
router.get("/admin/users", getusers);
router.delete("/admin/:id", deleteUser);
module.exports = router;
