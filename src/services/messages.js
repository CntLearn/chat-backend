const { Messages } = require("../models");
const send = (message) => {
  return Messages.create(message);
  // .populate("senderId", "-password")
  // .populate("chatId");
};

const all = (query) => {
  return Messages.find(query)
    .populate("senderId", "-password")
    .populate("chatId");
  // .populate("chatId.users");
};

module.exports = {
  send,
  all,
};
