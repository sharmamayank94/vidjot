const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
 
const app = express(); 

//load routers
const users = require('./routers/Users.js');
const ideas = require('./routers/ideas');

//Passport config
require('./config/passport')(passport);

// connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{useNewUrlParser: true})
.then(()=>console.log('MongoDB Connected...'))
.catch(err =>console.log(err));


//handle bar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

//Method override middleware 
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
}));
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next){
    console.log(req.user);
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user||null;
    next();
})

//Index route
app.get('/', (req, res)=>{
   const title = 'welcome';
    res.render('index',{
        title:title
    });
});

//about route
app.get('/about', (req, res)=>{
    res.render('about');
});

app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});