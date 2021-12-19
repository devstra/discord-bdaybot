const { SlashCommandBuilder, time } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const timeString = time(new Date());
		await interaction.reply(timeString);
	},
};
