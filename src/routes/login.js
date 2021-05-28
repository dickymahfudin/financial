const express = require('express');
const router = express.Router();
const { user } = require('../models');

const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('login', { title: 'Login', layout: 'layouts/blank' });
});

router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  const tempUser = await user.findOne({ where: { username } });
  if (!tempUser) {
    req.flash('error', 'Incorrect Username and Password');
    res.redirect('/login');
  }
  const isValidPassword = await bcrypt.compare(password, tempUser.password);
  if (!isValidPassword) {
    req.flash('error', 'Incorrect Username and Password');
    res.redirect('/login');
  }
  req.session.login = true;
  console.log(tempUser);
  req.session.userId = tempUser.id;
  req.session.username = tempUser.name;
  req.flash('success', 'Login Successfully');
  res.redirect('/dashboard');
});

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Register', layout: 'layouts/blank' });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
  });
  res.redirect('/login');
});

module.exports = router;
