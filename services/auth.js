const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByUsername } = require("../model/user");

async function signup(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(username, hashedPassword);
}

async function login(username, password) {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
  return token;
}

module.exports = { signup, login };
