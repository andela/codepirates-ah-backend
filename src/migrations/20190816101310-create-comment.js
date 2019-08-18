import { sequelize } from '../models';

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      articleSlug: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.STRING
      },
      commentRevisions: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parentCommentId: {
        type: Sequelize.INTEGER,
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
    }).then(() => sequelize.query(`ALTER TABLE "Comments"
    ADD CONSTRAINT fk_parentReference FOREIGN KEY ("parentCommentId")
    REFERENCES "Comments" (id) ON DELETE CASCADE`), (`ALTER TABLE "Comments"
    ADD CONSTRAINT fk_parentReference FOREIGN KEY ("commentRevisions")
    REFERENCES "Comments" (id) ON DELETE CASCADE`));

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Comments');
  }
};
