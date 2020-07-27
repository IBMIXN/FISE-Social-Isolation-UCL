const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load Manager model
const Manager = require('./models/managerModel');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // Match manager
            Manager.findOne({
                email: email
            }).then(manager => {
                if (!manager) {
                    return done(null, false, {message: 'That email is not registered'});
                }

                // Match password
                bcrypt.compare(password, manager.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, manager);
                    } else {
                        return done(null, false, {message: 'Password incorrect'});
                    }
                });
            });
        })
    );

    passport.serializeUser(function (manager, done) {
        done(null, manager.id);
    });

    passport.deserializeUser(function (id, done) {
        Manager.findById(id, function (err, manager) {
            done(err, manager);
        });
    });
};
