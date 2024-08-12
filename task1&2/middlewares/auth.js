const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    // Get the token from req header
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "token not found" });
    }

    // get the payload from the token
    const payload = await jwt.verify(token, process.env.JWT_SECRET);

    // Assign the poyload to req.user so we can use it throughout the application
    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
