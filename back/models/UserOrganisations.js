const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserOrganisations = sequelize.define("UserOrganisations", {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "userId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    orgId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Organisations",
        key: "orgId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  return UserOrganisations;
};
