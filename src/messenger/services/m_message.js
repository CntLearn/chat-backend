const { M_Message } = require("../../models");

const searchByFilters = (filter) => {
  return M_Message.find(filter).populate("sender", "-password");
};

module.exports = { searchByFilters };
