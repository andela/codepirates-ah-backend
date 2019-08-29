export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Comments',
    [

      {
        userId: 1,
        articleSlug: 'fakeslug',
        body: 'comment one',
        likesCount: 7,
        likeInfo: 'admin, username, usertwo, userthree, userfour, userfive, usersix, userseven, ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        articleSlug: 'fakeslug',
        body: 'comment two',
        likesCount: 1,
        likeInfo: 'admin, ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        articleSlug: 'fakeslug',
        body: 'comment three',
        likesCount: 0,
        likeInfo: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
