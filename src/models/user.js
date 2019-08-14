'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    role: {type:DataTypes.STRING, defaultValue: 'normal'},
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
  }, {});
  user.associate = function(models) {
    user.hasMany(models.Article, {
      as:'author',
      foreignKey:'authorId'
    })
  };
  return user;
};
