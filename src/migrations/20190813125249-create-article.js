module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      favorited: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      favoritedcount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      flagged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
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
  down: queryInterface => {
    return queryInterface.dropTable('Articles');
  }
};
