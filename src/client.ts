import { Client, GatewayIntentBits, Routes, EmbedBuilder } from 'discord.js'
import { REST } from 'discord.js'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const CLIENT_TOKEN = process.env.CLIENT_TOKEN ?? ''
const CLIENT_ID = process.env.CLIENT_ID ?? ''

const VI_PLAYER_ID = process.env.VI_PLAYER_ID ?? ''
const AMANDA_PLAYER_ID = process.env.AMANDA_PLAYER_ID ?? ''
const RYAN_PLAYER_ID = process.env.RYAN_PLAYER_ID ?? ''
const ANDY_PLAYER_ID = process.env.ANDY_PLAYER_ID ?? ''
const ALAN_PLAYER_ID = process.env.ALAN_PLAYER_ID ?? ''
const ERIK_PLAYER_ID = process.env.ERIK_PLAYER_ID ?? ''

const SERVER_URL = process.env.SERVER_URL ?? ''

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

async function registerSlashCommand() {
  const commands = [
    {
      name: "trophies",
      description: "List player rankings",
    },
  ]

  const rest = new REST().setToken(CLIENT_TOKEN)

  try {
    console.log("Registering commands [/]")
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    console.log("Registered commands! [/]")
  } catch (err) {
    console.log(err)
  }
}

client.on("ready", async () => {
  console.log(`${client?.user?.username} is now connected to Discord`)
  // client?.user?.setActivity(`Watching ${client.guilds.cache.size} servers!`)
  client.user.setActivity('Brawlstars')
  registerSlashCommand()
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return
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

    let viTrophies = null
    let amandaTrophies = null
    let ryanTrophies = null
    let andyTrophies = null
    let alanTrophies = null
    let erikTrophies = null
    let finalReply = ''

    // Fetch data from API
    await axios.all([
      axios(`${SERVER_URL + VI_PLAYER_ID}`),
      axios(`${SERVER_URL + AMANDA_PLAYER_ID}`),
      axios(`${SERVER_URL + RYAN_PLAYER_ID}`),
      axios(`${SERVER_URL + ANDY_PLAYER_ID}`),
      axios(`${SERVER_URL + ALAN_PLAYER_ID}`),
      axios(`${SERVER_URL + ERIK_PLAYER_ID}`),
    ])
      .then(axios.spread((
        viData,
        amandaData,
        ryanData,
        andyData,
        alanData,
        erikData
      ) => {
        viTrophies = viData.data.trophies + ' --------Vi'
        amandaTrophies = amandaData.data.trophies + ' --------Amanda'
        ryanTrophies = ryanData.data.trophies + ' --------Ryan'
        andyTrophies = andyData.data.trophies + ' --------Andy'
        alanTrophies = alanData.data.trophies + ' --------Alan'
        erikTrophies = erikData.data.trophies + ' --------Erik'

        let playersArr = [
          viTrophies,
          amandaTrophies,
          ryanTrophies,
          andyTrophies,
          alanTrophies,
          erikTrophies
        ]

        // Sort trophies from highest to lowest
        let sortedPlayers = playersArr.sort((a, b) => {
          let playerA = parseInt(a.split(' ')[0])
          let playerB = parseInt(b.split(' ')[0])

          if (playerA > playerB) return -1
          if (playerB > playerA) return 1
          return 0
        })

        // Add rankings
        for (let i = 0; i < sortedPlayers.length; i++) {
          const playerName = sortedPlayers[i].split(' ')[1]
          const convertedTrophiesNum = parseInt(sortedPlayers[i].split(' ')[0]).toLocaleString() 
          sortedPlayers[i] = convertedTrophiesNum + playerName
          sortedPlayers[i] = `${i + 1}. ${sortedPlayers[i]}`
        }

        // Convert to string
        finalReply = sortedPlayers.join('\n')
        console.log(finalReply)
      }))

      .catch(error => {
        console.log(error)
      })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('Trophies')
      .setDescription(`${finalReply}`)
      .setTimestamp()

    interaction.reply({
      // content: `${finalReply}`,
      embeds: [embed]
    })
  }
})

client.login(CLIENT_TOKEN)