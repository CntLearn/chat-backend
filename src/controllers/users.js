const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");
const { userServices } = require("../services");

const register = async (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log(req.body);

  if (!name || !email || !password) {
    return res.status(500).json({
      success: false,
      message: "Body inludes null values",
      reason: "Something went wrong",
    });
  }

  const isExist = await userServices.findByEmail(email);

  if (isExist) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email address",
      reason: "Something went wrong",
    });
  }

  try {
    const created = await userServices.register({
      name,
      email,
      password,
      ...(pic && { pic }),
    });
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          _id: created._id,
          email: created.email,
          name: created.name,
          pic: created.pic,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create user with this email address",
      reason: error.message || "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "Body inludes null values",
      reason: "Something went wrong",
    });
  }

  try {
    const userExist = await userServices.findByEmail(email);

    if (!userExist) {
      return res.status(500).json({
        success: false,
        message: "User name or password is incorrect",
        reason: "Something went wrong",
      });
    }
    const isPasswordMatch = await userExist.matchPassword(password);

    if (userExist && isPasswordMatch) {
      return res.status(200).json({
        success: true,
        message: "User Found.",
        data: {
          user: {
            _id: userExist._id,
            email: userExist.email,
            name: userExist.name,
            pic: userExist.pic,
            test: userExist.test,
            token: generateToken({
              _id: userExist._id,
              email: userExist.email,
              name: userExist.name,
            }),
          },
        },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "User name or password is incorrect",
        reason: "Something went wrong",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to log the user.",
      reason: error.message || "Something went wrong",
    });
  }
};

const allUsers = async (req, res) => {
  console.log(req.query);
  const { search = "" } = req.query;
  console.log(req.user._id);
  // check why thsis is fiving e the whole users.
  const query = search
    ? {
        $and: [
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
          { _id: { $ne: req.user._id } },
        ],
      }
    : {};

  try {
    const users = await userServices.allUsers(query);

    return res.status(200).json({
      success: true,
      message: "Users list",
      data: {
        users: users,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user(s).",
      reason: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  register,
  login,
  allUsers,
};
