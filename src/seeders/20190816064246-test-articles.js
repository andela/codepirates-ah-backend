

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', [
    {
      slug: 'first',
      title: 'title1',
      description: 'description1',
      body: 'body1',
      favorited: false,
      favoritedcount: 0,
      flagged: false,
      authorId: 1,
      images: [''],
      views: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      slug: 'second',
      title: 'title2',
      description: 'description2',
      body: 'body2',
      favorited: false,
      favoritedcount: 0,
      flagged: false,
      authorId: 2,
      images: ['ddd'],
      views: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      slug: 'third',
      title: 'title3',
      description: 'description3',
      body: 'body3',
      favorited: false,
      favoritedcount: 0,
      flagged: false,
      authorId: 1,
      images: [''],
      views: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      slug: 'fourth',
      title: 'title4',
      description: 'description4',
      body: 'body4',
      favorited: false,
      favoritedcount: 0,
      flagged: false,
      authorId: 3,
      images: [''],
      views: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
