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
	dayOfMonth: Sequelize.SMALLINT,
	month: Sequelize.SMALLINT,
});

const getBirthdaysToday = async (day, month) => {
	return await Birthdays.findAll({
		where: {
			dayOfMonth: day,
			month: month,
		},
	});
};

module.exports = {
	sequelize,
	Birthdays,
	getBirthdaysToday,
};
