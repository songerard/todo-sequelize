const express = require('express')
const { create } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000

const hbs = create({
  // layoutsDir: `/views/layouts`,
  extname: `hbs`,
  defaultLayout: 'main'
});

// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const db = require('./models')
const Todo = db.Todo
const User = db.User

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => res.redirect('/'))
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})