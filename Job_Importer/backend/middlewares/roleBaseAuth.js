const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//token authentication
const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Token is required." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Token is required." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({
          message: "Unauthorized. Invalid or expired token.",
          success: false,
        });

      req.user = decoded; // Store user info in request

      next();
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized. Invalid or expired token.",
      success: false,
    });
  }
};

//role authentication
const authRole = (...allowRoles) => {
  try {
    return (req, res, next) => {
      if (!req.user || !allowRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied.", success: false });
      }
      next();
    };
  } catch (error) {
    return res.status(401).json({
      message: "Access denied.",
      success: false,
    });
  }
};

module.exports = { authUser, authRole };