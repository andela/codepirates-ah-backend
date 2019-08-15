'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followerId: DataTypes.INTEGER,
    followedUserId: DataTypes.INTEGER
  }, {});
  Follow.associate = ({ user }) => {
    // associations can be defined here
    Follow.belongsTo(user, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE',
      as: 'authorDetails'
    });
    Follow.belongsTo(user, {
      foreignKey: 'followedUserId',
      onDelete: 'CASCADE',
      as: 'followerDetails'
    });
  };
  return Follow;
};