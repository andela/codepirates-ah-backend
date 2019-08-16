module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    slug: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    taglist: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    favorited: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    favoritedcount: { type: DataTypes.INTEGER, defaultValue: 0 },
    flagged: { type: DataTypes.BOOLEAN, defaultValue: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    views: DataTypes.INTEGER
  }, {});
  Article.associate = function (models) {
    Article.belongsTo(models.user, {
      as: 'author',
      targetKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  };
  return Article;
};
