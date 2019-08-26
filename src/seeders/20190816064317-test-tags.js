

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Tags', [
    {
      name: 'tag1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'tag2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'tag11',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
