const mongoose = require("mongoose");

const mongoConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      // these has no effect since node.js driver version 4.00.
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    console.log("Mongo connected : ", conn.connection.host);
  } catch (err) {
    console.log("Error connecting : ", err.message);
    process.exit();
  }
};

module.exports = mongoConnection;
