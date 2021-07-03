const router = require('express').Router();
const bcrypt = require("bcrypt");
const User = require('../models/User.js');

//Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      username: username,
      email: email,
      password: hashedPassword
    });

    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (error) {
    res.json({ msg: error.message });
  }
});

//Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email: email
    });
    !user && res.status(404).send('user not found!')

    const validPassword =  await bcrypt.compare(password, user.password)
    !validPassword && res.status(400).send('Wrong password!');

    res.status(200).json(user)

  } catch (err) {
    return res.status(404).json({ msg: err.message })
  }
});

//stoped at 35min

module.exports = router;