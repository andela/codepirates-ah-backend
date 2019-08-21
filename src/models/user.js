'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'normal' },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: { type: DataTypes.STRING, defaultValue: 'normal' },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {});

  user.associate = ({
    Follow, Article

  }) => {
    user.hasMany(Follow, {
      foreignKey: 'followerId',
      as: 'followerDetails'
    });
    user.hasMany(Article, {
      as: 'author',
      foreignKey: 'authorId'
    })
  };
  return user;
};
