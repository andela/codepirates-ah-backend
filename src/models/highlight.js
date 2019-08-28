'use strict';
module.exports = (sequelize, DataTypes) => {
  const Highlight = sequelize.define('Highlight', {
    userId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER,
    text: {type: DataTypes.TEXT, allowNull: false },
    comment: DataTypes.TEXT,
    startindex: DataTypes.INTEGER,
    endindex: DataTypes.INTEGER
  }, {});
  Highlight.associate = function(models) {
    Highlight.belongsTo(models.Article, {
      as: 'highlight',
      foreignKey: 'articleId',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Highlight;
};
