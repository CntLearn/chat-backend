// for messenger users
let onlineUsers = [];


const addUser = (newUser, socketId) => {
    // if not already in online state then add it otherwise change the socketId.
    if (onlineUsers.some((user) => user?.user._id === newUser._id)) {
      console.log("already has thisuser ");
      return onlineUsers.map((user) => {
        if (user?.user._id === newUser._id) {
          return {
            user,
            socketId,
          };
        }
      });
    } else {
      onlineUsers.push({ user: { ...newUser }, socketId });
    }
  };

  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user?.socketId !== socketId);
  };

  const findUser = (userId) => {
    return onlineUsers.find((user) => user.user._id === userId);
  };

  module.exports = {
    addUser,
    removeUser,
    findUser,
    onlineUsers
  }