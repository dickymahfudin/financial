const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const { user, expenditure } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const idrFormat = require('../helpers/idrFormat');

router.get('/', async (req, res, next) => {
  const { username } = req.session;
  return res.render('expenditure/index', { title: 'Expenditure', username });
});

router.post('/', async (req, res, next) => {
  const { user_id, idr, note } = req.body;
  const date = new Date(req.body.date);

  const image = req.file && `/upload/${req.file.filename}`;
  await expenditure.create({
    user_id,
    idr,
    image,
    note,
    createdAt: date,
    updatedAt: date,
  });
  req.flash('success', 'Data Added Successfully');
  return res.redirect('/expenditure');
});

router.post('/:id', async (req, res, next) => {
  const { user_id, idr, note } = req.body;
  const date = new Date(req.body.date);
  const id = req.params.id;
  const tempexpenditure = await expenditure.findByPk(id);
  const image = req.file && `/upload/${req.file.filename}`;
  await tempexpenditure.update({
    user_id,
    idr,
    image,
    note,
    createdAt: date,
    updatedAt: date,
  });
  req.flash('success', 'Data Edit Successfully');
  return res.redirect('/expenditure');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempexpenditure = await expenditure.findByPk(id);
  await tempexpenditure.destroy();
  req.flash('success', 'Delete Successfully');
  return res.redirect('/expenditure');
});

router.get('/form', async (req, res, next) => {
  const findUser = await user.findAll({
    where: { id: { [Op.not]: 1 } },
    order: [['id', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'username'] },
  });
  const value = { user_id: '', idr: '' };
  return res.render('expenditure/form', {
    layout: 'layouts/blank',
    value,
    title: '',
    findUser,
  });
});

router.get('/form/:id', async (req, res, next) => {
  const findUser = await user.findAll({
    where: { id: { [Op.not]: 1 } },
    order: [['id', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'username'] },
  });
  const id = req.params.id;
  const tempValue = await expenditure.findByPk(id);
  const value = {
    user: tempValue.user_id,
    idr: tempValue.idr,
    note: tempValue.note,
    date: moment(tempValue.createdAt).format('YYYY-MM-DD'),
  };
  return res.render('expenditure/form', {
    layout: 'layouts/blank',
    value,
    title: '',
    findUser,
  });
});

router.get('/table', async (req, res, next) => {
  const findexpenditure = await expenditure.findAll({
    include: [
      {
        model: user,
        as: 'user',
        attributes: {
          exclude: ['password'],
        },
      },
    ],
    order: [['id', 'ASC']],
  });
  const tables = findexpenditure.map((expenditure) => {
    return {
      id: expenditure.id,
      user_id: expenditure.user_id,
      image: expenditure.image,
      user: expenditure.user.name,
      idr: idrFormat(expenditure.idr),
      note: expenditure.note,
      date: moment(expenditure.createdAt).format('DD MMMM YYYY'),
    };
  });
  // return res.json(tables);
  return res.json(jsonToTable(tables));
});

module.exports = router;
