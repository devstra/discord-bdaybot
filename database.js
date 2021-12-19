const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Birthdays = sequelize.define('birthdays', {
	userId: {
		type: Sequelize.STRING,
		unique: true,
	},
	date: Sequelize.STRING,
});

module.exports = {
	sequelize,
	Birthdays,
};
