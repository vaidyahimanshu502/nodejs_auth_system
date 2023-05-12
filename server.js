const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local')
const passportGoogle = require('./config/google-oauth');
const customMWare = require('./config/flash_middleware');
// const db = await mongoose.connect(process.env.mongoDB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
const flash = require('connect-flash');

const port = process.env.port || 8000
const app = express();

//setup url encoded with body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.urlencoded())
app.use(cookieParser());


//setup express ejs layouts
app.use('/', expressLayouts);

//accessing assets files from front-end
app.use(express.static('assets'));

//setup view-engibe--> ejs
app.set('view engine', 'ejs');
app.set('views', './views');


// session creation
//creating authentication by passport
//mongo store used to store the session cookie in the db
app.use(session
    ({
    name: 'system-oauth',
    // TODO change the secret before deployment in production mode
    secret: process.env.secret_key,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: 
    {
        maxAge: (1000 * 60 * 100),
        touchAfter:5000
    },
    store : mongoStore.create(
          {
            mongoUrl: process.env.mongoDB_URL,
            autoRemove:'disabled',
            stringify: false,
          },
        function(err) {
            console.log(err || 'Connected to mongodb successfully !!');
        }
    )
}))
app.use(passport.initialize());
app.use(passport.session());

//set authentication from passport
app.use(passport.setAuthenticatedUser);

//for flash messages
app.use(flash());
app.use(customMWare.setFlash)

//accessing routes
app.use('/', require('./routers'));

//server firing method with mongoDB connection
module.exports.startServer = async () => {
    try {
        await mongoose.connect(process.env.mongoDB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected with :: MongoDB");
        
        app.listen(port, (err) =>{
            if(err) {
                throw new Error(err);
            }
            console.log(`${process.env.environment} server starts at port ${port}`);
        })
    } catch (error) {
        console.log('error', error);
    }
}
