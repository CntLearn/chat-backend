const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    isGroup: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamp: { type: true },
  }
);

const Chats = mongoose.model("Chats", chatSchema);

module.exports = Chats;
