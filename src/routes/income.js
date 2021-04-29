const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const { user, income } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const idrFormat = require('../helpers/idrFormat');
const { BASE_URL, PORT } = process.env;
const url = `http://${BASE_URL}:${PORT}`;

router.get('/', async (req, res, next) => {
  const { username } = req.session;
  return res.render('income/index', { title: 'Income', username });
});

router.post('/', async (req, res, next) => {
  const { user_id, idr } = req.body;
  const date = new Date(req.body.date);
  const findIncome = await income.findAll({
    limit: 1,
    where: { user_id },
    order: [['createdAt', 'DESC']],
  });
  if (findIncome.length > 0) {
    const isSame = moment(findIncome[0].createdAt).isSame(date, 'month');
    console.log(isSame);
    if (isSame) {
      req.flash('error', 'User Already Paid');
      return res.redirect('/income');
    }
  }
  const image = req.file && `${url}/upload/${req.file.filename}`;
  await income.create({
    user_id,
    idr,
    image,
    createdAt: date,
    updatedAt: date,
  });
  req.flash('success', 'Data Added Successfully');
  return res.redirect('/income');
});

router.post('/:id', async (req, res, next) => {
  const { user_id, idr } = req.body;
  const date = new Date(req.body.date);
  console.log(date);
  const id = req.params.id;
  const tempIncome = await income.findByPk(id);
  const image = req.file && `${url}/upload/${req.file.filename}`;
  await tempIncome.update({
    user_id,
    idr,
    image,
    createdAt: date,
    updatedAt: date,
  });
  req.flash('success', 'Data Edit Successfully');
  return res.redirect('/income');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempIncome = await income.findByPk(id);
  await tempIncome.destroy();
  req.flash('success', 'Delete Successfully');
  return res.redirect('/income');
});

router.get('/form', async (req, res, next) => {
  const findUser = await user.findAll({
    where: { id: { [Op.not]: 1 } },
    order: [['id', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'username'] },
  });
  const value = { user_id: '', idr: '' };
  return res.render('income/form', {
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
  const tempValue = await income.findByPk(id);
  const value = {
    user: tempValue.user_id,
    idr: tempValue.idr,
    date: moment(tempValue.createdAt).format('YYYY-MM-DD'),
  };
  return res.render('income/form', {
    layout: 'layouts/blank',
    value,
    title: '',
    findUser,
  });
});

router.get('/table', async (req, res, next) => {
  const findIncome = await income.findAll({
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
  const tables = findIncome.map((income) => {
    return {
      id: income.id,
      user_id: income.user_id,
      image: income.image,
      user: income.user.name,
      idr: idrFormat(income.idr),
      date: moment(income.createdAt).format('DD MMMM YYYY'),
    };
  });
  // return res.json(tables);
  return res.json(jsonToTable(tables));
});

module.exports = router;
