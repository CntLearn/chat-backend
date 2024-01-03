const express = require("express");
const authenticateToken = require("../middleware/auth");

const router = express.Router();
const { chatController } = require("../controllers");

// router.route("/").post(authenticateToken);
router.route("/").post(chatController.accessChat);
router.route("/").get(chatController.fetchChats);
router.route("/group").post(chatController.createGroupChat);
router.route("/rename").put(chatController.renameGroup);
router.route("/groupadd").put(chatController.addToGroup);
router.route("/groupremove").put(chatController.removeFromGroup);

module.exports = router;
