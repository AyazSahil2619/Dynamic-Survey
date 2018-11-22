const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User_controller = require('./User_controller')


passport.use('local', new LocalStrategy(
    async function (username, password, done) {
        var user;
        try {
            console.log(username,"1111")
            user = await User_controller.login(username)
            console.log(user);
            if (!user) {
                return done(null, false);
            } else {
                isMatch = await User_controller.comparePassword(password, user.password)
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }
        } catch (err) {
            done(err);
        }

    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


// successRedirect
function islogin(req, res) {
    console.log("SUCCESSFULLY LOGGED IN");
    // console.log(req.session.passport.user.username);
    if (req.isAuthenticated()) {
        // req.session.user = req.user.email;
        res.status(200).json({
            msg: req.user
        });
    }
}


// FailureRedirect
function loginerr(req, res) {
    console.log("LOGIN FAILED");
    res.json({
        msg: "INVALID"
    });
}

// To check whether any user is login or not
function login(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({
            msg: "INVALID"
        })
    }
}

// TO log out 
function logout(req, res, next) {

    if (req.isAuthenticated()) {
        req.logout();
        console.log(req.session.passport.user, 'iiiiiiiii');
        res.status(200).json({
            msg: "Logout"
        })
    } else {
        res.status(400).json({
            msg: "Login First"
        })
    }
}


module.exports = {

    login,
    islogin,
    loginerr,
    logout

}