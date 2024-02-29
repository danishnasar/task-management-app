const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const User = require("../models/users");

const loginError = (msg, code, next) => {
    const error = { name: "LoginError" };
    (error.message = msg), (error.code = code);
    return next(error);
};


exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) token = req.cookies.token;

  if (!token) loginError('Unauthorized Access', 401, next);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    loginError('Unauthorized Access', 401, next);
  }
});
