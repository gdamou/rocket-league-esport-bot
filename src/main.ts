import 'dotenv/config';
import { Client, EmbedBuilder, Events } from 'discord.js';
import { scrapeMatchups } from './helpers/scrapeMatchups';

console.log('Bot is starting...');

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content.includes('!bracket') && message.channelId === process.env.CHANNEL_ID) {
        const groupedMatchups = await scrapeMatchups();
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Rocket League Worlds Playoffs Matchups Update')
            .setURL(process.env.SCRAPE_URL)
            .setAuthor({
                name: 'RL Worlds Playoffs Bot',
                iconURL:
                    'https://static.wikia.nocookie.net/rocketleague/images/9/97/RLCS_decal_icon.png/revision/latest?cb=20170602233629',
                url: 'https://discord.js.org', // Replace BOT_IMAGE_LINK with an appropriate image if desired
            })
            .setDescription('Latest matchups from Liquipedia:')
            .setThumbnail('https://www.breakflip.com/uploads/64afcb82523d4-date-worlds-rocket-league-2023.jpg') // Replace with Rocket League or relevant logo
            .setTimestamp()
            .setFooter({
                text: 'Matchups updated',
                iconURL: 'https://liquipedia.net/images/liquipedia_logo.png',
            });

        for (const header of Object.keys(groupedMatchups)) {
            embed.addFields({
                name: header,
                value: groupedMatchups[header].join('\n'),
                inline: true,
            });
        }

        message.reply({ embeds: [embed] });
    }
});

client.login(process.env.BOT_TOKEN);
