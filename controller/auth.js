const { signup, login } = require("../services/auth");

async function signupController(req, res) {
  try {
    await signup(req.body.username, req.body.password);
    res.status(201).send("Signup successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function loginController(req, res) {
  try {
    const token = await login(req.body.username, req.body.password);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).send(err.message);
  }
}

module.exports = { signupController, loginController };
