function validateRegistration(data) {
  const errors = [];

  if (!data.firstName) {
    errors.push({
      field: "firstName",
      message: "First name is required.",
    });
  }

  if (!data.lastName) {
    errors.push({
      field: "lastName",
      message: "Last name is required.",
    });
  }

  if (!data.email) {
    errors.push({
      field: "email",
      message: "Email is required.",
    });
  } else if (!isValidEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Email is not valid.",
    });
  }

  if (!data.password) {
    errors.push({
      field: "password",
      message: "Password is required.",
    });
  }

  return errors;
}

function validateLogin(data) {
  const errors = [];

  if (!data.email) {
    errors.push({
      field: "email",
      message: "Email is required.",
    });
  }

  if (!data.password) {
    errors.push({
      field: "password",
      message: "Password is required.",
    });
  }

  return errors;
}

function isValidEmail(email) {
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateOrganisation(data) {
  const errors = [];
  if (!data.name) {
    errors.push({
      field: "name",
      message: "name is required.",
    });
  }

  if (!data.description) {
    errors.push({
      field: "description",
      message: "description is required.",
    });
  }
  return errors;
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateOrganisation,
};
