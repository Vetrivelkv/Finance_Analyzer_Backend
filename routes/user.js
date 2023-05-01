const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRE, SECRET } = require("../constants");

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isadmin: req.body.isAdmin,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send("the user cannot be created");
  }
  res.send(user);
});

router.post("/login", async (req, res) => {
  const checkUser = await User.findOne({
    email: req.body.email.toLowerCase(),
  });

  const user = await User.find({ email: req.body.email });

  if (!checkUser) {
    res.send(500).json({ success: false, message: "User not found" });
  }

  if (req.body.password === user[0].password) {
    var token = jwt.sign({ checkUser }, SECRET, {
      expiresIn: TOKEN_EXPIRE, // expires in 24 hours
      //expiresIn:10
    });
    res.status(200).send({
      userId: user[0].id,
      isAdmin: user[0].isadmin,
      status: true,
      message: "Logged in success",
      token: token,
    });
  } else {
    res.status(500).send({
      status: false,
    });
  }
});

router.post("/verifytoken", async (req, res) => {
  try {
    const { token } = req.body;
    const checkUser = jwt.verify(token, SECRET);
    res.status(200).send({
      data: checkUser.checkUser,
    });
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
