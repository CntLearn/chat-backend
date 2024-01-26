const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    // members: {
    //   type: Array,
    // },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
