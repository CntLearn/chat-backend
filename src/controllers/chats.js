const { userController } = require(".");
const { Users } = require("../models");
const { chatServices } = require("../services");

const accessChat = async (req, res) => {
  const loggedUser = req.user; // current logged in user
  const { userId } = req.body; // user with whome that logged user want to make interaction
  if (!loggedUser || !userId) {
    return res.status(500).json({
      success: false,
      message: "Body inludes null values",
      reason: "Something went wrong",
    });
  }

  let query = {
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: loggedUser._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  };
  try {
    let isChat = await chatServices.accessChat(query);

    let isChats = await Users.populate(isChat, {
      path: "lastMessage.senderId",
      select: "name, email, pic",
    });
    // means have previous chats
    if (isChat.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Chats find",
        data: {
          chats: isChat,
        },
      });
    } else {
      // create new chat and return it..
      const chatData = {
        name: "sender",
        isGroup: false,
        users: [loggedUser._id, userId],
      };
      const newChat = await chatServices.createChat(chatData);
      return res.status(200).json({
        success: true,
        message: "Chat created successfully",
        data: {
          chats: newChat,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while find and creating chat",
      reason: error.message || "Something went wrong",
    });
  }
};

const fetchChats = async (req, res) => {
  const userId = req.user._id;
  try {
    // fetch all the chats in which this user is participated.
    const query = {
      users: {
        $elemMatch: { $eq: userId },
      },
    };
    // const chats = await chatServices.findChatsForUser(query);
    const chats = await chatServices.accessChat(query);
    return res.status(200).json({
      success: true,
      message: "Chats find",
      data: {
        chats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while find and creating chat",
      reason: error.message || "Something went wrong",
    });
  }
};

const createGroupChat = async (req, res) => {
  const loggedUser = req.user; // current logged in user
  let { users = [], name = "" } = req.body; // userId user with whom that logged user want to make interaction/chat/communicate

  if (!users.length === 0 || !name) {
    return res.status(500).json({
      success: false,
      message: "Body inludes empty or null values",
      reason: "Something went wrong",
    });
  }

  users.push(loggedUser._id); // including the user of current logged in.

  if (users.length <= 2) {
    return res.status(500).json({
      success: false,
      message: "More than 2 users are required",
      reason: "Something went wrong",
    });
  }

  try {
    const groupData = {
      name,
      users,
      isGroup: true,
      groupAdmin: loggedUser._id,
    };
    let groupChat = await chatServices.createChat(groupData);

    let fullChat = await chatServices.accessChat({ _id: groupChat._id });

    console.log(fullChat);
    // let isChats = await Users.populate(isChat, {
    //   path: "lastMessage.senderId",
    //   select: "name, email, pic",
    // });
    // means have previous chats
    if (fullChat.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Group created.",
        data: {
          chats: fullChat,
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error while creating and fetchingg group chat",
        reason: "Something went wrong",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while find and creating chat",
      reason: error.message || "Something went wrong",
    });
  }
};

const renameGroup = async (req, res) => {
  const { id = "", name = "" } = req.body;

  if (!id || !name) {
    return res.status(500).json({
      success: false,
      message: "Body inludes empty or null values",
      reason: "Something went wrong",
    });
  }

  try {
    const filter = {
      _id: id,
    };
    const update = {
      name,
    };
    const options = {
      new: true,
    };

    const updateChat = await chatServices.findAndUpdate(
      filter,
      update,
      options
    );
    return res.status(200).json({
      success: true,
      message: "Name Updated Successfully.",
      data: {
        chats: updateChat,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while find and creating chat",
      reason: error.message || "Something went wrong",
    });
  }
};

const addToGroup = async (req, res) => {
  const { groupId = "", userId = "" } = req.body;

  if (!groupId || !userId) {
    return res.status(500).json({
      success: false,
      message: "Body inludes empty or null values",
      reason: "Something went wrong",
    });
  }

  try {
    const filter = {
      _id: groupId,
    };
    const update = {
      $push: {
        users: userId,
      },
    };
    const options = {
      new: true,
    };

    const added = await chatServices.findAndUpdate(filter, update, options);
    if (!added) {
      return res.status(200).json({
        success: false,
        message: "User could not be added",
        reason: "Server error Occured",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User Added Successfully.",
        data: {
          chats: added,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while find and updating chat",
      reason: error.message || "Something went wrong",
    });
  }
};

const removeFromGroup = async (req, res) => {
  const { groupId = "", userId = "" } = req.body;

  if (!groupId || !userId) {
    return res.status(500).json({
      success: false,
      message: "Body inludes empty or null values",
      reason: "Something went wrong",
    });
  }

  try {
    const filter = {
      _id: groupId,
    };
    const update = {
      $pull: {
        users: userId,
      },
    };
    const options = {
      new: true,
    };

    const remove = await chatServices.findAndUpdate(filter, update, options);
    if (!remove) {
      return res.status(200).json({
        success: false,
        message: "User could not be removed",
        reason: "Server error Occured",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User Removed Successfully.",
        data: {
          chats: remove,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while find and updating chat",
      reason: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
