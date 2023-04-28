const express = require("express");
const { signup, signin, updateUser, userInfo } = require("../controller/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.get("/:id", userInfo);
router.put("/:id", updateUser);

module.exports = router;
