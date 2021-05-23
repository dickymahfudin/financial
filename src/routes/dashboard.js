const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const { user, income, expenditure } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const idrFormat = require('../helpers/idrFormat');

const sum = (arr, param) =>
  arr.map((val) => val[param]).reduce((acc, val) => +(acc + val).toFixed(3));

router.get('/', async (req, res, next) => {
  const { username } = req.session;
  const findUser = await user.findAll({
    where: { id: { [Op.not]: 1 } },
    order: [['id', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'username'] },
  });
  const findIncome = await income.findAll();
  const findexpenditure = await expenditure.findAll();
  const sumIncome = findIncome.length > 0 ? sum(findIncome, 'idr') : 0;
  const sumexpenditure =
    findexpenditure.length > 0 ? sum(findexpenditure, 'idr') : 0;
  const idrIncome = idrFormat(sumIncome - sumexpenditure);
  const date = moment().format('MMMM YYYY');
  const data = {
    user: findUser.length,
    income: idrFormat(sumIncome),
    expenditure: idrFormat(sumexpenditure),
    idrIncome,
    date,
  };
  return res.render('dashboard', { title: 'Dashboard', username, data });
});

router.get('/table', async (req, res, next) => {
  const { date } = req.query;
  console.log(date);
  let between = [moment().startOf('month'), moment().endOf('month')];
  if (date) {
    const temp = date.split('-');
    temp.splice(1, 0, '01');
    const formatDate = new Date(temp.join('-'));
    between = [
      moment(formatDate).startOf('month'),
      moment(formatDate).endOf('month'),
    ];
  }
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
    where: {
      createdAt: {
        [Op.between]: between,
      },
    },
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
