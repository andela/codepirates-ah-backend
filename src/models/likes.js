'use strict';
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    parentID: DataTypes.INTEGER,
    commentable: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    status: DataTypes.ENUM({
      values: ['like', 'dislike', 'neutral']
    })
  }, {});
  Likes.associate = (models) => {
    Likes.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Likes.belongsTo(models.Article, {
      foreignKey: 'parentID',
      constraints: false,
      as: 'post',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Likes.belongsTo(models.Comment, {
      foreignKey: 'parentID',
      constraints: false,
      as: 'comment',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Likes;
};
