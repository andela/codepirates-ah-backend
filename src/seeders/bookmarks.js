export default {
  up: queryInterface => queryInterface.bulkInsert('BookMarks', [
    {
      articleId: 1,
      userId: 1,
      name: 'Nigerian jolof',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      articleId: 2,
      userId: 1,
      name: ' ',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      articleId: 2,
      userId: 1,
      name: 'Survival skills',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      articleId: 3,
      userId: 1,
      name: 'kuku',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
