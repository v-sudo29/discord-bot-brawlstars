"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CLIENT_TOKEN = process.env.CLIENT_TOKEN ?? '';
const CLIENT_ID = process.env.CLIENT_ID ?? '';
const VI_PLAYER_ID = process.env.VI_PLAYER_ID ?? '';
const AMANDA_PLAYER_ID = process.env.AMANDA_PLAYER_ID ?? '';
const RYAN_PLAYER_ID = process.env.RYAN_PLAYER_ID ?? '';
const ANDY_PLAYER_ID = process.env.ANDY_PLAYER_ID ?? '';
const ALAN_PLAYER_ID = process.env.ALAN_PLAYER_ID ?? '';
const ERIK_PLAYER_ID = process.env.ERIK_PLAYER_ID ?? '';
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
async function registerSlashCommand() {
    const commands = [
        {
            name: "trophies",
            description: "List player rankings",
        },
    ];
    const rest = new discord_js_2.REST().setToken(CLIENT_TOKEN);
    try {
        console.log("Registering commands [/]");
        await rest.put(discord_js_1.Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log("Registered commands! [/]");
    }
    catch (err) {
        console.log(err);
    }
}
exports.client.on("ready", async () => {
    console.log(`${exports.client?.user?.username} is now connected to Discord`);
    // client?.user?.setActivity(`Watching ${client.guilds.cache.size} servers!`)
    exports.client.user.setActivity('Brawlstars');
    registerSlashCommand();
});
exports.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === "trophies") {
        // inside a command, event listener, etc.
        // const exampleEmbed = new EmbedBuilder()
        // .setColor(0x0099FF)
        // .setTitle('Some title')
        // .setURL('https://discord.js.org/')
        // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        // .setDescription('Some description here')
        // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        // .addFields(
        //   { name: 'Regular field title', value: 'Some value here' },
        //   { name: '\u200B', value: '\u200B' },
        //   { name: 'Inline field title', value: 'Some value here', inline: true },
        //   { name: 'Inline field title', value: 'Some value here', inline: true },
        // )
        // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
        // .setImage('https://i.imgur.com/AfFp7pu.png')
        // .setTimestamp()
        // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        // channel.send({ embeds: [exampleEmbed] });
        let viTrophies = null;
        let amandaTrophies = null;
        let ryanTrophies = null;
        let andyTrophies = null;
        let alanTrophies = null;
        let erikTrophies = null;
        let finalReply = '';
        // Fetch data from API
        await axios_1.default.all([
            (0, axios_1.default)(`http://localhost:3000/${VI_PLAYER_ID}`),
            (0, axios_1.default)(`http://localhost:3000/${AMANDA_PLAYER_ID}`),
            (0, axios_1.default)(`http://localhost:3000/${RYAN_PLAYER_ID}`),
            (0, axios_1.default)(`http://localhost:3000/${ANDY_PLAYER_ID}`),
            (0, axios_1.default)(`http://localhost:3000/${ALAN_PLAYER_ID}`),
            (0, axios_1.default)(`http://localhost:3000/${ERIK_PLAYER_ID}`),
        ])
            .then(axios_1.default.spread((viData, amandaData, ryanData, andyData, alanData, erikData) => {
            viTrophies = viData.data.trophies + ' --------Vi';
            amandaTrophies = amandaData.data.trophies + ' --------Amanda';
            ryanTrophies = ryanData.data.trophies + ' --------Ryan';
            andyTrophies = andyData.data.trophies + ' --------Andy';
            alanTrophies = alanData.data.trophies + ' --------Alan';
            erikTrophies = erikData.data.trophies + ' --------Erik';
            let playersArr = [
                viTrophies,
                amandaTrophies,
                ryanTrophies,
                andyTrophies,
                alanTrophies,
                erikTrophies
            ];
            // Sort trophies from highest to lowest
            let sortedPlayers = playersArr.sort((a, b) => {
                let playerA = parseInt(a.split(' ')[0]);
                let playerB = parseInt(b.split(' ')[0]);
                if (playerA > playerB)
                    return -1;
                if (playerB > playerA)
                    return 1;
                return 0;
            });
            // Add rankings
            for (let i = 0; i < sortedPlayers.length; i++) {
                const playerName = sortedPlayers[i].split(' ')[1];
                const convertedTrophiesNum = parseInt(sortedPlayers[i].split(' ')[0]).toLocaleString();
                sortedPlayers[i] = convertedTrophiesNum + playerName;
                sortedPlayers[i] = `${i + 1}. ${sortedPlayers[i]}`;
            }
            // Convert to string
            finalReply = sortedPlayers.join('\n');
            console.log(finalReply);
        }))
            .catch(error => {
            console.log(error);
        });
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('Random')
            .setTitle('Trophies')
            .setDescription(`${finalReply}`)
            .setTimestamp();
        interaction.reply({
            // content: `${finalReply}`,
            embeds: [embed]
        });
    }
});
exports.client.login(CLIENT_TOKEN);
//# sourceMappingURL=client.js.map