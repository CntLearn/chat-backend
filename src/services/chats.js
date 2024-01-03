const { Chats } = require("../models");

const accessChat = (query) => {
  // get the info of users from users table using populate, and skip the password property
  return Chats.find(query)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
};

const createChat = (data) => {
  return Chats.create(data);
};

const findChatsForUser = (query) => {
  return Chats.find(query);
};

const findAndUpdate = (filter, update, options) => {
  return Chats.findOneAndUpdate(filter, update, options)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("lastMessage");
};

module.exports = {
  accessChat,
  createChat,
  findChatsForUser,
  findAndUpdate,
};
