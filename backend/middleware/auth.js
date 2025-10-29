const { admin } = require("../firebase");
const UserService = require("../services/UserService");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const user = await UserService.findByUID(decodedToken.uid);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = UserService.toJSON(user);
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Access denied" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient permissions" });
    }

    next();
  };
};

module.exports = { auth, authorize };
