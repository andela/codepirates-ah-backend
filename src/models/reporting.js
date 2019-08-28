'use strict';
module.exports = (sequelize, DataTypes) => {
  const reporting = sequelize.define('reporting', {
    userId: DataTypes.INTEGER,
    articleSlug: DataTypes.STRING,
    reason: DataTypes.ENUM({
      values: ['Rules Violation', 'Spam', 'Harassment']
    })
  }, {});
  reporting.associate = function(models) {
    // associations can be defined here
    reporting.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    reporting.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return reporting;
};