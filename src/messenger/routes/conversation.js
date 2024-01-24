const router = require("express").Router();
const { Conversation } = require("../../models");
const { userServices } = require("../../services");
// new Conversation

router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });

  try {
    const savedConversation = await newConversation.save();

    res
      .status(200)
      .json({ success: true, data: { conversation: savedConversation } });
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
    let conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    if (conversation.length === 0) {
      return res.status(200).json({ success: true, data: { conversation } });
    }
    let members = conversation[0]?.members;

    const friendId = members[0] === userId ? members[1] : members[0];

    const friendInfo = await userServices.allUsers({ _id: friendId });

    members = members.map((member) => {
      if (member !== userId) {
        return friendInfo[0];
      }
      // return member !== userId
      //   ? { [friendId]: friendInfo[0] }
      //   : { [userId]: userId };
    });

    let temp = [...conversation];
    temp[0].members = members;

    res.status(200).json({ success: true, data: { conversation: temp } });
  } catch (error) {
    res.status(500).json({
      success: false,
      reason: error,
      message: error.message || "Internal server error occurred",
    });
  }
});

module.exports = router;
