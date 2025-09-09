const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  console.log("Auth middleware - cookies:", req.cookies);
  console.log("Auth middleware - headers:", req.headers);

  const { token } = req.cookies;

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    console.log("Verifying token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);

    const user = await userModel.findById(decoded.id);
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

module.exports = {
  authUser,
};
