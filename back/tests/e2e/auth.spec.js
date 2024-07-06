const request = require("supertest");
const app = require("../../index"); // Ensure this points to your Express app
const { sequelize } = require("../../utils/database");

describe("POST /auth/register", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  it("should register user successfully with default organisation", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "johndo@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user.firstName).toBe("John");
    expect(res.body.data.user.email).toBe("johndoe@example.com");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      email: "johndoe@example.com",
      password: "password123",
    });

    expect(res.status).toBe(422);
    expect(res.body.errors).toContain("Last name is required");
  });

  it("should fail if there is a duplicate email", async () => {
    await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(res.status).toBe(422);
    expect(res.body.errors).toContain("Email already exists");
  });
});
