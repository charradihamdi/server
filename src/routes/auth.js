const express = require("express");
const {
  signup,
  signin,
  updateUser,
  userInfo,
  uploadProfil,
} = require("../controller/auth");
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");
const upload = multer({ storage });
router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.get("/:id", userInfo);
router.put("/:id", updateUser);
//upload
router.post("/upload/:id", upload.single("file"), uploadProfil);

module.exports = router;
