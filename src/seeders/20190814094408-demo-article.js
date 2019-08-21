export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Articles',
    [

      {
        slug: 'fakeslug',
        title: 'faketitle',
        description: 'fakedescription',
        body: 'fakebody',
        taglist: ['asdf', 'sdfsf'],
        favorited: true,
        favoritedcount: 12,
        flagged: true,
        authorId: 1,
        images: ['dddd'],
        views: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
