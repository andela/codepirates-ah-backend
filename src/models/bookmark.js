'use strict';
module.exports = (sequelize, DataTypes) => {
    const BookMark = sequelize.define('BookMark', {
        articleId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        collection: DataTypes.STRING
    }, {});
    BookMark.associate = function (models) {
        BookMark.belongsTo(models.Article, { foreignKey: 'articleId' })
        BookMark.belongsTo(models.user, { foreignKey: 'userId' })
    };
    return BookMark;
};

