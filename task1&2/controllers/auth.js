const { credentials } = require("../utils/types");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Handle user signup
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input using Zod schema
    const validatedInputs = credentials.safeParse({ username, password });

    if (!validatedInputs.success) {
      const errorMessages = validatedInputs.error.errors.map(
        (err) => err.message
      );
      return res.status(411).json({ msg: errorMessages });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(403)
        .json({ success: false, msg: "User already exists, please login!" });
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    await User.create({ username, password: hashedPassword });

    // Send success response
    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Handle user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input using Zod schema
    const validatedInputs = credentials.safeParse({ username, password });
    if (!validatedInputs.success) {
      const errorMessages = validatedInputs.error.errors.map(
        (err) => err.message
      );
      return res.status(411).json({ msg: errorMessages });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res
        .status(403)
        .json({ success: false, msg: "Please sign up first!" });
    }

    // Compare provided password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password does not match" });
    }

    // Generate a JWT token for the user
    const payload = { id: existingUser._id, username: username };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Send success response with token
    res
      .status(200)
      .json({ success: true, msg: "Signed in successfully", data: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};
