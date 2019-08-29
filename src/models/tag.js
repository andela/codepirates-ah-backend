module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        name: DataTypes.STRING,
    }, {});
    Tag.associate = function (models) {
        Tag.belongsToMany(models.Article, {
            through: 'ArticleTags',
            foreignKey: 'tagId',
            as: 'articles'
        })
    };
    return Tag;
};