'use strict';
module.exports = (sequelize, DataTypes) => {
  const View = sequelize.define('View', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    IP_address: DataTypes.STRING,
    userType: DataTypes.STRING,
    views: DataTypes.INTEGER
  }, {});
  View.associate = function(models) {
    View.belongsTo(models.user, {
      foreignKey: 'userId',
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    });
    View.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    })
  };
  return View;
};
