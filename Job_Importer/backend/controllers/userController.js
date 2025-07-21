const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//login user by password 
const loginByPassword = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !userName?.trim()) {
      return res
        .status(400)
        .json({ message: "Please enter user name", success: false });
    }

    if (!password || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Please enter password", success: false });
    }

    //find user
    const user = await UserModel.findOne({
      $or: [{ uniqueId: userName }, { email: userName }, { mobile: userName }],
      status: { $ne: "Delete" },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please check user name.",
        success: false,
      });
    }

    //match password
    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.status(400).json({
        message: "Invalid password. Please enter correct password.",
        success: false,
      });
    }

    //set token
    const jwtToken = jwt.sign(
      { userUuid: user.userUuid, role: user.role },
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .json({ message: "Login Success.", success: true, token: jwtToken });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};



module.exports = { loginByPassword };
