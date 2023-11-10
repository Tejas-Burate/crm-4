const User = require("../model/user");

const register = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.create({ userName, password });

    if (!user) {
      return res.status(400).json({
        status: 400,
        error: "Authentication Failed",
        message: "Failed to create user",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User registered successfully",
      data: { userName: user.userName, userId: user._id },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      message: "Something went wrong while registering user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const auth = await User.findOne({ userName, password });

    if (!auth) {
      res
        .status(400)
        .json({ status: 400, error: "400", message: "Authentication Failed" });
      return;
    }

    res.status(200).json("Login Successful..");
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  login,
  register,
};
