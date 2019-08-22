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
    subscribed: {defaultValue: false, type: DataTypes.BOOLEAN },
    inAppNotification: { defaultValue: false, type: DataTypes.BOOLEAN },
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
    user.belongsToMany(Article, {
      through: 'BookMarks',
      as: 'articles',
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  };
  return user;
};
