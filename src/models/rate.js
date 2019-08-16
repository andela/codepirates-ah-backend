'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rate = sequelize.define('Rate', {
    userEmail: {
      type: DataTypes.STRING,
      references: {
        model: 'users',
        key: 'email',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    articleSlug: {
      type: DataTypes.STRING,
      references: {
        model: 'Articles',
        key: 'slug',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    rate: DataTypes.ENUM({
      values: [1, 2, 3, 4, 5]
    })
  }, {});
  Rate.associate = function (models) {
    Rate.belongsTo(models.user, {
      foreignKey: 'userEmail',
    });
    Rate.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
    });
  };
  return Rate;
};
