const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    content: { type: String, trim: true },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Messages", messageSchema);

module.exports = Messages;
