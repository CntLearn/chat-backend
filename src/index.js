const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
dotenv.config();
const mongoConnection = require("./config/db");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errors");
const messenger = require("./messenger");

const port = process.env.PORT || 5000;

// import messenger events required data from the onlineUsers file.
const { addUser, removeUser, findUser, onlineUsers } = require('./OnlineUsers');

mongoConnection();
// to get data from body
app.use(express.json());
//get data from url encoded, to get data from query
app.use(express.urlencoded({ extended: true }));

// to handle cors
const corsOptions = {
  // origin: "http://localhost:3000",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Service is listening OK");
});

app.use("/api", routes);
app.use("/api/messenger", messenger);

/// error handlers
app.use(notFound);
app.use(errorHandler);

// app.listen(5000, () => {
//   console.log("listening on port", 5000);
// });

// now start working with the socket.io

const server = app.listen(port, () => {
  console.log("Server Listening on port", port);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});


io.on("connection", (socket) => {
  console.log("Connected to Socket.io");
  // const count = io.engine.clientsCount;

  // initial setup , 1
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    // setTimeout(() => {
    //   socket.emit("audio");
    // }, 5000);
  });

  // on joining a room / single chat. 2
  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("joined user to a Room : ", roomId);
  });

  socket.on("typing", (roomId) => socket.in(roomId).emit("typing"));
  socket.on("stop typing", (roomId) => socket.in(roomId).emit("stop typing"));

  socket.on("send message", (newMessage) => {
    let chat = newMessage.chatId;

    if (!chat.users) return console.log("no users found in this chat");

    // now the idea is don't send event to the sender user. all other users will receive message/event/notification

    chat.users.forEach((user) => {
      // dont send event to the sender user
      if (user._id === newMessage.senderId._id) return;

      // as in the 1 step above, we have created a room with the user id./ emit to that room
      socket.in(user._id).emit("message received", newMessage);
    });
  });

  //
  socket.off("setup", () => {
    console.log("user left is ");
    socket.leave(userData._id);
  });

  // MESSENGER EVENTS SETUP.

  socket.on("addUser", (newUser) => {
    console.log("new users ", newUser);
    if (!newUser) return;
    addUser(newUser, socket.id);
    // update the status of online users.
    io.emit("getUsers", onlineUsers);
  });

  // send and receive messages.
  socket.on("sendMessage", (message) => {
    // in message object
    // console.log("message: ", message);
    const receiverUser = findUser(message.receiverId);
    if (!receiverUser) return;
    // console.log("receiver User details : ", receiverUser);
    const msg = {
      sender: message.sender,
      text: message.text,
      createdAt: new Date(),
    };
    console.log("emit just once ");
    socket.to(receiverUser.socketId).emit("getMessages", msg);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    // update the status of online users.
    io.emit("getUsers", onlineUsers);
  });
});