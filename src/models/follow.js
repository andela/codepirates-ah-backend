'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followerId: DataTypes.INTEGER,
    followedUserId: DataTypes.INTEGER
  }, {});
  Follow.associate = function(models) {
    // associations can be defined here
    Follow.belongsTo(models.User, {
      foreignKey: 'followerId',
      sourceKey: 'followerId',
      as: 'follower',
      onDelete: 'CASCADE',
    });
    Follow.belongsTo(models.User, {
      foreignKey: 'followedUserId',
      sourceKey: 'followedUserId',
      as: 'followedUser',
      onDelete: 'CASCADE',
    });
  };
  return Follow;
};