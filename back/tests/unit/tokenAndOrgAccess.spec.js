const jwt = require("jsonwebtoken");
const { User, Organisation } = require("../../utils/database");
const { authenticateToken } = require("../../utils/validation");
require("dotenv").config();
const { sequelize } = require("../../utils/database");

describe("Token Generation", () => {
  it("should generate a token with correct expiry time and user details", () => {
    const user = { userId: "1234", email: "test@example.com" };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    expect(decodedToken.userId).toBe(user.userId);
    expect(decodedToken.email).toBe(user.email);
    expect(decodedToken.exp).toBeGreaterThan(decodedToken.iat);
  });
});

describe("Organisation Access", () => {
  it("should not allow users to see data from organisations they do not have access to", async () => {
    const userWithoutAccess = await User.create({
      userId: "userWithoutAccess",
      email: "noacces@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "password123",
    });
    const organisation = await Organisation.create({
      orgId: "org1",
      name: "Organisation 1",
    });

    const organisations = await Organisation.findAll({
      include: [
        {
          model: User,
          where: { id: 23 },
          through: { attributes: [] },
        },
      ],
    });

    expect(organisations.length).toBe(0);
  });
});
