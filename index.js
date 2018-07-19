const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

const MAIORIDADE = 18;

const checkParams = (req, res, next) => {
  const { nome } = req.query;

  if (!nome) {
    res.redirect('/');
    return;
  }

  next();
};

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

// Main route
app.get('/', (req, res) => {
  res.render('main');
});

// Check route
app.post('/check', (req, res) => {
  const { dataNascimento, nome } = req.body;

  const idade = moment().diff(moment(dataNascimento, 'YYYY/MM/DD'), 'years');

  if (idade > MAIORIDADE) {
    res.redirect(`/major?nome=${nome}`);
    return;
  }

  res.redirect(`/minor?nome=${nome}`);
});

// Major route
app.get('/major', checkParams, (req, res) => {
  const { nome } = req.query;

  res.render('major', { nome });
});

// Minor route
app.get('/minor', checkParams, (req, res) => {
  const { nome } = req.query;

  res.render('minor', { nome });
});

app.listen(3000, () => console.log('Servidor rodando'));
