'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define('Favorites', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  Favorites.associate = function(models) {
    // associations can be defined here
  };
  return Favorites;
};