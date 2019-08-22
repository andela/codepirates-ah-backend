'use strict';
module.exports = (sequelize, DataTypes) => {
  const AppNotification = sequelize.define('AppNotification', {
    articleSlug: DataTypes.STRING,
    receiverId: DataTypes.INTEGER,
    category: DataTypes.STRING,
    read: DataTypes.BOOLEAN,
    message: DataTypes.STRING
  }, {});
  AppNotification.associate = function(models) {
    // associations can be defined here
  };
  return AppNotification;
};