'use strict';
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    ArticleSlug: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    claps: DataTypes.INTEGER,
    status: DataTypes.ENUM({
      values: ['like', 'dislike', 'neutral']
    })
  }, {});
  Likes.associate = (models) => {
    Likes.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Likes.belongsTo(models.Article, {
      foreignKey: 'ArticleSlug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Likes;
};
