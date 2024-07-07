const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("Token Generation", () => {
  it("should expire at the correct time and contain the correct user details", () => {
    const userId = "12345";
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(userId);

    // Check expiration time (expiresIn 1 hour)
    const now = Math.floor(Date.now() / 1000);
    expect(decoded.exp).toBeGreaterThan(now);
    expect(decoded.exp).toBeLessThanOrEqual(now + 3600);
  });
});
