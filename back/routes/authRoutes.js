const { Router } = require("express");
const authControllers = require("../controllers/authController");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });

  const token = authHeader.split(" ")[1];
  console.log(token);
  if (!token)
    return res
      .status(401)
      .json({ status: "error", message: "Token not found" });

  try {
    const user = getUserFromToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};

const router = Router();

const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

router.post("/auth/register", authControllers.register);
router.post("/auth/login", authControllers.login);
router.get("/api/users/:id", authenticateToken, authControllers.user);
router.get(
  "/api/organisations",
  authenticateToken,
  authControllers.getOrganisations
);
router.get(
  "/api/organisations/:orgId",
  authenticateToken,
  authControllers.getSingleOrg
);

router.post("/api/organisations", authenticateToken, authControllers.createOrg);

router.post(
  "/api/organisations/:orgId/users",
  authenticateToken,
  authControllers.addUserToOrg
);

module.exports = router;
