'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    userId: DataTypes.INTEGER,
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Articles',
        key: 'slug'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    commentRevisions: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Comment',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'

    },
    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    body: DataTypes.STRING,
    likesCount: DataTypes.INTEGER,
    likeInfo: DataTypes.TEXT
  }, {});
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.user, {
      foreignKey: 'id', as: 'commentAuthor'
    });
  };
  return Comment;
};
