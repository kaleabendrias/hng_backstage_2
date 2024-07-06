const bcrypt = require("bcrypt");
const {
  validateRegistration,
  validateLogin,
  validateOrganisation,
} = require("../utils/validation");
const { User, Organisation } = require("../utils/database");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });

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

const register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  const validationErrors = validateRegistration({
    firstName,
    lastName,
    email,
    password,
  });
  if (validationErrors.length > 0) {
    return res.status(422).json({ errors: validationErrors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create default organisation
    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name: `${firstName}'s Organisation`,
    });
    const user = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    // Associate user with organisation
    await user.addOrganisation(organisation);

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

async function login(req, res) {
  const { email, password } = req.body;

  const validationErrors = validateLogin({ email, password });
  if (validationErrors.length > 0) {
    return res.status(422).json({ errors: validationErrors });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
}

const user = async (req, res) => {
  console.log("init1");
  const user = await User.findOne({ where: { userId: req.params.id } });
  console.log("init2");
  if (!user) return res.sendStatus(404);

  res.json({
    status: "success",
    message: "User retrieved successfully",
    data: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
  });
};

const getOrganisations = async (req, res) => {
  console.log("hello");
  try {
    const userId = req.user.userId;
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });

    console.log(`Fetching organisations for userId: ${userId}`);

    const organisations = await Organisation.findAll({
      include: [
        {
          model: User,
          where: { id: user.id },
          through: { attributes: [] }, // Remove join table attributes
        },
      ],
    });

    console.log("Organisations found:", organisations);

    res.json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: {
        organisations: organisations.map((org) => ({
          orgId: org.orgId,
          name: org.name,
          description: org.description,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};

const getSingleOrg = async (req, res) => {
  const userId = req.user.userId; // Assuming req.user is set by the authenticate middleware
  const { orgId } = req.params;

  try {
    // Find the organisation by ID
    const organisation = await Organisation.findOne({
      where: { orgId },
      include: {
        model: User,
        where: { userId },
        attributes: [], // We don't need user attributes in the response
        through: { attributes: [] }, // Assuming you have a through table for many-to-many relationship
      },
    });

    if (!organisation) {
      return res.status(404).json({
        status: "fail",
        message: "Organisation not found or you do not have access to it",
      });
    }

    // Send the organisation data
    return res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error("Error fetching organisation:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the organisation",
    });
  }
};

const createOrg = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  const validationErrors = validateOrganisation({ name, description });
  if (validationErrors.length > 0) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
      errors: validationErrors,
    });
  }

  try {
    // Create new organisation
    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name,
      description,
    });

    // Associate the user with the new organisation
    const user = await User.findOne({ where: { userId } });
    await user.addOrganisation(organisation);

    // Send successful response
    return res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error("Error creating organisation:", error);
    return res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

const addUserToOrg = async (req, res) => {
  const { userId } = req.body;
  const { orgId } = req.params;

  try {
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const organisation = await Organisation.findOne({ where: { orgId } });

    if (!organisation) {
      return res.status(404).json({
        status: "fail",
        message: "Organisation not found",
      });
    }

    await user.addOrganisation(organisation);

    return res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    console.error("Error adding user to organisation:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while adding the user to the organisation",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  user,
  getOrganisations,
  getSingleOrg,
  createOrg,
  addUserToOrg,
};
