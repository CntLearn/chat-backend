const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    try {
      // decode the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authuntication Failed due to Token Invalidity",
        reason: error.message || "Something went wrong",
      });
    }
  } else {
    return res.status(500).json({
      success: false,
      message: "Authuntication Failed",
      reason: "Something went wrong",
    });
  }
};
module.exports = authenticateToken;
