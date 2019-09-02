'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userEmail: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'email',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      articleSlug: {
        type: Sequelize.STRING,
        references: {
          model: 'Articles',
          key: 'slug',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      rate: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Rates');
  }
};
