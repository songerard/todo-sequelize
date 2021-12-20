const express = require('express')
const session = require('express-session')
const { create } = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
// 引用 passport，放在文件上方
const passport = require('passport')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

const routes = require('./routes')

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

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})