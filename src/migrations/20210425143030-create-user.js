'use strict';
const bcrypt = require('bcryptjs');

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
      phone: {
        type: Sequelize.STRING(14),
      },
      email: {
        type: Sequelize.STRING(50),
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
      { name: 'Firdaus Alfidai', createdAt, updatedAt },
      { name: 'Hadyan Adam Hermana', createdAt, updatedAt },
      { name: 'Ilham Tajudin', createdAt, updatedAt },
      { name: 'Maulana Malik Ibrahim', createdAt, updatedAt },
      { name: 'Muhammad Dicky Mahfudin', createdAt, updatedAt },
      { name: 'Muhammad Fahmi Maulana', createdAt, updatedAt },
      { name: 'Muhammad Fachrizal', createdAt, updatedAt },
      { name: 'Pungki Ardiansyah', createdAt, updatedAt },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
