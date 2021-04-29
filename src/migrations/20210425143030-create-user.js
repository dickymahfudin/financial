'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(30),
      },
      username: {
        type: Sequelize.STRING(30),
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    const createdAt = new Date();
    const updatedAt = new Date();
    const password = await bcrypt.hash('adminekuping', 10);
    const admin = 'Admin Ekuping';
    queryInterface.bulkInsert('users', [
      { name: admin, username: 'admin', password, createdAt, updatedAt },
      { name: 'Agisna Gusti Ainun', createdAt, updatedAt },
      { name: 'Fadil Gunawan', createdAt, updatedAt },
      { name: 'Hadyan Adam Hermana', createdAt, updatedAt },
      { name: 'Ilham Tajudin', createdAt, updatedAt },
      { name: 'Maulana Malik Ibrahim', createdAt, updatedAt },
      { name: 'M Fahmi Maulana', createdAt, updatedAt },
      { name: 'M Dicky Mahfudin', createdAt, updatedAt },
      { name: 'pungki', createdAt, updatedAt },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
