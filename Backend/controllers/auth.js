
const crypto = require('crypto');
const User = require("../models/users");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");

const createToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  createToken(user, 200, res);
});

const loginError = (msg, code, next) => {
  const error = { name: "LoginError" };
  (error.message = msg), (error.code = code);
  return next(error);
};

exports.login = asyncHandler(async (req, res, next) => {
  const { userName, password } = req.body;
  if (!userName || !password)
    loginError("Please provide an email and password", 400, next);
  else {
    const user = await User.findOne({ userName }).select("+password");
    if (!user) loginError("Invalid credentials", 401, next);
    else {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) loginError("Invalid credentials", 401, next);
      else {
        createToken(user, 200, res);
      }
    }
  }
});

exports.logout = asyncHandler(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  };
  res.cookie('token', 'none', options)
  res.status(200).json({
    success: true,
    data: {}
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { userName, reqLink } = req.body;
  const user = await User.findOne({ userName: userName });
  if (!user) loginError("The user does not exist", 401, next);
  else {
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${reqLink}?resetToken=${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the link to reset password: \n\n ${resetUrl}`;
    try {
      await sendEmail({
        email: user.userName,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({ success: true, data: 'Email sent'});
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      loginError('Email could not be sent', 500, next);
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) loginError('Invalid Token', 400, next);
  else {
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    createToken(user, 200, res);
  }
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user.matchPassword(req.body.currentPassword)) loginError('Password is incorrect', 401);
  else {
    user.password = req.body.newPassword;
    await user.save();

    createToken(user,200, res);
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      loginError("Unauthorized Access", 403, next);
    next();
  };
};
