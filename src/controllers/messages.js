const { Users, Chats } = require("../models");
const { messageServices, chatServices } = require("../services");

const send = async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || !chatId) {
    return res.status(500).json({
      success: false,
      message: "Body inludes Null Values",
      reason: "Something went wrong",
    });
  }
  try {
    const newMessage = {
      senderId: req.user._id,
      content: message,
      chatId,
    };

    var messageResult = await messageServices.send(newMessage);
    messageResult = await messageResult.populate("senderId", "name pic");
    messageResult = await messageResult.populate("chatId");
    messageResult = await messageResult.populate(
      "chatId.users",
      "_id name email pic"
    );

    // update latest message of this chat by making and calling Chat service.
    const options = {
      new: true,
    };

    const filters = {
      _id: chatId,
    };
    const update = {
      lastMessage: messageResult._id,
    };

    const chatSerRes = await chatServices.findAndUpdate(
      filters,
      update,
      options
    );

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: {
        message: messageResult,
      },
    });
  } catch (error) {
    console.log("message error : ", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while sending the message",
      reason: error,
    });
  }
};

const all = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(500).json({
      success: false,
      message: "Body || Params inludes Null Values",
      reason: "Something went wrong",
    });
  }
  try {
    const query = { chatId };

    let result = await messageServices.all(query);
    // result = await result.populate("lastMessage");
    // result = await Chats.populate(result, {
    //   path: "chatId.lastMessage",
    //   select: "_id name email pic",
    // });

    result = await Users.populate(result, {
      path: "chatId.users",
      select: "_id name email pic",
    });

    return res.status(200).json({
      success: true,
      message: "Message fetched successfully",
      data: {
        messages: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while fetching the message",
      reason: error,
    });
  }
};

module.exports = {
  send,
  all,
};
