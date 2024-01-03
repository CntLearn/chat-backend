const express = require("express");
const router = express.Router();
const userRoute = require("./users");
const chatsRoute = require("./chats");
const messageRoute = require("./messages");
const authenticateToken = require("../middleware/auth");

const routes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/chats",
    route: chatsRoute,
  },
  {
    path: "/messages",
    route: messageRoute,
  },
];

routes.forEach((route) => {
  if (route.path !== "/users") {
    // add auth here.
    // instead of passing auth to next file in every route pass here.
    router.use(route.path, authenticateToken, route.route);
  } else {
    router.use(route.path, route.route);
  }
});

module.exports = router;
