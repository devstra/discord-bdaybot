const frMonths = [
	'Janvier',
	'Février',
	'Mars',
	'Avril',
	'Mai',
	'Juin',
	'Juillet',
	'Août',
	'Septembre',
	'Octobre',
	'Novembre',
	'Décembre',
];

const dateToFRString = (dayOfMonth, month) => {
	if (month < 1 || month > 12) {
		throw new Error('Invalid month');
	}
	return `${dayOfMonth} ${frMonths[month - 1]}`;
};

module.exports = { dateToFRString };
