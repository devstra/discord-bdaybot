const {
	SlashCommandBuilder,
	memberNicknameMention,
} = require('@discordjs/builders');
const { dateToFRString } = require('../utils');
const { Birthdays } = require('../database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birthday')
		.setDescription('Birthday reminders')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('set')
				.setDescription('Registers a birthday')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The birthday boy/girl')
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('day')
						.setDescription('Day (number)')
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('month')
						.setDescription('Month (number)')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('del')
				.setDescription('Deletes a registered birthday')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The birthday boy/girl')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('list')
				.setDescription('Lists the registered birthdays')
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'set') {
			const user = interaction.options.getUser('user');
			const day = interaction.options.getInteger('day');
			const month = interaction.options.getInteger('month');

			if (day < 1 || day > 31) {
				return interaction.reply({
					content: 'The day must be a number between 1 and 31.',
					ephemeral: true,
				});
			}
			if (month < 1 || month > 12) {
				return interaction.reply({
					content: 'The month must be a number between 1 and 12.',
					ephemeral: true,
				});
			}
			try {
				await Birthdays.create({
					userId: user.id,
					dayOfMonth: day,
					month: month,
				});
				return interaction.reply({
					content: `${user.username}'s birthday (${dateToFRString(
						day,
						month
					)}) was added.`,
					ephemeral: true,
				});
			} catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply({
						content: `${user.username}'s birthday already exists.`,
						ephemeral: true,
					});
				}
				console.error(error);
				return interaction.reply({
					content: 'Something went wrong.',
					ephemeral: true,
				});
			}
		} else if (interaction.options.getSubcommand() === 'del') {
			const user = interaction.options.getUser('user');

			const rowCount = await Birthdays.destroy({
				where: { userId: user.id },
			});

			if (!rowCount) {
				return interaction.reply({
					content: `${user.username}'s birthday isn't registered.`,
					ephemeral: true,
				});
			}

			return interaction.reply({
				content: 'Birthday deleted.',
				ephemeral: true,
			});
		} else if (interaction.options.getSubcommand() === 'list') {
			const birthdayList = await Birthdays.findAll();

			try {
				const birthdayString =
					birthdayList
						.map(
							(b) =>
								`${memberNicknameMention(
									b.userId
								)} -> ${dateToFRString(b.dayOfMonth, b.month)}`
						)
						.join('\n') || 'No birthdays to display';
				console.log(birthdayList);
				console.log(birthdayString);
				return interaction.reply({
					content: birthdayString,
					ephemeral: true,
				});
			} catch (error) {
				console.error(error);
				return interaction.reply({
					content: 'Invalid date',
					ephemeral: true,
				});
			}
		} else {
			return interaction.reply({
				content: 'Not a valid command.',
				ephemeral: true,
			});
		}
	},
};
