const router = require("express").Router();
const { M_Message } = require("../../models");
const { searchByFilters } = require("../services/m_message");

// send message
router.post("/", async (req, res) => {
  const { conversationId, sender, text } = req.body;

  const newMessage = new M_Message({
    conversationId,
    sender,
    text,
  });

  try {
    const savedMessage = await newMessage.save();

    const filters = {
      _id: savedMessage._id,
    };

    const messages = await searchByFilters(filters);

    res.status(200).json({ success: true, data: { message: messages } });
  } catch (error) {
    res.status(500).json({
      success: false,
      reason: error,
      message: error.message || "Internal server error occurred",
    });
  }
});

// get conversation of a user

router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const filters = {
      conversationId,
    };

    const messages = await searchByFilters(filters);

    res.status(200).json({ success: true, data: { messages } });
  } catch (error) {
    res.status(500).json({
      success: false,
      reason: error,
      message: error.message || "Internal server error occurred",
    });
  }
});

module.exports = router;
