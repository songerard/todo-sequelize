const express = require('express')
const session = require('express-session')
const { create } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
// 引用 passport，放在文件上方
const passport = require('passport')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

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

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const db = require('./models')
const Todo = db.Todo
const User = db.User

app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

// 加入 middleware，驗證 reqest 登入狀態
app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})