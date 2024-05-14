// for messenger users
let onlineUsers = [];


const addUser = (newUser, socketId) => {
    // if not already in online state then add it otherwise change the socketId.
    if (onlineUsers.some((user) => user?.user._id === newUser._id)) {
      onlineUsers = onlineUsers.map((user) => {
        if (user?.user._id === newUser._id) {
          return {
            user:{...user.user},
            socketId,
          };
        }
        else {
          return user;
        }
      });
    } else {
       const addingNew = {
        user: newUser,
        socketId
       }
      onlineUsers.push(addingNew);
    }
    return onlineUsers
  };

  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user?.socketId !== socketId);
    return onlineUsers;
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