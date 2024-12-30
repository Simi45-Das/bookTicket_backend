const connectToDB = require("../config/dbconfig");

async function createUser(username, hashedPassword) {
  const connection = await connectToDB();
  await connection.execute(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword]
  );
  await connection.end();
}

async function findUserByUsername(username) {
  const connection = await connectToDB();
  const [users] = await connection.execute(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  await connection.end();
  return users[0];
}

module.exports = { createUser, findUserByUsername };
