'use strict';
module.exports = (sequelize, DataTypes) => {
  const DroppedToken = sequelize.define('DroppedToken', {
    identifier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invalidToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});
  DroppedToken.associate = function (models) {
    // associations can be defined here
  };
  return DroppedToken;
};
