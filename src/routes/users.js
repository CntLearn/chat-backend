const express = require("express");
const router = express.Router();

const { userController } = require("../controllers");
const authenticateToken = require("../middleware/auth");

router
  .route("/")
  .post(userController.register)
  .get(authenticateToken, userController.allUsers);

router.route("/login").post(userController.login);

module.exports = router;
