const express = require("express");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const multer = require("multer");
const userRoute = require("./routes/users");
// const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/m_message");
const router = express.Router();
// const path = require("path");

// app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware;
// app.use(helmet());
// app.use(morgan("common"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("File uploded successfully");
//   } catch (error) {
//     console.error(error);
//   }
// });

// app.use("/api/auth", authRoute);
router.use("/users", userRoute);
router.use("/posts", postRoute);
router.use("/conversation", conversationRoute);
router.use("/message", messageRoute);

module.exports = router;
