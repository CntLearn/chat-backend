const express = require("express");

const router = express.Router();
const { messageController } = require("../controllers");

router.route("/").post(messageController.send);
router.route("/:chatId").get(messageController.all);

module.exports = router;
