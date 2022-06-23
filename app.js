const express = require('express')
const cors = require('cors')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MongoStore = require('connect-mongo');
const path = require('path')
const app = express()

const User = require('./models/users')

const userRoute = require('./routes/users')
const mainRoute = require('./routes/main')
//---------------------Set up-------------------------------
// app.use(cors(
//     {origin: "http://localhost:3000"}
// ))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

//-----SESSION-----
const secret = process.env.SECRET || 'thisisasecret'
const mongoUrl = process.env.MONGO_URL
const store = new MongoStore({
    mongoUrl,
    secret,
    // resave: false, //don't save session if unmodified
    touchAfter: 24 * 3600 // time period in seconds to resave
})

const sessionConfig = {
    name: 'blaahhh', // For hide the sesion
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, //HTPPS
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// PASSPORT
app.use(passport.initialize()) //passport
app.use(passport.session()) //passport
passport.use(new LocalStrategy(User.authenticate())); // passport-local-mongoose
passport.serializeUser(User.serializeUser()); // passport-local-mongoose
passport.deserializeUser(User.deserializeUser());// passport-local-mongoose

app.use((req, res, next)=>{
    res.locals.currentUser = req.user 
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/', (req, res)=>{
    res.render('home.ejs')
})

app.use('/', userRoute)
app.use('/mainpage', mainRoute)

//-----ERROR HANDLER
app.all('*', (req, res)=>{
    throw new ExpressError('Page not found', 404)
})

app.use((err, req, res, next)=>{
    const {message = 'Something went wrong', statusCode = 500} = err
    res.status(statusCode).render('error', {message, statusCode, err})
})

module.exports = app