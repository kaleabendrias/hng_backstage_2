// tests/organisation.spec.js
const { User, Organisation } = require("../utils/database");

describe("Organisation Access", () => {
  it("should ensure users cannot see data from organisations they don’t have access to", async () => {
    const user = await User.create({
      userId: "12345",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password",
    });
    const organisation = await Organisation.create({
      orgId: "org1",
      name: "Org 1",
    });

    // Associate user with organisation
    await user.addOrganisation(organisation);

    // Fetch organisations for the user
    const organisations = await Organisation.findAll({
      include: [
        {
          model: User,
          where: { id: user.id },
          through: { attributes: [] },
        },
      ],
    });

    // Ensure user can see the organisation they are part of
    expect(organisations.length).toBe(1);
    expect(organisations[0].orgId).toBe("org1");

    // Ensure user cannot see other organisations
    const otherOrganisation = await Organisation.create({
      orgId: "org2",
      name: "Org 2",
    });
    const organisationsAfterCreation = await Organisation.findAll({
      include: [
        {
          model: User,
          where: { id: user.id },
          through: { attributes: [] },
        },
      ],
    });

    expect(organisationsAfterCreation.length).toBe(1);
    expect(organisationsAfterCreation[0].orgId).toBe("org1");
  });
});
