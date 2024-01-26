const { Conversation } = require("../../models");

const searchByFilters = (filter) => {
  return Conversation.find(filter).populate("members", "-password");
};

module.exports = { searchByFilters };
