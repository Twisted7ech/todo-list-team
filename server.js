//use express
const express = require('express')
const app = express()
//helper for mongoDB
const mongoose = require('mongoose')
//helper for authentication, built in strategies for security
// currently local strategy - /config/passport.js
const passport = require('passport')
//keeps track of logged in users - cookie stored on client pc
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
//notification for invalid login
//notification for invalid credentials in create account
const flash = require('express-flash')
//logger / simple debugger
const logger = require('morgan')
//connection to mongo db database
const connectDB = require('./config/database')

//routes 
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

//use environmental variables /location
require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

//time to connect to Database
connectDB()

//use ejs for views
app.set('view engine', 'ejs')

//use public folder for files
app.use(express.static('public'))

//enables us to look at requests from client
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//log requests through morgan
app.use(logger('dev'))

// Sessions
app.use(
    session({
      // randomizing
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      // store session data in database
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
// use flash for alerts
app.use(flash())

// routers
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)

//listen
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    