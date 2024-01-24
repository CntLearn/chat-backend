const mongoose = require("mongoose");

const M_messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    // sender: {
    //   type: String,
    // },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    text: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const M_Message = mongoose.model("M_Message", M_messageSchema);

module.exports = M_Message;
