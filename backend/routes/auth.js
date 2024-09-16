const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "lmao";

//ROUTE 1: Creating a User using POST "/api/auth/createuser" . no login
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must br atleast 8 Characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success = false;

    // if errors, send bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check whether user with same email exists already
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "Sorry a User with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      //payload      jwt: header-payload-signature
      const data = {
        user: {
          id: user.id,
        },
      };

      success = true;
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Error Occured");
    }
  }
);

//ROUTE 2: Authenticating a User using POST "/api/auth/login" . no login req
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if errors, send bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    let success = false;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json("Try Again");
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json("Try Again");
      }

      //payload      jwt: header-payload-signature
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Internal Server Error");
    }
  }
);

// Route 3: Get logged in User Details using: POST "/api/auth/getuser". Login req
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
