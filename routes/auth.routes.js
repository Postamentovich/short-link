const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const config = require("config");
const router = Router();

router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Incorrect password").isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data on registration"
        });
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate)
        return res.status(400).json({ message: "User already register" });
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User registered" });
    } catch (e) {
      res.status(500).json({ message: "Failed on register" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Incorrect email")
      .normalizeEmail()
      .isEmail(),
    check("password", "Incorrect password").exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data on login"
        });

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (!candidate)
        return res.status(400).json({ message: "Incorrect password or email" });

      const isMatch = await bcrypt.compare(password, candidate.password);
      if (!isMatch)
        return res.status(400).json({ message: "Incorrect password or email" });

      const token = jwt.sign(
        { userId: candidate.id },
        config.get("jwtSecret"),
        {
          expiresIn: "1h"
        }
      );

      res.json({ token, userId: candidate.id });
    } catch (e) {
      res.status(500).json({ message: "Failed on login" });
    }
  }
);

module.exports = router;
