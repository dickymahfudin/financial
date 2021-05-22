const express = require('express');
const jsonToTable = require('../helpers/jsonToTable');
const { user } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const { username } = req.session;
  return res.render('users/index', { title: 'User', username });
});

router.post('/', async (req, res, next) => {
  const { name, phone, email } = req.body;
  const findName = await user.findOne({ where: { name } });
  if (findName) {
    req.flash('error', 'Name Already Exist');
    return res.redirect('/user');
  }
  await user.create({ name, phone, email });
  req.flash('success', 'Data Added Successfully');
  return res.redirect('/user');
});

router.post('/:id', async (req, res, next) => {
  const { name, phone, email } = req.body;
  const id = req.params.id;
  console.log(name);
  const tempName = await user.findByPk(id);
  await tempName.update({ name, phone, email });
  req.flash('success', 'Data Edit Successfully');
  return res.redirect('/user');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const tempUser = await user.findByPk(id);
  await tempUser.destroy();
  req.flash('success', 'Delete Successfully');
  return res.redirect('/user');
});

router.get('/form', async (req, res, next) => {
  const value = { name: '', bobot: '' };
  return res.render('users/form', {
    layout: 'layouts/blank',
    value,
    title: '',
  });
});

router.get('/form/:id', async (req, res, next) => {
  const id = req.params.id;
  const value = await user.findByPk(id);
  return res.render('users/form', {
    layout: 'layouts/blank',
    value,
    title: '',
  });
});

router.get('/table', async (req, res, next) => {
  const tables = await user.findAll({
    where: { id: { [Op.not]: 1 } },
    order: [['id', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'username'] },
  });
  return res.json(jsonToTable(tables, 'dataValues'));
});

module.exports = router;
