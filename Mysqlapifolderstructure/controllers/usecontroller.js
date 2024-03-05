const userModel = require("../models/userModel");

class UserController {
  getAllUsers(req, res) {
    userModel.getAllUsers((err, users) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(users);
    });
  }

  getUserById(req, res) {
    const userId = req.params.id;
    userModel.getUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    });
  }

  createUser(req, res) {
    const newUser = req.body;
    userModel.createUser(newUser, (err, createdUser) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json(createdUser);
    });
  }

  updateUser(req, res) {
    const userId = req.params.id;
    const updatedUser = req.body;
    userModel.updateUser(userId, updatedUser, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    });
  }

  deleteUser(req, res) {
    const userId = req.params.id;
    userModel.deleteUser(userId, (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(204).send();
    });
  }
}

module.exports = new UserController();
