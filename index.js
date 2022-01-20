const fs = require('fs');
const {
	memberNicknameMention,
} = require('@discordjs/builders');
const { Birthdays, getBirthdaysToday } = require('./database');
const moment = require('moment-timezone');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const cron = require('node-cron');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	Birthdays.sync();
	console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

// every day at 8 AM
// '30 8 * * *'
cron.schedule('*/30 * * * * *', () => {
	const today = moment.utc().tz('Europe/Paris');
	getBirthdaysToday(today.date(), today.month() + 1).then(bdays => {

		bdays.forEach(b => {
			birthdayChannel.send(`@everyone C'est l'anniversaire de ${memberNicknameMention(b.userId)} aujourd'hui 🥳!`);
		});
	});

});

client.login(token);
