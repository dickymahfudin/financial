require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('express-flash');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const multer = require('multer');
const middleware = require('./src/helpers/middleware');
const dasboardRouter = require('./src/routes/dashboard');
const userRouter = require('./src/routes/user');
const incomeRouter = require('./src/routes/income');
const expenditureRouter = require('./src/routes/expenditure');
const loginRouter = require('./src/routes/login');

const PORT = process.env.PORT || 5000;
const logger = require('morgan');
const app = express();
app.use(logger('dev'));
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000000 },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret',
  })
);
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/upload'));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: diskStorage });

app.use(flash());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
app.set('layout', './layouts/index');

app.use('/login', loginRouter);
app.use('/dashboard', middleware, dasboardRouter);
app.use('/user', middleware, userRouter);
app.use('/income', middleware, upload.single('image'), incomeRouter);
app.use('/expenditure', middleware, upload.single('image'), expenditureRouter);
app.use('*', middleware, (req, res) => res.redirect('/dashboard'));

app.listen(PORT, () =>
  console.info(`Server Running on : http://localhost:${PORT}`)
);
