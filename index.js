const fs = require('fs');
const { Birthdays, getBirthdaysToday } = require('./database');
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

cron.schedule('*/30 * * * * *', () => {
	// '30 8 * * *'
	// TODO: fetch current date in Paris timezone and pass it to getBirthdaysToday()
	// to check if today is someone's birthday
	const today = new Date();
	console.log(today.getDate());
	console.log(today.getMonth());
	getBirthdaysToday(24, 7).then(console.log);
});

client.login(token);
