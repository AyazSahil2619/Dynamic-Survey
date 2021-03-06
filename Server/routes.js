const express = require('express');
const bodyparser = require('body-parser');
const app = express();
var session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');


const User_controller = require('./login/User_controller')
const validate = require('./validation/validation')
const controller = require('./database/database_controller');
const operations = require('./operations/operation_controller');
const check = require('./login/passport')


app.use(cors())
app.use(express.static('../client'));

app.use(require('express-session')({
    secret: 'shhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));


// Routes for registration
app.post('/register', validate.validateInsert, User_controller.insert);

// Routes for LOGIN and LOG OUT
app.post('/login', passport.authenticate('local', {
    successRedirect: '/islogin',
    failureRedirect: '/login'
}));
app.get('/islogin', check.islogin);
app.get('/login', check.loginerr)

app.get('/logout', check.logout)


app.use(check.login);


// Routes for Table Manipulation

app.post('/checkTablename', controller.checkTablename);
app.post('/create', controller.CreateTable);
app.get('/getdata', controller.viewTable);
app.delete('/delete/:id', controller.deleteTable);
app.put('/modified/:id', controller.modifyTable);
// app.get('/fetchTableDetails/:id', controller.TableData);
app.get('/tabledata/:id', controller.TableData);
app.put('/editTable/:id', controller.editTable);



// Routes for operations in table

app.get('/view/:id', operations.view);
app.put('/update/:id', operations.addDataToTable);
app.get('/fetchdata/:id', operations.TableData);
app.delete('/deletedata/:tableid/:rowid', operations.deleteData)
app.get('/updatedata/:tableid/:uid', operations.getdetails)
app.put('/updaterow/:id', operations.updateRow);
app.get('/dropdown/:id', operations.fetchDropdownList);






module.exports = app;