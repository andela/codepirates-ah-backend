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
    body: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.user,{
      foreignKey:'id',as:'commentAuthor'
    });
  };
  return Comment;
};