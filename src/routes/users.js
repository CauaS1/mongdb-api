const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', (req, res) => {
  return res.json({ msg: "Salve" });
})

// Update user
router.put('/:id', async (req, res) => {
  const { userId, isAdmin, password } = req.body;
  const { id } = req.params;

  if (userId == id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt)
      } catch (err) {
        return res.status(500).json(err.message);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(id, {
        $set: req.body
      });
      return res.status(200).json("Account has been updated!");
    } catch (err) {
      return res.status(403).json(err);
    }
  } else {
    return res.status(403).json('You can\'t update your account');
  }
})
// Delete user
router.delete('/:id', async (req, res) => {
  const { userId, isAdmin, password } = req.body;
  const { id } = req.params;

  if (userId == id || isAdmin) {
    try {
      await User.findByIdAndDelete({ _id: id });
      return res.status(200).json("Account has been deleted!");
    } catch (err) {
      return res.status(403).json(err);
    }
  } else {
    return res.status(403).json('You can\'t delete your account');
  }
})
// Get all user
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    const { password, updatedAt, ...others } = user._doc; // here, im not showing the password & updatedAt on the request
    return res.json(others);

  } catch (err) {
    return res.status(500).json(err.message);

  }
})
// Follow a user
router.put('/:id/follow', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);

      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } })
        await currentUser.updateOne({ $push: { followings: userId } })
        return res.status(200).json("user has been followed")
      } else {
        return res.status(403).json('you already follow this user');
      }

    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json('You can\'t follow yourself');
  }
})
// Unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);

      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } })
        await currentUser.updateOne({ $pull: { followings: userId } })
        return res.status(200).json("user has been unfollowed")
      } else {
        return res.status(403).json('you don\'t follow this user');
      }

    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json('You can\'t follow yourself');
  }
})

module.exports = router;