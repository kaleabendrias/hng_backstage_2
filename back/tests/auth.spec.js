// tests/auth.spec.js
const request = require("supertest");
const app = require("../index");
const { User, Organisation } = require("../utils/database");

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await User.destroy({ where: {} });
    await Organisation.destroy({ where: {} });
  });

  it("should register user successfully with default organisation", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
      phone: "1234567890",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.firstName).toBe("John");
    expect(response.body.data.user.email).toBe("john@example.com");
    expect(response.body.data.accessToken).toBeDefined();

    const organisation = await Organisation.findOne({
      where: { name: "John's Organisation" },
    });
    expect(organisation).toBeDefined();
  });

  it("should log the user in successfully", async () => {
    // Register user first
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
      phone: "1234567890",
    });

    const response = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "password",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.firstName).toBe("John");
    expect(response.body.data.accessToken).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContain("Email is required");
    expect(response.body.errors).toContain("Password is required");
  });

  it("should fail if there’s duplicate email or userID", async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
      phone: "1234567890",
    });

    const response = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
      phone: "0987654321",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContain("Email already exists");
  });
});
