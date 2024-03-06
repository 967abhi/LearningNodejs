const dbConfig = require("../src/config/dbConfig");

class UserModel {
  getAllUsers(callback) {
    const sql = "SELECT * FROM users";
    dbConfig.getConnection().query(sql, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }

  getUserById(userId, callback) {
    const sql = "SELECT * FROM users WHERE id = ?";
    dbConfig.getConnection().query(sql, [userId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results[0]);
    });
  }

  createUser(user, callback) {
    const { username, email } = user;
    const sql = "INSERT INTO users (username, email) VALUES (?, ?)";
    dbConfig.getConnection().query(sql, [username, email], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      const createdUserId = results.insertId;
      this.getUserById(createdUserId, callback);
    });
  }

  updateUser(userId, updatedUser, callback) {
    const { username, email } = updatedUser;
    const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
    dbConfig.getConnection().query(sql, [username, email, userId], (err) => {
      if (err) {
        return callback(err);
      }
      this.getUserById(userId, callback);
    });
  }

  deleteUser(userId, callback) {
    const sql = "DELETE FROM users WHERE id = ?";
    dbConfig.getConnection().query(sql, [userId], (err) => {
      if (err) {
        return callback(err);
      }
      return callback(null);
    });
  }
}

module.exports = new UserModel();
