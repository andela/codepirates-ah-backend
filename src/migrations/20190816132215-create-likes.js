'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ArticleSlug: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'slug'
          }
      },
      claps: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
        model: 'users',
        key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ['like', 'dislike', 'neutral'],
        defaultValue: 'neutral'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Likes');
  }
};

