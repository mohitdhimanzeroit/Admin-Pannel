const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const { sendMail } = require("../middlewares/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { loginValidation } = require("../validations/authValidation");

const sendResetLink = async (req, res) => {
  try {
    const { error } = loginValidation(req, res);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "EMAIL NOT FOUND!!!" });
    }

    const resetToken = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `http://localhost:8080/users/${user._id}/reset/${resetToken.token}`;
    await sendMail(req.body.email, "RESET PASSWORD LINK", url);

    res.status(201).send({ message: "RESET LINK SENT TO YOUR EMAIL!!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "SERVER ERROR!!!" });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { id, token } = req.params;
    const resetToken = await Token.findOne({ userId: id, token });
    if (!resetToken) {
      return res.status(404).send({ message: "INVALID LINK!!!" });
    }

    return res.send(
      `<h1>Link verified successfully!</h1>
      <script>
      window.setTimeout(() => 
      { window.location.href = "http://localhost:3000/reset/users/${id}/reset/${token}"; }, 3000);
      </script>`);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "SERVER ERROR!!!" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const resetToken = await Token.findOne({ userId: id, token });
    if (!resetToken) {
      return res.status(404).send({ message: "INVALID LINK!!!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });
    await resetToken.deleteOne();

    res.status(200).send({ message: "PASSWORD UPDATED SUCCESSFULLY!!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "SERVER ERROR!!!" });
  }
};

module.exports = {
  sendResetLink,
  verifyResetToken,
  updatePassword,
};