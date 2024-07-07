const request = require("supertest");
const app = require("../index");
const { v4: uuidv4 } = require("uuid");
const { User, Organisation, sequelize } = require("../utils/database");

jest.setTimeout(15000);

const generateUniqueEmail = () => {
  return `user-${uuidv4()}@example.com`;
};

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await User.destroy({ where: {} });
    await Organisation.destroy({ where: {} });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await sequelize.close();
  });

  it("should register user successfully with default organisation", async () => {
    const email = generateUniqueEmail();
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: email,
      password: "password",
      phone: "1234567890",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.firstName).toBe("John");
    expect(response.body.data.user.email).toBe(email);
    expect(response.body.data.accessToken).toBeDefined();

    const organisation = await Organisation.findOne({
      where: { name: "John's Organisation" },
    });
    expect(organisation).toBeDefined();
  });

  it("should log the user in successfully", async () => {
    const email = generateUniqueEmail();
    // Register user first
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: email,
      password: "password",
      phone: "1234567890",
    });

    const response = await request(app).post("/auth/login").send({
      email: email,
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
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        field: "email",
        message: "Email is required.",
      })
    );
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        field: "password",
        message: "Password is required.",
      })
    );
  });

  it("should fail if there’s duplicate email or userID", async () => {
    const email = generateUniqueEmail();
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: email,
      password: "password",
      phone: "1234567890",
    });

    const response = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: email,
      password: "password",
      phone: "0987654321",
    });

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        message: "Email already exists",
      })
    );
  });
});
