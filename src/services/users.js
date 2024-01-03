const { Users } = require("../models");

const register = (user) => {
  return Users.create(user);
};
const findByEmail = (email) => {
  return Users.findOne({ email });
};
const allUsers = (query) => {
  return Users.find(query).select("-password");
};

module.exports = {
  register,
  findByEmail,
  allUsers,
};
