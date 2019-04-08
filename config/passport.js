const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("../models/User");

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({
			where: {
				username: {
					[Op.eq]: username
				}
			}
		})
			.then(user => {
				if (!user || !user.validatePassword(password)) {
					return done(null, false, {
						errors: [{ msg: "Username or Password is Invalid." }]
					});
				}

				return done(null, user);
			})
			.catch(done);
	})
);
