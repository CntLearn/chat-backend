const router = require("express").Router();
const { Conversation } = require("../../models");
const { searchByFilters } = require("../services/conversation");
// new Conversation

router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });

  try {
    const savedConversation = await newConversation.save();

    const filters = {
      _id: savedConversation._id,
    };

    const conversation = await searchByFilters(filters);

    res.status(200).json({
      success: true,
      data: { conversation: conversation },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      reason: error,
      message: error.message || "Internal server error occurred",
    });
  }
});

// get conversation of a user

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const filters = {
      members: { $in: [userId] },
    };

    let conversation = await searchByFilters(filters);

    if (conversation.length === 0) {
      return res.status(200).json({ success: true, data: { conversation } });
    }

    res.status(200).json({ success: true, data: { conversation } });
  } catch (error) {
    res.status(500).json({
      success: false,
      reason: error,
      message: error.message || "Internal server error occurred",
    });
  }
});

module.exports = router;
