const express = require("express");
const router = express.Router();
const userController = require("../controller/resetPassword");

router.put("/password/:email", userController.updatePassword);

module.exports = router;
