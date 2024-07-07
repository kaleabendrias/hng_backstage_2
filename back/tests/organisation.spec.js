// const request = require("supertest");
// const app = require("../index");
// const { v4: uuidv4 } = require("uuid");
// const { User, Organisation, sequelize } = require("../utils/database");

// jest.setTimeout(15000);

// const generateUniqueEmail = () => {
//   return `user-${uuidv4()}@example.com`;
// };

// describe("Organisation Access", () => {
//   beforeEach(async () => {
//     // Clear the database before each test
//     await User.destroy({ where: {} });
//     await Organisation.destroy({ where: {} });
//   });

//   afterAll(async () => {
//     // Close the database connection after all tests
//     await sequelize.close();
//   });

//   it("should ensure users cannot see data from organisations they don’t have access to", async () => {
//     const email = generateUniqueEmail();
//     const password = "password";

//     // Register a user
//     await request(app).post("/auth/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: email,
//       password: password,
//       phone: "1234567890",
//     });

//     // Login to get the token
//     const loginResponse = await request(app).post("/auth/login").send({
//       email: email,
//       password: password,
//     });

//     const token = loginResponse.body.data.accessToken;

//     // Create a new organisation and associate it with the user
//     const organisationResponse = await request(app)
//       .post("/organisations")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         name: "Org 1",
//       });

//     const organisationId = organisationResponse.body.data.organisation.orgId;

//     // Fetch organisations for the user
//     const userOrganisationsResponse = await request(app)
//       .get("/organisations")
//       .set("Authorization", `Bearer ${token}`);

//     // Ensure user can see the organisation they are part of
//     expect(userOrganisationsResponse.status).toBe(200);
//     expect(userOrganisationsResponse.body.data.length).toBe(1);
//     expect(userOrganisationsResponse.body.data[0].orgId).toBe(organisationId);

//     // Create another organisation that the user does not have access to
//     await request(app).post("/organisations").send({
//       name: "Org 2",
//     });

//     // Fetch organisations again
//     const userOrganisationsAfterCreationResponse = await request(app)
//       .get("/organisations")
//       .set("Authorization", `Bearer ${token}`);

//     // Ensure user cannot see the other organisation
//     expect(userOrganisationsAfterCreationResponse.status).toBe(200);
//     expect(userOrganisationsAfterCreationResponse.body.data.length).toBe(1);
//     expect(userOrganisationsAfterCreationResponse.body.data[0].orgId).toBe(
//       organisationId
//     );
//   });
// });
